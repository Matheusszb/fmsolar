import { Hero } from '@/components/home/hero';
import { HomeSections, HomeBottom } from '@/components/home/sections';
import { publicProjects } from '@/lib/projects/queries';
import { ProjectCard } from '@/components/projects/card';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
export default async function Home() {
  const result = await publicProjects({ featured: true }).catch(() => ({ projects: [] }));
  return (
    <>
      <Hero />
      <HomeSections />
      {result.projects.length > 0 && (
        <section className="section white">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow dark">ENGENHARIA NA PRÁTICA</span>
                <h2>Energia gerada na prática</h2>
                <p>Conheça algumas instalações realizadas pela FM SOLAR.</p>
              </div>
              <Link href="/obras" className="button light">
                Ver todas as obras
              </Link>
            </div>
            <div className="grid-3">
              {result.projects.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
      <HomeBottom />
    </>
  );
}
