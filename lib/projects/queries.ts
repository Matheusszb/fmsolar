import 'server-only';
import { serverSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { Project } from './types';
export function withImages(p: Project): Project {
  return {
    ...p,
    project_images: (p.project_images || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((i) => ({ ...i, url: `/api/images/${i.id}` })),
    cover_url: p.cover_image ? `/api/images/${p.cover_image}` : undefined,
  };
}
export async function publicProjects(
  options: {
    featured?: boolean;
    page?: number;
    category?: string;
    state?: string;
    search?: string;
  } = {},
) {
  if (!isSupabaseConfigured()) return { projects: [] as Project[], count: 0 };
  const db = await serverSupabase();
  let q = db
    .from('projects')
    .select('*, project_images!project_images_project_id_fkey(*)', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (options.featured) q = q.eq('featured', true);
  if (options.category) q = q.eq('category', options.category);
  if (options.state) q = q.eq('state', options.state);
  if (options.search) {
    const term = options.search.replace(/[^\p{L}\p{N} -]/gu, '').slice(0, 100);
    if (term) q = q.or(`title.ilike.%${term}%,city.ilike.%${term}%`);
  }
  const start = (options.page || 0) * 12;
  const { data, error, count } = await q.range(start, start + (options.featured ? 2 : 11));
  if (error) throw new Error('Não foi possível carregar as obras. Tente novamente.');
  return { projects: (data as Project[]).map(withImages), count: count || 0 };
}
export async function projectBySlug(slug: string) {
  if (!isSupabaseConfigured()) return null;
  const db = await serverSupabase();
  const { data, error } = await db
    .from('projects')
    .select('*,project_images!project_images_project_id_fkey(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw new Error('Não foi possível carregar este projeto.');
  return data ? withImages(data as Project) : null;
}
