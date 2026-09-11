import { publicProjects } from '@/lib/projects/queries';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const s = new URL(request.url).searchParams;
  try {
    return Response.json(
      await publicProjects({
        page: Math.max(0, Math.min(10000, Number(s.get('page')) || 0)),
        category: s.get('category') || undefined,
        state: s.get('state') || undefined,
        search: s.get('search') || undefined,
      }),
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch {
    return Response.json(
      { error: 'Não foi possível carregar as obras. Tente novamente.' },
      { status: 503 },
    );
  }
}
