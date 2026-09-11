import { serverSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
export const dynamic = 'force-dynamic';
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) return new Response(null, { status: 404 });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return new Response(null, { status: 404 });
  const db = await serverSupabase();
  const { data } = await db
    .from('project_images')
    .select('storage_path')
    .eq('id', id)
    .maybeSingle();
  if (!data) return new Response(null, { status: 404 });
  const { data: blob, error } = await db.storage.from('obras').download(data.storage_path);
  if (error || !blob) return new Response(null, { status: 404 });
  return new Response(blob, {
    headers: {
      'Content-Type': blob.type,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
