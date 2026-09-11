'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion, animate } from 'framer-motion';
export function Counter({
  value,
  prefix = '',
  suffix = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(value);
  useEffect(() => {
    if (!visible || reduced) return;
    const animation = animate(0, value, {
      duration: 1.2,
      onUpdate: (n) => setCount(Math.round(n)),
    });
    return () => animation.stop();
  }, [visible, reduced, value]);
  return (
    <strong ref={ref} aria-label={`${prefix}${value}${suffix}`}>
      <span
        aria-hidden="true"
        style={{ fontSize: 'inherit', color: 'inherit', lineHeight: 'inherit', margin: 0 }}
      >
        {prefix}
        {count}
        {suffix}
      </span>
    </strong>
  );
}
