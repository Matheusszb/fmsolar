'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { categories, type Project } from '@/lib/projects/types';
export function AdminList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [revision, setRevision] = useState(0);
  const [target, setTarget] = useState<Project | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setBusy(true);
      try {
        const r = await fetch(
          `/api/admin/projects/list?${new URLSearchParams({ page: String(page), search, filter, sort })}`,
          { signal: controller.signal },
        );
        const d = await r.json();
        if (!r.ok) throw Error(d.error);
        setProjects(d.projects);
        setCount(d.count);
      } catch (e) {
        if (!controller.signal.aborted) setMsg(e instanceof Error ? e.message : 'Erro de rede.');
      } finally {
        if (!controller.signal.aborted) setBusy(false);
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [page, search, filter, sort, revision]);
  async function action(p: Project, action: string) {
    setBusy(true);
    setMsg('');
    try {
      const r = await fetch(`/api/admin/projects/${p.id}`, {
        method: action === 'delete' ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: action === 'delete' ? undefined : JSON.stringify({ action }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      if (action === 'duplicate') {
        router.push(`/admin/obras/${d.id}/editar`);
        return;
      }
      setMsg(
        action === 'delete'
          ? 'Obra excluída.'
          : action === 'publish'
            ? 'Obra publicada.'
            : 'Obra movida para rascunho.',
      );
      setRevision((n) => n + 1);
      dialog.current?.close();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Erro na operação.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow dark">PORTFÓLIO / GESTÃO</span>
          <h1>Suas obras</h1>
          <p>Do primeiro rascunho ao projeto publicado.</p>
        </div>
        <Link className="button gold" href="/admin/obras/nova">
          + Nova obra
        </Link>
      </div>
      <div className="filters">
        <label className="field">
          Buscar obra
          <input
            placeholder="Buscar obra..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
          />
        </label>
        <label className="field">
          Status
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(0);
            }}
          >
            {[
              ['', 'Todas'],
              ['published', 'Publicadas'],
              ['draft', 'Rascunhos'],
              ['featured', 'Destaques'],
            ].map(([v, l]) => (
              <option value={v} key={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Ordenação
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(0);
            }}
          >
            {[
              ['newest', 'Mais recentes'],
              ['oldest', 'Mais antigas'],
              ['title', 'Título'],
              ['power', 'Potência'],
            ].map(([v, l]) => (
              <option value={v} key={v}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>
      {msg && (
        <p role="status" className="notice">
          {msg}
        </p>
      )}
      {busy && <p role="status">Carregando...</p>}
      <div className="admin-projects">
        {projects.map((p) => (
          <article className="card admin-project" key={p.id}>
            <div className="admin-project-image">
              {p.cover_image && (
                <Image
                  src={`/api/images/${p.cover_image}`}
                  alt={p.title}
                  fill
                  sizes="180px"
                  unoptimized
                />
              )}
            </div>
            <div>
              <span className={`pill ${p.status}`}>
                {p.status === 'published' ? 'Publicado' : 'Rascunho'}
                {p.featured ? ' · Destaque' : ''}
              </span>
              <h3>{p.title}</h3>
              <p>
                {p.city} / {p.state} · {categories[p.category]}
                {p.power_kwp ? ` · ${p.power_kwp} kWp` : ''}
              </p>
              <small>Atualizada em {new Date(p.updated_at).toLocaleDateString('pt-BR')}</small>
              <div className="button-row">
                <Link className="button small navy" href={`/admin/obras/${p.id}/editar`}>
                  Editar
                </Link>
                <Link className="button small light" href={`/admin/obras/${p.id}/previa`}>
                  Visualizar
                </Link>
                <button
                  className="button small light"
                  disabled={busy}
                  onClick={() => action(p, 'duplicate')}
                >
                  Duplicar
                </button>
                <button
                  className="button small light"
                  disabled={busy}
                  onClick={() => action(p, p.status === 'published' ? 'draft' : 'publish')}
                >
                  {p.status === 'published' ? 'Mover para rascunho' : 'Publicar'}
                </button>
                <button
                  className="button small danger"
                  disabled={busy}
                  onClick={() => {
                    setTarget(p);
                    dialog.current?.showModal();
                  }}
                >
                  Excluir
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!busy && !projects.length && (
        <div className="empty-state">
          <h2>
            {search || filter
              ? 'Nenhuma obra encontrada.'
              : 'Você ainda não cadastrou nenhuma obra.'}
          </h2>
          <Link className="button navy" href="/admin/obras/nova">
            Cadastrar primeira obra
          </Link>
        </div>
      )}
      <div className="pagination">
        <button
          className="button light small"
          disabled={!page || busy}
          onClick={() => setPage((p) => p - 1)}
        >
          Anterior
        </button>
        <span>
          Página {page + 1} · {count} obras
        </span>
        <button
          className="button light small"
          disabled={(page + 1) * 12 >= count || busy}
          onClick={() => setPage((p) => p + 1)}
        >
          Próxima
        </button>
      </div>
      <dialog className="confirm-dialog" ref={dialog}>
        <h2>Excluir obra?</h2>
        <p>
          Tem certeza de que deseja excluir esta obra? As imagens relacionadas também serão
          removidas. Esta ação não poderá ser desfeita.
        </p>
        <strong>{target?.title}</strong>
        <div className="button-row">
          <button className="button light" disabled={busy} onClick={() => dialog.current?.close()}>
            Cancelar
          </button>
          <button
            className="button danger"
            disabled={busy}
            onClick={() => target && action(target, 'delete')}
          >
            {busy ? 'Excluindo...' : 'Excluir definitivamente'}
          </button>
        </div>
        {msg && <p role="status">{msg}</p>}
      </dialog>
    </>
  );
}
