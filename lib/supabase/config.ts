export function normalizeSupabaseUrl(value: string) {
  return value
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/rest\/v1$/i, '');
}

export function supabaseConfig() {
  return {
    url: normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || ''),
    key: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim(),
  };
}

export function isSupabaseConfigured() {
  const { url, key } = supabaseConfig();
  return Boolean(url && key);
}
