'use client';
import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useReducedMotion } from '@/components/ui/use-reduced-motion';
import { ArrowLeft, ArrowRight, Quote, Pause, Play, Star } from 'lucide-react';
const testimonials = [
  {
    quote:
      'Minha conta de luz era R$ 1.200, hoje pago praticamente só a taxa mínima. Melhor investimento que fiz na propriedade.',
    name: 'José Alves',
    location: 'Gurupi - TO',
  },
  {
    quote:
      'A FM SOLAR fez todo o projeto, homologação e instalou o sistema para irrigação. Atendimento técnico de verdade.',
    name: 'Irrigação Vale do Tocantins',
    location: 'Porto Nacional - TO',
  },
  {
    quote:
      'Equipe pontual, projeto bem explicado e instalação limpa. Recomendo para quem quer energia solar com segurança.',
    name: 'Maria Helena',
    location: 'Palmas - TO',
  },
];
export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref);
  useEffect(() => {
    const handler = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);
  useEffect(() => {
    if (paused || interacting || reduced || !visible || hidden) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 9000);
    return () => clearInterval(timer);
  }, [paused, interacting, reduced, visible, hidden]);
  const t = testimonials[index];
  function move(delta: number) {
    setPaused(true);
    setIndex((i) => (i + delta + testimonials.length) % testimonials.length);
  }
  return (
    <div
      ref={ref}
      className="testimonials-editorial"
      role="region"
      aria-roledescription="carrossel"
      aria-label="Depoimentos de clientes"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setInteracting(false);
      }}
    >
      <div className="quote-symbol">
        <Quote size={65} strokeWidth={1} />
        <span>
          CONFIANÇA CONSTRUÍDA
          <br />
          PROJETO A PROJETO.
        </span>
      </div>
      <div className="testimonial-stage">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={index}
            initial={reduced ? false : { opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? {} : { opacity: 0, x: -12 }}
            transition={{ duration: 0.45 }}
            aria-live={paused ? 'polite' : 'off'}
          >
            <div className="testimonial-stars" aria-label="5 estrelas">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={15} fill="currentColor" />
              ))}
            </div>
            <blockquote>“{t.quote}”</blockquote>
            <div className="testimonial-author">
              <span>{t.name}</span>
              <small>{t.location}</small>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="testimonial-controls">
          <span className="slide-position">
            0{index + 1} <i /> 03
          </span>
          <div className="button-row">
            <button
              className="icon-button"
              aria-label="Depoimento anterior"
              onClick={() => move(-1)}
            >
              <ArrowLeft size={19} />
            </button>
            <button className="icon-button" aria-label="Próximo depoimento" onClick={() => move(1)}>
              <ArrowRight size={19} />
            </button>
            <button
              className="icon-button"
              aria-label={paused ? 'Reproduzir depoimentos' : 'Pausar depoimentos'}
              onClick={() => setPaused(!paused)}
              disabled={!!reduced}
            >
              {paused ? <Play size={16} /> : <Pause size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
