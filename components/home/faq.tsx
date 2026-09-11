'use client';
import { useState, useId } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/components/ui/use-reduced-motion';
import { Plus } from 'lucide-react';
const questions = [
  [
    'Quanto posso economizar com energia solar?',
    'O potencial depende do seu consumo, da tarifa e do dimensionamento. A calculadora da FM SOLAR utiliza redução estimada de 80%; a análise técnica identifica o potencial real do seu imóvel.',
  ],
  [
    'A estimativa da calculadora já é um orçamento?',
    'Não. Ela apresenta uma estimativa para planejamento, com premissas explícitas de tarifa, geração e investimento. O orçamento exato depende da análise da conta de energia e das condições da instalação.',
  ],
  [
    'A FM SOLAR cuida da homologação?',
    'Sim. O serviço inclui projeto, documentação e acompanhamento junto à concessionária, além da instalação e do acompanhamento técnico.',
  ],
  [
    'Vocês atendem a minha região?',
    'A FM SOLAR atende em todo o território brasileiro. Fale com a equipe para avaliar o seu imóvel e as condições de atendimento.',
  ],
  [
    'Quais garantias estão incluídas?',
    'Os módulos e inversores possuem garantia de fábrica e suporte local. Os prazos e condições específicos são apresentados no orçamento, conforme os equipamentos escolhidos.',
  ],
];
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();
  const id = useId();
  return (
    <div className="faq-list">
      {questions.map(([q, a], i) => (
        <div className={`faq-item ${open === i ? 'open' : ''}`} key={q}>
          <h3>
            <button
              id={`${id}-q-${i}`}
              aria-expanded={open === i}
              aria-controls={`${id}-a-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span>
                <small>0{i + 1}</small>
                {q}
              </span>
              <Plus size={21} />
            </button>
          </h3>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                id={`${id}-a-${i}`}
                role="region"
                aria-labelledby={`${id}-q-${i}`}
                initial={reduced ? false : { height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduced ? 0 : 0.3 }}
              >
                <p>{a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
