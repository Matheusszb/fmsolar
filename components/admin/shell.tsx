'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRef } from 'react';
import { LayoutDashboard, FolderOpen, Plus, ExternalLink, LogOut, Menu, X } from 'lucide-react';
import { Brand } from '@/components/layout/brand';
import { browserSupabase } from '@/lib/supabase/client';
export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const nav = (
    <>
      <Brand />
      <span className="sidebar-label">ÁREA ADMINISTRATIVA</span>
      <nav>
        {[
          ['Dashboard', '/admin/dashboard', LayoutDashboard],
          ['Obras', '/admin/obras', FolderOpen],
          ['Nova obra', '/admin/obras/nova', Plus],
          ['Visualizar site', '/', ExternalLink],
        ].map(([t, h, I]) => {
          const Icon = I as typeof Plus;
          return (
            <Link
              key={String(h)}
              href={String(h)}
              className={path === h ? 'active' : ''}
              onClick={() => dialog.current?.close()}
            >
              <Icon size={19} />
              {String(t)}
            </Link>
          );
        })}
      </nav>
      <button
        className="sidebar-logout"
        onClick={async () => {
          await browserSupabase().auth.signOut();
          router.replace('/admin');
          router.refresh();
        }}
      >
        <LogOut size={19} />
        Sair
      </button>
    </>
  );
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">{nav}</aside>
      <div className="admin-workspace">
        <header className="admin-header">
          <button
            className="icon-button admin-menu"
            aria-label="Abrir navegação"
            onClick={() => dialog.current?.showModal()}
          >
            <Menu />
          </button>
          <span>
            FM SOLAR <span className="muted">/ Gestão de projetos</span>
          </span>
          <span className="admin-avatar">FM</span>
        </header>
        <main id="conteudo" className="admin-main">
          {children}
        </main>
      </div>
      <dialog ref={dialog} className="mobile-menu admin-drawer">
        <button
          className="icon-button"
          aria-label="Fechar navegação"
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        {nav}
      </dialog>
    </div>
  );
}
