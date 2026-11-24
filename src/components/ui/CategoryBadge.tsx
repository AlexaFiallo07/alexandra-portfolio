import { cn } from '@/lib/utils';
import type { ProjectCategory } from '@/types';

const CATEGORY_STYLES: Record<
  ProjectCategory,
  { label: string; className: string; dot: string }
> = {
  pyme: {
    label: 'Sistema PYME',
    className: 'border-meso-amber/50 bg-meso-amber/10 text-meso-amber',
    dot: 'bg-meso-amber',
  },
  tienda: {
    label: 'Tienda Virtual',
    className: 'border-meso-moss/60 bg-meso-moss/12 text-[#C4A35A]',
    dot: 'bg-meso-moss',
  },
  api: {
    label: 'API REST',
    className: 'border-[#6A4DAB]/60 bg-[#6A4DAB]/15 text-[#A98FD6]',
    dot: 'bg-[#6A4DAB]',
  },
  web: {
    label: 'Web App',
    className: 'border-meso-rock bg-meso-stone text-meso-mist',
    dot: 'bg-meso-mist',
  },
};

interface CategoryBadgeProps {
  category: ProjectCategory;
  /** Etiqueta personalizada (por defecto: nombre de la categoría) */
  label?: string;
  className?: string;
}

/** Tag de categoría de proyecto con punto de acento. */
export default function CategoryBadge({ category, label, className }: CategoryBadgeProps) {
  const style = CATEGORY_STYLES[category];
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
