'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/ui/use-reduced-motion';
import { ArrowRight, ArrowUpRight, ShieldCheck, MoveDown, Sun, ArrowDownRight } from 'lucide-react';
import { whatsappUrl } from '@/config/company';
import { Ambient } from '@/components/ui/ambient';
import { Counter } from './counter';
export function Hero() {
  const reduced = useReducedMotion();
  const entry = (delay: number) => ({
    initial: false as const,
    animate: reduced ? {} : { opacity: [0.35, 1], y: [22, 0] },
    transition: {
      duration: 0.85,
      delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  });
  return (
    <section className="hero hero-premium">
      <div className="hero-grid-pattern" aria-hidden="true" />
      <div className="solar-light light-blue" aria-hidden="true" />
      <div className="solar-light light-gold" aria-hidden="true" />
      <div className="energy-points" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="container hero-layout">
        <div className="hero-copy">
          <motion.div className="eyebrow hero-badge" {...entry(0.08)}>
            <span className="status-dot" />
            ENGENHARIA A FAVOR DO SEU FUTURO
          </motion.div>
          <h1>
            <motion.span className="hero-line" {...entry(0.15)}>
              Liberdade energética:
            </motion.span>{' '}
            <motion.span className="hero-line" {...entry(0.28)}>
              gere sua própria energia e
            </motion.span>{' '}
            <motion.span className="hero-line" {...entry(0.4)}>
              corte <em>até 85%</em> da conta de luz
            </motion.span>
          </h1>
          <motion.p {...entry(0.52)}>
            A FM SOLAR projeta, homologa e instala seu sistema solar em todo o território brasileiro
            com garantia e acompanhamento técnico. Do primeiro cálculo até o sistema gerando.
          </motion.p>
          <motion.div className="button-row" {...entry(0.66)}>
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
          </motion.div>
          <motion.div className="hero-assurance" {...entry(0.8)}>
            <span className="assurance-icon">
              <ShieldCheck size={21} />
            </span>
            <span>
              Engenharia responsável.
              <br />
              <b>Do primeiro projeto à sua independência.</b>
            </span>
          </motion.div>
        </div>
        <Ambient className="hero-depth" parallax>
          <motion.div className="hero-visual" {...entry(0.3)}>
            <div className="hero-photo">
              <Image
                src="/solar-hero.jpg"
                alt="Painéis solares sob a luz do sol — imagem ilustrativa"
                fill
                priority
                sizes="(max-width:700px) 100vw,50vw"
                unoptimized
              />
              <div className="hero-photo-overlay" />
            </div>
            <div className="photo-label">
              <span>
                ENERGIA QUE TRANSFORMA
                <br />
                <strong>
                  Seu futuro começa
                  <br />
                  com o sol.
                </strong>
              </span>
              <Sun size={29} />
            </div>
            <div className="visual-coordinate" aria-hidden="true">
              FM / ENGENHARIA SOLAR <span>01 — 25</span>
            </div>
            <div className="energy-note">
              <span className="status-dot" /> ENERGIA LIMPA. TODOS OS DIAS.
            </div>
            <div className="hero-metric">
              <div className="metric-heading">
                <span>POTENCIAL DE ECONOMIA</span>
                <ArrowDownRight size={18} />
              </div>
              <Counter value={85} suffix="%" />
              <span>menos na sua conta de luz*</span>
              <div className="metric-meter">
                <span />
              </div>
            </div>
          </motion.div>
          <div className="visual-caption">
            <span>O SOL É DE TODOS.</span>
            <span>
              A energia pode ser sua. <ArrowUpRight size={14} />
            </span>
          </div>
        </Ambient>
      </div>
      <div className="container hero-foot">
        <span>PROJETO · HOMOLOGAÇÃO · INSTALAÇÃO</span>
        <a href="#diferenciais">
          Explore uma nova energia <MoveDown size={15} />
        </a>
        <span>*Conforme dimensionamento e condições da instalação.</span>
      </div>
    </section>
  );
}
