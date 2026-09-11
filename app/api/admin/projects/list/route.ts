import { adminApi, apiError } from '@/lib/admin-api';
export async function GET(request: Request) {
  try {
    const { db } = await adminApi(request);
    const s = new URL(request.url).searchParams;
    const page = Math.max(0, Number(s.get('page')) || 0);
    const sort = s.get('sort');
    let q = db
      .from('projects')
      .select(
        'id,title,slug,city,state,category,power_kwp,status,featured,cover_image,updated_at',
        { count: 'exact' },
      )
      .order(sort === 'title' ? 'title' : sort === 'power' ? 'power_kwp' : 'created_at', {
        ascending: sort === 'oldest' || sort === 'title',
      });
    const filter = s.get('filter');
    if (filter === 'published' || filter === 'draft') q = q.eq('status', filter);
    if (filter === 'featured') q = q.eq('featured', true);
    const search = (s.get('search') || '').replace(/[^\p{L}\p{N} -]/gu, '').slice(0, 100);
    if (search) q = q.ilike('title', `%${search}%`);
    const { data, count, error } = await q.range(page * 12, page * 12 + 11);
    if (error) throw Error('Erro ao carregar obras.');
    return Response.json({ projects: data, count }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return apiError(e);
  }
}
