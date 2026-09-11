import type { MetadataRoute } from 'next';
import { company } from '@/config/company';
import { serverSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = ['', '/calculadora', '/obras'].map((p) => ({
    url: company.siteUrl + p,
    changeFrequency: 'weekly',
    priority: p ? 0.8 : 1,
  }));
  if (isSupabaseConfigured()) {
    const db = await serverSupabase();
    for (let start = 0; ; start += 500) {
      const { data, error } = await db
        .from('projects')
        .select('slug,updated_at')
        .eq('status', 'published')
        .order('id')
        .range(start, start + 499);
      if (error) throw Error('Erro ao gerar sitemap.');
      routes.push(
        ...data.map((p) => ({
          url: `${company.siteUrl}/obras/${p.slug}`,
          lastModified: p.updated_at,
        })),
      );
      if (data.length < 500) break;
    }
  }
  return routes;
}
