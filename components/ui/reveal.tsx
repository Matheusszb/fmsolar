'use client';
import { motion, useReducedMotion } from 'framer-motion';
export function Reveal({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={`reveal ${className}`}
      initial={{ opacity: 1, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: reduced ? 0 : 0.5 }}
    >
      {children}
    </motion.div>
  );
}
