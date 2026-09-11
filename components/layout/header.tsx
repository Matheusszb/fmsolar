'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowUpRight, MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Brand } from './brand';
import { whatsappUrl } from '@/config/company';
const links = [
  ['Início', '/'],
  ['Serviços', '/#servicos'],
  ['Como funciona', '/#como-funciona'],
  ['Obras', '/obras'],
  ['Calculadora', '/calculadora'],
  ['Depoimentos', '/#clientes'],
];
const analysisUrl = whatsappUrl(
  'Olá! Quero solicitar uma análise gratuita para instalação de energia solar.',
);
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
    <header
      className={`site-header ${scrolled ? 'scrolled' : ''} ${pathname === '/' ? 'header-home' : ''}`}
    >
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
          <a
            className="button gold small"
            href={analysisUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Solicitar análise gratuita <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="mobile-header-actions">
          <a
            className="icon-button mobile-whatsapp"
            href={analysisUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Solicitar análise gratuita pelo WhatsApp"
          >
            <MessageCircle size={21} />
          </a>
          <button
            className="icon-button mobile-toggle"
            aria-label="Abrir menu"
            onClick={() => dialog.current?.showModal()}
          >
            <Menu />
          </button>
        </div>
      </div>
      <dialog ref={dialog} className="mobile-menu" aria-label="Menu de navegação">
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
        <a className="button gold" href={analysisUrl} target="_blank" rel="noopener noreferrer">
          Solicitar análise gratuita <ArrowUpRight size={16} />
        </a>
      </dialog>
    </header>
  );
}
