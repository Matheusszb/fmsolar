import { adminApi, apiError } from '@/lib/admin-api';
import { projectSchema } from '@/lib/projects/validators';
export async function POST(request: Request) {
  try {
    const { db, user } = await adminApi(request);
    const input = projectSchema.parse(await request.json());
    const { data, error } = await db
      .from('projects')
      .insert({ ...input, created_by: user.id })
      .select('id')
      .single();
    if (error)
      throw Error(
        error.code === '23505' ? 'Este slug já existe. Escolha outro.' : 'Erro ao criar obra.',
      );
    return Response.json(data);
  } catch (e) {
    return apiError(e);
  }
}
