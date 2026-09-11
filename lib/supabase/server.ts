import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isSupabaseConfigured, supabaseConfig } from './config';
export async function serverSupabase() {
  const jar = await cookies();
  const { url, key } = supabaseConfig();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (values) => {
        try {
          values.forEach(({ name, value, options }) => jar.set(name, value, options));
        } catch {
          /* Proxy refreshes cookies during Server Component rendering. */
        }
      },
    },
  });
}
export async function requireAdmin() {
  if (!isSupabaseConfigured()) redirect('/admin?setup=1');
  const db = await serverSupabase();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect('/admin?expired=1');
  const { data, error } = await db.from('profiles').select('role').eq('id', user.id).single();
  if (error || data?.role !== 'admin') redirect('/admin?denied=1');
  return { db, user };
}
