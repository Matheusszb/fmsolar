import Image from 'next/image';
import { categories, type Project } from '@/lib/projects/types';
import { currency, decimal } from '@/lib/solarCalculator';
import { whatsappUrl } from '@/config/company';
import { Gallery, BeforeAfter, ShareProject } from './gallery';
export function ProjectDetail({
  project: p,
  preview = false,
}: {
  project: Project;
  preview?: boolean;
}) {
  const specs: [string, string | number | null][] = [
    ['Potência instalada', p.power_kwp === null ? null : `${decimal(p.power_kwp)} kWp`],
    ['Quantidade de módulos', p.modules_count],
    ['Modelo dos módulos', p.module_model],
    ['Potência do módulo', p.module_power_w === null ? null : `${p.module_power_w} W`],
    ['Quantidade de inversores', p.inverters_count],
    ['Modelo do inversor', p.inverter_model],
    [
      'Geração mensal',
      p.estimated_monthly_generation === null
        ? null
        : `${decimal(p.estimated_monthly_generation)} kWh`,
    ],
    [
      'Economia mensal',
      p.estimated_monthly_savings === null ? null : currency(p.estimated_monthly_savings),
    ],
    [
      'Economia anual',
      p.estimated_annual_savings === null ? null : currency(p.estimated_annual_savings),
    ],
    [
      'Redução estimada',
      p.estimated_reduction_percentage === null
        ? null
        : `${decimal(p.estimated_reduction_percentage)}%`,
    ],
    [
      'Conclusão',
      p.completion_date
        ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(p.completion_date))
        : null,
    ],
  ];
  return (
    <>
      {preview && (
        <div className="notice">
          Prévia privada · {p.status === 'draft' ? 'Rascunho' : 'Publicado'}
        </div>
      )}
      <section className="page-heading">
        <div className="container">
          <span className="eyebrow">
            {categories[p.category].toUpperCase()} / {p.city} — {p.state}
          </span>
          <h1>{p.title}</h1>
          <p>{p.summary}</p>
        </div>
      </section>
      {p.cover_url && (
        <div className="container case-cover">
          <Image src={p.cover_url} alt={p.title} fill sizes="100vw" priority unoptimized />
        </div>
      )}
      <section className="section">
        <div className="container">
          <Gallery images={p.project_images} />
          <div className="case-layout">
            <aside className="specs card">
              <span className="eyebrow dark">FICHA TÉCNICA</span>
              {specs
                .filter(([, v]) => v !== null && v !== '')
                .map(([k, v]) => (
                  <div key={k}>
                    <span>{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
            </aside>
            <div>
              {[
                ['Sobre o projeto', p.description],
                ['Desafio', p.challenge],
                ['Solução aplicada', p.solution],
                ['Resultados', p.results],
              ]
                .filter(([, v]) => v)
                .map(([t, d]) => (
                  <section className="case-section" key={t}>
                    <h2>{t}</h2>
                    <p className="pre-line">{d}</p>
                  </section>
                ))}
            </div>
          </div>
          {p.before_image && p.after_image && (
            <BeforeAfter
              before={`/api/images/${p.before_image}`}
              after={`/api/images/${p.after_image}`}
            />
          )}
          <div className="engineer-card">
            <h2>Gostaria de ter um projeto como este?</h2>
            <p>Solicite uma análise gratuita e descubra o sistema ideal para seu imóvel.</p>
            <a
              className="button gold"
              href={whatsappUrl(
                `Olá! Vi no site da FM SOLAR o projeto "${p.title}" e gostaria de solicitar uma análise para meu imóvel.`,
              )}
            >
              Quero um projeto para meu imóvel
            </a>
          </div>
          {!preview && <ShareProject title={p.title} slug={p.slug} />}
        </div>
      </section>
    </>
  );
}
