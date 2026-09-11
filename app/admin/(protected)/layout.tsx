import { requireAdmin } from '@/lib/supabase/server';
import { AdminShell } from '@/components/admin/shell';
export const dynamic = 'force-dynamic';
export default async function Layout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <AdminShell>{children}</AdminShell>;
}
