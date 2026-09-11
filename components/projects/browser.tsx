'use client';
import { useEffect, useRef, useState } from 'react';
import { categories, states, type Project } from '@/lib/projects/types';
import { ProjectCard } from './card';
export function ProjectsBrowser({ initial }: { initial: { projects: Project[]; count: number } }) {
  const [data, setData] = useState(initial);
  const [category, setCategory] = useState('');
  const [state, setState] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setBusy(true);
      setError('');
      try {
        const r = await fetch(
          `/api/projects?${new URLSearchParams({ category, state, search, page: String(page) })}`,
          { signal: controller.signal },
        );
        const result = await r.json();
        if (!r.ok) throw Error(result.error);
        setData((old) => ({
          projects: page ? [...old.projects, ...result.projects] : result.projects,
          count: result.count,
        }));
      } catch (e) {
        if (!controller.signal.aborted) setError(e instanceof Error ? e.message : 'Erro de rede.');
      } finally {
        if (!controller.signal.aborted) setBusy(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [category, state, search, page]);
  return (
    <section className="section">
      <div className="container">
        <div className="filters">
          <div className="button-row">
            {[['', 'Todas'], ...Object.entries(categories)].map(([v, l]) => (
              <button
                className={`button small ${category === v ? 'navy' : 'light'}`}
                key={v}
                onClick={() => {
                  setCategory(v);
                  setPage(0);
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <label className="field">
            Estado
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                setPage(0);
              }}
            >
              <option value="">Todos os estados</option>
              {states.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="field">
            Buscar projeto ou cidade
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Buscar projeto ou cidade"
            />
          </label>
        </div>
        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}
        <div aria-live="polite" aria-busy={busy}>
          {!data.projects.length ? (
            <div className="empty-state">
              <h2>
                {search || category || state
                  ? 'Nenhum projeto encontrado.'
                  : 'Novos projetos serão publicados em breve.'}
              </h2>
              <p>Conheça nossas soluções ou fale com um engenheiro para seu projeto.</p>
            </div>
          ) : (
            <div className="grid-3">
              {data.projects.map((p, i) => (
                <ProjectCard project={p} key={p.id} index={i} />
              ))}
            </div>
          )}
        </div>
        {busy && <p role="status">Carregando projetos...</p>}
        {data.projects.length < data.count && (
          <button
            className="button navy load-more"
            disabled={busy}
            onClick={() => setPage((p) => p + 1)}
          >
            Carregar mais projetos
          </button>
        )}
      </div>
    </section>
  );
}
