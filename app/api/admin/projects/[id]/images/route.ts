import { adminApi, apiError } from '@/lib/admin-api';
import { gallerySchema as schema } from '@/lib/projects/gallery-schema';
import sharp from 'sharp';
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await adminApi(request);
    const { id } = await params;
    const p = schema.parse(await request.json());
    const { error } = await db.rpc('save_project_images', {
      p_id: id,
      p_images: p.images,
      p_cover: p.cover,
      p_before: p.before,
      p_after: p.after,
    });
    if (error) throw Error('Erro ao salvar organização das fotos.');
    return Response.json({ ok: true });
  } catch (e) {
    return apiError(e);
  }
}
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { db } = await adminApi(request);
    const { id } = await params;
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File) || file.size === 0 || file.size > 10485760)
      throw Error('Envie uma imagem de até 10 MB.');
    const buffer = new Uint8Array(await file.arrayBuffer());
    const jpeg = buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255;
    const png = [137, 80, 78, 71, 13, 10, 26, 10].every((v, i) => buffer[i] === v);
    const webp =
      String.fromCharCode(...buffer.slice(0, 4)) === 'RIFF' &&
      String.fromCharCode(...buffer.slice(8, 12)) === 'WEBP';
    const mime = jpeg ? 'image/jpeg' : png ? 'image/png' : webp ? 'image/webp' : '';
    if (!mime || mime !== file.type) throw Error('Arquivo inválido. Use JPEG, PNG ou WebP.');
    const { data: project } = await db.from('projects').select('id').eq('id', id).single();
    if (!project) throw Error('Obra não encontrada.');
    const { count } = await db
      .from('project_images')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', id);
    if ((count || 0) >= 100) throw Error('Limite de 100 fotos por obra.');
    let optimized: Buffer;
    try {
      optimized = await sharp(buffer, { limitInputPixels: 40000000, animated: false })
        .rotate()
        .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 86 })
        .toBuffer();
    } catch {
      throw Error('Não foi possível ler a imagem. Use um arquivo válido de até 40 megapixels.');
    }
    const imageId = crypto.randomUUID();
    const path = `${id}/${imageId}.webp`;
    const { error: uploadError } = await db.storage
      .from('obras')
      .upload(path, optimized, { contentType: 'image/webp', upsert: false });
    if (uploadError) throw Error('Erro ao enviar imagem. Tente novamente.');
    const { data, error } = await db
      .from('project_images')
      .insert({
        id: imageId,
        project_id: id,
        storage_path: path,
        sort_order: count || 0,
        alt_text: '',
        caption: '',
      })
      .select('*')
      .single();
    if (error) {
      await db.storage.from('obras').remove([path]);
      throw Error('Erro ao registrar imagem.');
    }
    return Response.json({ ...data, url: `/api/images/${imageId}` });
  } catch (e) {
    return apiError(e);
  }
}
