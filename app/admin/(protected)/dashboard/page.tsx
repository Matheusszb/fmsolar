import Link from 'next/link';
import { requireAdmin } from '@/lib/supabase/server';
import { decimal } from '@/lib/solarCalculator';
export default async function Page() {
  const { db } = await requireAdmin();
  const { data, error } = await db.rpc('dashboard_stats');
  if (error) throw Error('Erro ao carregar dashboard.');
  const { data: recent, error: recentError } = await db
    .from('projects')
    .select('id,title,city,state,status,power_kwp,updated_at')
    .order('updated_at', { ascending: false })
    .limit(6);
  if (recentError) throw Error('Erro ao carregar obras.');
  const s = data as {
    total: number;
    published: number;
    draft: number;
    featured: number;
    photos: number;
    power: number;
  };
  return (
    <>
      <div className="admin-page-head">
        <div>
          <span className="eyebrow dark">VISÃO GERAL DA FM SOLAR</span>
          <h1>Olá, administrador</h1>
          <p>Seus projetos, organizados em um só lugar.</p>
        </div>
        <Link className="button gold" href="/admin/obras/nova">
          + Nova obra
        </Link>
      </div>
      <div className="dashboard-stats">
        {[
          ['Total de obras', s.total],
          ['Obras publicadas', s.published],
          ['Rascunhos', s.draft],
          ['Em destaque', s.featured],
          ['Fotos cadastradas', s.photos],
          ['Potência total cadastrada', `${decimal(s.power)} kWp`],
        ].map(([l, v]) => (
          <div className="card" key={l}>
            <span>{l}</span>
            <strong>{v}</strong>
          </div>
        ))}
      </div>
      <section className="card">
        <div className="section-head">
          <h2>Últimas obras</h2>
          <Link href="/admin/obras" className="text-link">
            Gerenciar todas
          </Link>
        </div>
        {!recent?.length ? (
          <div className="empty-state">
            <h3>Você ainda não cadastrou nenhuma obra.</h3>
            <Link className="button navy" href="/admin/obras/nova">
              Cadastrar primeira obra
            </Link>
          </div>
        ) : (
          recent.map((p) => (
            <Link className="recent-row" href={`/admin/obras/${p.id}/editar`} key={p.id}>
              <div>
                <strong>{p.title}</strong>
                <p>
                  {p.city} / {p.state}
                </p>
              </div>
              <span className={`pill ${p.status}`}>
                {p.status === 'published' ? 'Publicado' : 'Rascunho'}
              </span>
              <span>{p.power_kwp ? `${decimal(p.power_kwp)} kWp` : ''}</span>
            </Link>
          ))
        )}
      </section>
    </>
  );
}
