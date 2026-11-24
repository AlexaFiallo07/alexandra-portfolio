'use client';

import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AmberCardProps extends Omit<HTMLMotionProps<'article'>, 'children'> {
  children?: ReactNode;
  /** Muestra el resplandor ámbar en el borde al pasar el cursor */
  glow?: boolean;
  /** Retraso de aparición escalonada (segundos) */
  delay?: number;
}

/**
 * Contenedor tipo "piedra caliza" con glassmorphism, borde roca erosionada
 * y resplandor ámbar opcional al interactuar.
 */
export default function AmberCard({
  children,
  className,
  glow = true,
  delay = 0,
  ...rest
}: AmberCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={glow ? { y: -6 } : undefined}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-meso-rock/80 glass shadow-card',
        glow &&
          'transition-[box-shadow,border-color] duration-500 hover:border-meso-amber/50 hover:shadow-amber',
        className,
      )}
      {...rest}
    >
      {/* Resplandor interior ámbar */}
      {glow && (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(500px circle at var(--x,50%) var(--y,0%), rgba(102,87,226,0.10), transparent 65%)',
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.article>
  );
}
