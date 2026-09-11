import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollProgress } from '@/components/ui/ambient';
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-site">
      <ScrollProgress />
      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
    </div>
  );
}
