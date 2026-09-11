'use client';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/components/ui/use-reduced-motion';
export function Ambient({
  children,
  className = '',
  parallax = false,
}: {
  children: React.ReactNode;
  className?: string;
  parallax?: boolean;
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 65, damping: 24 });
  const sy = useSpring(y, { stiffness: 65, damping: 24 });
  return (
    <motion.div
      className={`ambient ${className}`}
      style={parallax ? { x: sx, y: sy } : undefined}
      onPointerMove={(e) => {
        if (
          reduced ||
          e.pointerType !== 'mouse' ||
          !window.matchMedia('(hover:hover) and (min-width:900px)').matches
        )
          return;
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - r.top}px`);
        if (parallax) {
          x.set(((e.clientX - r.left) / r.width - 0.5) * 16);
          y.set(((e.clientY - r.top) / r.height - 0.5) * 16);
        }
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="scroll-progress"
      aria-hidden="true"
      style={{ scaleX: reduced ? 0 : scrollYProgress }}
    />
  );
}
export function ParallaxPhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  return (
    <div className="cta-photo-clip" ref={ref} aria-hidden="true">
      <motion.div className="cta-photo" style={{ y: reduced ? 0 : y }} />
    </div>
  );
}
