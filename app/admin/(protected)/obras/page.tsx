import { requireAdmin } from '@/lib/supabase/server';
import { AdminList } from '@/components/admin/list';
export default async function Page() {
  await requireAdmin();
  return <AdminList />;
}
