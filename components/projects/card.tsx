import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Sun } from 'lucide-react';
import { categories, type Project } from '@/lib/projects/types';
import { decimal, currency } from '@/lib/solarCalculator';
import { Reveal } from '@/components/ui/reveal';
export function ProjectCard({ project: p, index = 0 }: { project: Project; index?: number }) {
  return (
    <Reveal className="project-card" variant="image" delay={Math.min(index, 5) * 0.07}>
      <Link href={`/obras/${p.slug}`} className="project-cover">
        {p.cover_url ? (
          <Image
            src={p.cover_url}
            alt={p.title}
            fill
            sizes="(max-width:700px) 100vw,33vw"
            unoptimized
          />
        ) : (
          <Sun size={56} />
        )}
        <span className="pill">
          {categories[p.category]}
          {p.featured ? ' · Destaque' : ''}
        </span>
        <span className="project-image-action">
          <ArrowUpRight size={23} />
        </span>
      </Link>
      <div className="project-body">
        <span className="location">
          <MapPin size={14} />
          {p.city} / {p.state}
        </span>
        <h3>
          <Link href={`/obras/${p.slug}`}>{p.title}</Link>
        </h3>
        <p>{p.summary}</p>
        {(p.estimated_monthly_savings !== null || p.completion_date) && (
          <div className="project-extra">
            {p.estimated_monthly_savings !== null && (
              <span>{currency(p.estimated_monthly_savings)} / mês de economia estimada</span>
            )}
            {p.completion_date && <span>{p.completion_date.slice(0, 4)}</span>}
          </div>
        )}
        <div className="project-bottom">
          <span>
            {p.power_kwp ? `${decimal(p.power_kwp)} kWp` : ''}
            {p.modules_count ? ` · ${p.modules_count} módulos` : ''}
          </span>
          <Link href={`/obras/${p.slug}`} className="text-link">
            Ver projeto <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
