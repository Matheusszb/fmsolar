import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ShieldCheck, MoveDown, Sun } from 'lucide-react';
import { whatsappUrl } from '@/config/company';
export function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid-pattern" aria-hidden="true" />
      <div className="container hero-layout">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" />
            ENGENHARIA A FAVOR DO SEU FUTURO
          </div>
          <h1>
            Liberdade energética: gere sua própria energia e corte <span>até 85%</span> da conta de
            luz
          </h1>
          <p>
            A FM SOLAR projeta, homologa e instala seu sistema solar em todo o território brasileiro
            com garantia e acompanhamento técnico. Do primeiro cálculo até o sistema gerando.
          </p>
          <div className="button-row">
            <a
              className="button gold"
              target="_blank"
              rel="noopener noreferrer"
              href={whatsappUrl(
                'Olá! Quero solicitar uma análise gratuita para instalação de energia solar.',
              )}
            >
              Solicitar Análise Gratuita <ArrowUpRight size={19} />
            </a>
            <Link className="button outline" href="/calculadora">
              Calcular minha economia <ArrowRight size={18} />
            </Link>
          </div>
          <div className="hero-assurance">
            <ShieldCheck size={18} />
            <span>Projeto assinado. Instalação segura. Suporte de verdade.</span>
          </div>
        </div>
        <div className="hero-visual">
          <div
            className="hero-photo"
            role="img"
            aria-label="Painéis solares sob a luz do sol — imagem ilustrativa"
          />
          <div className="photo-label">
            <span>
              O SOL TRABALHA.
              <br />
              <strong>Você economiza.</strong>
            </span>
            <Sun size={28} />
          </div>
          <div className="energy-note">
            <span className="status-dot" /> ENERGIA LIMPA. TODOS OS DIAS.
          </div>
          <div className="hero-metric">
            <span>POTENCIAL DE ECONOMIA</span>
            <strong>
              85<small>%</small>
            </strong>
            <span>menos na sua conta de luz*</span>
          </div>
        </div>
      </div>
      <div className="container hero-foot">
        <span>DO PROJETO À PRIMEIRA GERAÇÃO.</span>
        <a href="#diferenciais">
          Conheça a FM SOLAR <MoveDown size={15} />
        </a>
        <span>*Conforme dimensionamento e condições da instalação.</span>
      </div>
    </section>
  );
}
