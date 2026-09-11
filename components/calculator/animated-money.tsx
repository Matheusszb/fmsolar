'use client';
import { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';
import { useReducedMotion } from '@/components/ui/use-reduced-motion';
import { currency } from '@/lib/solarCalculator';
export function AnimatedMoney({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) {
      previous.current = value;
      if (ref.current) ref.current.textContent = currency(value);
      return;
    }
    const animation = animate(previous.current, value, {
      duration: 0.55,
      ease: 'easeOut',
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = currency(v);
      },
      onComplete: () => {
        previous.current = value;
      },
    });
    return () => {
      animation.stop();
      previous.current = value;
    };
  }, [value, reduced]);
  return <span ref={ref}>{currency(value)}</span>;
}
