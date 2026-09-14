import Link from 'next/link';
import { ArrowUpRight, MessageCircle, Camera } from 'lucide-react';
import { Brand } from './brand';
import { company, whatsappUrl } from '@/config/company';
export function Footer() {
  return (
    <>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <Brand />
            <p>
              Engenharia que transforma o sol em economia e liberdade.
            </p>
            <a
              href={company.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-link"
            >
              <Camera size={18} />
              {company.instagram}
            </a>
          </div>
          <div>
            <h3>Explore</h3>
            <Link href="/">Início</Link>
            <Link href="/obras">Nossas obras</Link>
            <Link href="/calculadora">Calculadora solar</Link>
            <Link href="/#servicos">Serviços</Link>
            <Link href="/#diferenciais">Diferenciais</Link>
          </div>
          <div>
            <h3>Vamos conversar</h3>
            <a href={`tel:${company.phoneRaw}`}>{company.phone}</a>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              Fale com um engenheiro <ArrowUpRight size={15} />
            </a>
            <p>
              Atendimento em todo
              <br />o território brasileiro.
            </p>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>© {new Date().getFullYear()} FM SOLAR. Todos os direitos reservados.</span>
          <Link href="/admin">Área administrativa</Link>
        </div>
      </footer>
      <a
        className="whatsapp-float"
        aria-label="Fale com um engenheiro no WhatsApp"
        title="Fale com um engenheiro"
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MessageCircle size={27} />
        <span>Fale com um especialista</span>
      </a>
    </>
  );
}
