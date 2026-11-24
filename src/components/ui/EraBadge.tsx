import { cn } from '@/lib/utils';
import type { Era } from '@/types';

const ERA_STYLES: Record<Era, { label: string; className: string; dot: string }> = {
  triassic: {
    label: 'Triásico',
    className: 'border-[#9C6B3F]/50 bg-[#9C6B3F]/10 text-[#8A5A2B]',
    dot: 'bg-[#9C6B3F]',
  },
  jurassic: {
    label: 'Jurásico',
    className: 'border-meso-moss/60 bg-meso-moss/12 text-[#22774F]',
    dot: 'bg-meso-moss',
  },
  cretaceous: {
    label: 'Cretácico',
    className: 'border-meso-amber/50 bg-meso-amber/10 text-meso-ember',
    dot: 'bg-meso-amber',
  },
};

interface EraBadgeProps {
  era: Era;
  /** Etiqueta personalizada (por defecto: nombre de la era) */
  label?: string;
  className?: string;
}

/** Tag temático de era geológica con punto estratigráfico. */
export default function EraBadge({ era, label, className }: EraBadgeProps) {
  const style = ERA_STYLES[era];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em]',
        style.className,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} aria-hidden />
      {label ?? style.label}
    </span>
  );
}
