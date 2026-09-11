'use client';
import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useReducedMotion } from '@/components/ui/use-reduced-motion';
import { SearchCheck, DraftingCompass, FileCheck2, Wrench, Sun } from 'lucide-react';
const steps = [
  {
    title: 'Análise',
    subtitle: 'Vistoria técnica',
    description: 'Avaliação do telhado, padrão de entrada e consumo.',
    Icon: SearchCheck,
  },
  {
    title: 'Projeto',
    subtitle: 'Engenharia sob medida',
    description: 'Dimensionamento, memorial e diagramas assinados.',
    Icon: DraftingCompass,
  },
  {
    title: 'Homologação',
    subtitle: 'Tudo em conformidade',
    description: 'Protocolo, acompanhamento e aprovação na concessionária.',
    Icon: FileCheck2,
  },
  {
    title: 'Instalação',
    subtitle: 'Precisão em cada detalhe',
    description: 'Montagem segura e comissionamento do sistema.',
    Icon: Wrench,
  },
  {
    title: 'Geração',
    subtitle: 'Sua energia, todos os dias',
    description: 'Sistema em operação, monitoramento e acompanhamento técnico.',
    Icon: Sun,
  },
];
export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start .8', 'end .45'] });
  const [active, setActive] = useState(-1);
  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.min(4, Math.floor(v * 5))));
  return (
    <div className="solar-timeline" ref={ref}>
      <div className="timeline-track" aria-hidden="true">
        <motion.div
          style={{ scaleX: reduced ? 1 : scrollYProgress }}
          className="timeline-fill horizontal"
        />
        <motion.div
          style={{ scaleY: reduced ? 1 : scrollYProgress }}
          className="timeline-fill vertical"
        />
      </div>
      {steps.map(({ title, subtitle, description, Icon }, i) => (
        <div className={`timeline-step ${reduced || i <= active ? 'is-active' : ''}`} key={title}>
          <span className="timeline-marker">
            <Icon size={22} />
          </span>
          <span className="timeline-index">0{i + 1}</span>
          <h3>{title}</h3>
          <strong>{subtitle}</strong>
          <p>{description}</p>
        </div>
      ))}
    </div>
  );
}
