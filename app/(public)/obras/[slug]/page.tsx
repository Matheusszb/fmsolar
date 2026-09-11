import { notFound } from 'next/navigation';
import { projectBySlug } from '@/lib/projects/queries';
import { ProjectDetail } from '@/components/projects/detail';
import { company } from '@/config/company';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await projectBySlug(slug);
  if (!p) return { title: 'Projeto não encontrado' };
  const description =
    p.summary ||
    `Conheça este projeto de energia solar desenvolvido pela FM SOLAR em ${p.city} - ${p.state}.`;
  const images = p.cover_url ? [{ url: company.siteUrl + p.cover_url, alt: p.title }] : [];
  return {
    title: p.title,
    description,
    alternates: { canonical: `/obras/${p.slug}` },
    openGraph: { title: p.title, description, url: `/obras/${p.slug}`, images },
    twitter: { title: p.title, description, images: images.map((i) => i.url) },
  };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await projectBySlug(slug);
  if (!p) notFound();
  return <ProjectDetail project={p} />;
}
