import { publicProjects } from '@/lib/projects/queries';
import { ProjectsBrowser } from '@/components/projects/browser';
export const metadata = {
  title: 'Obras e Projetos de Energia Solar',
  alternates: { canonical: '/obras' },
};
export const dynamic = 'force-dynamic';
export default async function Obras() {
  const data = await publicProjects();
  return (
    <>
      <section className="page-heading">
        <div className="container">
          <span className="eyebrow">NOSSAS OBRAS</span>
          <h1>Energia solar instalada na prática</h1>
          <p>
            Conheça alguns dos projetos desenvolvidos pela FM SOLAR para residências, empresas e
            propriedades rurais.
          </p>
        </div>
      </section>
      <ProjectsBrowser initial={data} />
    </>
  );
}
