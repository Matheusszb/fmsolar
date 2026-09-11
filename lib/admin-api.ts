import { serverSupabase } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { ZodError } from 'zod';
export async function adminApi(request: Request) {
  if (!isSupabaseConfigured()) throw Error('Supabase não configurado.');
  if (request.method !== 'GET') {
    const origin = request.headers.get('origin');
    if (!origin || origin !== new URL(request.url).origin) throw Error('Origem inválida.');
  }
  const db = await serverSupabase();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) throw Error('Sessão expirada. Entre novamente.');
  const { data } = await db.from('profiles').select('role').eq('id', user.id).single();
  if (data?.role !== 'admin') throw Error('Acesso negado.');
  return { db, user };
}
export function apiError(error: unknown) {
  const message =
    error instanceof ZodError
      ? 'Dados inválidos. Verifique os campos obrigatórios, os valores e os limites de tamanho.'
      : error instanceof Error
        ? error.message
        : 'Não foi possível concluir a operação.';
  return Response.json(
    { error: message },
    {
      status: message.startsWith('Sessão expirada')
        ? 401
        : message === 'Acesso negado.' || message === 'Origem inválida.'
          ? 403
          : 400,
    },
  );
}
