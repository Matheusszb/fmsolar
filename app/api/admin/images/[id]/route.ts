import { adminApi, apiError } from '@/lib/admin-api';
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await adminApi(request);
    const { id } = await params;
    const { data: im } = await db.from('project_images').select('*').eq('id', id).single();
    if (!im) throw Error('Imagem não encontrada.');
    const { error: storageError } = await db.storage.from('obras').remove([im.storage_path]);
    if (storageError) throw Error('Erro ao remover arquivo. Tente novamente.');
    const { error } = await db.rpc('remove_project_image', { image_id: id });
    if (error)
      throw Error('Arquivo removido. Tente novamente para concluir a remoção do registro.');
    return Response.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
