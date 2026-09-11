import { requireAdmin } from '@/lib/supabase/server';
import { withImages } from '@/lib/projects/queries';
import type { Project } from '@/lib/projects/types';
import { notFound } from 'next/navigation';
import { ProjectForm } from '@/components/admin/project-form';
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { db } = await requireAdmin();
  const { id } = await params;
  const { data, error } = await db
    .from('projects')
    .select('*,project_images!project_images_project_id_fkey(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw Error('Erro ao carregar obra.');
  if (!data) notFound();
  return <ProjectForm initial={withImages(data as Project)} />;
}
