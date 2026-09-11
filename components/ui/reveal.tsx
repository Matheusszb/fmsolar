'use client';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/components/ui/use-reduced-motion';
export function Reveal({
  children,
  className = '',
  delay = 0,
  variant = 'up',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: 'up' | 'image' | 'side';
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`reveal reveal-${variant} ${className}`}
      initial={false}
      whileInView={
        reduced
          ? {}
          : variant === 'image'
            ? { opacity: [0.65, 1], scale: [1.035, 1] }
            : variant === 'side'
              ? { opacity: [0.35, 1], x: [-20, 0] }
              : { opacity: [0.4, 1], y: [24, 0] }
      }
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: variant === 'image' ? 0.95 : 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
