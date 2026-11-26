'use client';

import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AmberCardProps extends Omit<HTMLMotionProps<'article'>, 'children'> {
  children?: ReactNode;
  /** Muestra resplandor morado y elevación sutil al pasar el cursor */
  glow?: boolean;
  /** Retraso de aparición escalonada (segundos) */
  delay?: number;
}

/**
 * Tarjeta luminosa estilo estudio interactivo / brutalismo suave:
 * fondo #FFFFFF, borde 1px solid #E4DCF1 y sombra suave morada.
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={glow ? { y: -4 } : undefined}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-studio-border bg-studio-card shadow-studio',
        glow &&
          'transition-[box-shadow,border-color,transform] duration-300 hover:border-studio-purple/60 hover:shadow-studio-lg',
        className,
      )}
      {...rest}
    >
      <div className="relative z-10 h-full">{children}</div>
    </motion.article>
  );
}
