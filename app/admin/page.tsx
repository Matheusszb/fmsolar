import { Login } from '@/components/admin/login';
import { isSupabaseConfigured } from '@/lib/supabase/config';
export default function Page() {
  return <Login configured={isSupabaseConfigured()} />;
}
