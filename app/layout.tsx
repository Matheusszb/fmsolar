import type { Metadata } from 'next';
import { company } from '@/config/company';
import './globals.css';
import './premium.css';
import { Manrope } from 'next/font/google';
const manrope = Manrope({ subsets: ['latin'], display: 'swap', variable: '--font-manrope' });
export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: {
    default: 'FM SOLAR | Energia Solar Residencial, Comercial e Rural',
    template: 'FM SOLAR | %s',
  },
  description:
    'Projetos, homologação, instalação e manutenção de energia solar. Descubra quanto você pode economizar com a FM SOLAR.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: company.companyName,
    title: 'FM SOLAR | Energia Sustentável',
    description: 'Engenharia que transforma o sol em liberdade para você.',
    images: [{ url: company.logo, width: 2481, height: 2481, alt: company.companyName }],
  },
  twitter: { card: 'summary_large_image' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structured = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: company.companyName,
        url: company.siteUrl,
        logo: company.siteUrl + company.logo,
        telephone: company.phoneRaw,
        sameAs: [company.instagramUrl],
      },
      { '@type': 'WebSite', name: company.companyName, url: company.siteUrl },
    ],
  };
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body className={manrope.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structured).replace(/</g, '\\u003c') }}
        />
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
