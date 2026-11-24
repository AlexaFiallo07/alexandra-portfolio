import { cn } from '@/lib/utils';
import type { ProjectCategory } from '@/types';

const CATEGORY_STYLES: Record<
  ProjectCategory,
  { label: string; className: string; dot: string }
> = {
  pyme: {
    label: 'Sistema PYME',
    className: 'border-studio-purple/30 bg-studio-purple/10 text-studio-purple-deep',
    dot: 'bg-studio-purple',
  },
  tienda: {
    label: 'Tienda Virtual',
    className: 'border-studio-green/35 bg-studio-green/10 text-studio-green-deep',
    dot: 'bg-studio-green',
  },
  api: {
    label: 'API REST',
    className: 'border-studio-purple-deep/30 bg-studio-pearl text-studio-purple-deep',
    dot: 'bg-studio-purple-deep',
  },
  web: {
    label: 'Web App',
    className: 'border-studio-border bg-studio-pearl text-studio-ink',
    dot: 'bg-studio-green',
  },
};

interface CategoryBadgeProps {
  category: ProjectCategory;
  label?: string;
  className?: string;
}

/** Tag de categoría de proyecto con alto contraste sobre fondo claro. */
export default function CategoryBadge({ category, label, className }: CategoryBadgeProps) {
  const style = CATEGORY_STYLES[category];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]',
        style.className,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} aria-hidden />
      {label ?? style.label}
    </span>
  );
}
