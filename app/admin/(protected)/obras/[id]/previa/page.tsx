import { requireAdmin } from '@/lib/supabase/server';
import { withImages } from '@/lib/projects/queries';
import type { Project } from '@/lib/projects/types';
import { ProjectDetail } from '@/components/projects/detail';
import { notFound } from 'next/navigation';
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { db } = await requireAdmin();
  const { id } = await params;
  const { data, error } = await db
    .from('projects')
    .select('*,project_images(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw Error('Erro ao carregar prévia.');
  if (!data) notFound();
  return <ProjectDetail project={withImages(data as Project)} preview />;
}
