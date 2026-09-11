'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowUpRight, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Brand } from './brand';
import { company, whatsappUrl } from '@/config/company';
const links = [
  ['Início', '/'],
  ['Obras', '/obras'],
  ['Calculadora', '/calculadora'],
  ['Diferenciais', '/#diferenciais'],
  ['Serviços', '/#servicos'],
  ['Como funciona', '/#como-funciona'],
  ['Clientes', '/#clientes'],
];
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Navegação principal">
          {links.map(([name, href]) => (
            <Link className={pathname === href ? 'active' : ''} key={href} href={href}>
              {name}
            </Link>
          ))}
        </nav>
        <div className="header-contact">
          <a className="phone-link" href={`tel:${company.phoneRaw}`}>
            <Phone size={13} />
            {company.phone}
          </a>
          <a
            className="button gold small"
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar no WhatsApp <ArrowUpRight size={16} />
          </a>
        </div>
        <button
          className="icon-button mobile-toggle"
          aria-label="Abrir menu"
          onClick={() => dialog.current?.showModal()}
        >
          <Menu />
        </button>
      </div>
      <dialog ref={dialog} className="mobile-menu">
        <div className="dialog-top">
          <Brand />
          <button
            className="icon-button"
            aria-label="Fechar menu"
            onClick={() => dialog.current?.close()}
          >
            <X />
          </button>
        </div>
        <nav aria-label="Navegação mobile">
          {links.map(([name, href]) => (
            <Link href={href} key={href} onClick={() => dialog.current?.close()}>
              {name}
              <ArrowUpRight size={20} />
            </Link>
          ))}
        </nav>
        <a className="button gold" href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
          Falar no WhatsApp
        </a>
      </dialog>
    </header>
  );
}
