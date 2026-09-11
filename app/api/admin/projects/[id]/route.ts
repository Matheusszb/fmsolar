import { adminApi, apiError } from '@/lib/admin-api';
import { projectSchema } from '@/lib/projects/validators';
import { slugify } from '@/lib/projects/slug';
import { gallerySchema } from '@/lib/projects/gallery-schema';
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await adminApi(request);
    const { id } = await params;
    const body = await request.json();
    const input = projectSchema.parse(body.project);
    const gallery = gallerySchema.parse(body.gallery);
    const { error } = await db.rpc('save_complete_project', {
      p_id: id,
      p_data: input,
      p_images: gallery.images,
      p_cover: gallery.cover,
      p_before: gallery.before,
      p_after: gallery.after,
    });
    const data = { id };
    if (error)
      throw Error(
        error.code === '23505' ? 'Este slug já existe. Escolha outro.' : 'Erro ao salvar obra.',
      );
    return Response.json(data);
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db, user } = await adminApi(request);
    const { id } = await params;
    const { action } = await request.json();
    const { data: p, error: readError } = await db
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    if (readError || !p) throw Error('Obra não encontrada.');
    if (action === 'duplicate') {
      const input = projectSchema.parse({
        ...p,
        title: `Cópia de ${p.title}`.slice(0, 180),
        slug: `${slugify(p.title).slice(0, 120)}-${crypto.randomUUID().slice(0, 8)}`,
        status: 'draft',
        featured: false,
      });
      const { data, error } = await db
        .from('projects')
        .insert({ ...input, created_by: user.id })
        .select('id')
        .single();
      if (error) throw Error('Erro ao duplicar obra.');
      return Response.json(data);
    }
    if (action !== 'publish' && action !== 'draft') throw Error('Ação inválida.');
    const input = projectSchema.parse({
      ...p,
      status: action === 'publish' ? 'published' : 'draft',
    });
    const { error } = await db.from('projects').update({ status: input.status }).eq('id', id);
    if (error) throw Error('Erro ao alterar publicação.');
    return Response.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await adminApi(request);
    const { id } = await params;
    const { error: draftError } = await db
      .from('projects')
      .update({ status: 'draft' })
      .eq('id', id);
    if (draftError) throw Error('Não foi possível despublicar a obra para excluir.');
    // Keep the draft record on storage failures, allowing the administrator to retry safely.
    for (;;) {
      const { data: files, error } = await db.storage.from('obras').list(id, { limit: 100 });
      if (error)
        throw Error(
          'Erro ao listar arquivos. A obra foi preservada como rascunho. Tente excluir novamente.',
        );
      if (!files?.length) break;
      const { error: removeError } = await db.storage
        .from('obras')
        .remove(files.map((f) => `${id}/${f.name}`));
      if (removeError)
        throw Error(
          'Falha ao remover imagens. A obra foi preservada como rascunho. Tente novamente.',
        );
    }
    const { error } = await db.from('projects').delete().eq('id', id);
    if (error)
      throw Error(
        'Os arquivos foram removidos, mas o registro permanece como rascunho. Tente excluir novamente.',
      );
    return Response.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
