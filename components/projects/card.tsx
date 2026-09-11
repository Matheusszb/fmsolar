import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Sun } from 'lucide-react';
import { categories, type Project } from '@/lib/projects/types';
import { decimal } from '@/lib/solarCalculator';
export function ProjectCard({ project: p }: { project: Project }) {
  return (
    <article className="project-card">
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
    </article>
  );
}
