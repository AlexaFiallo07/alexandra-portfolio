import { cn } from '@/lib/utils';
import type { FossilKind } from '@/types';

/**
 * Iconos de fósil en line-art (stroke) para las habilidades.
 * El trazado se "dibuja" al hacer hover vía la clase .fossil-icon
 * definida en globals.css (stroke-dashoffset).
 */

interface FossilIconProps {
  kind: FossilKind;
  className?: string;
}

/** Paths de cada fósil (viewBox 48×48, solo trazo). */
const PATHS: Record<FossilKind, React.ReactNode> = {
  /* Cráneo de terópodo (T-Rex) */
  skull: (
    <>
      <path d="M6 27c0-9 7-15 16-15h12c6 1 9 6 8 12l-1 4c-1 4-5 6-10 6H16c-6 0-10-3-10-7z" />
      <path d="M40 24h4M14 34v4M24 34v5M33 33v4" />
      <circle cx="17" cy="22" r="4" />
      <path d="M30 15l1-4M35 16l3-3" />
      <path d="M10 30h26" />
    </>
  ),
  /* Cráneo de Triceratops (frill + 3 cuernos) */
  tricera: (
    <>
      <path d="M10 22c0-8 6-14 14-14s14 6 14 14c0 5-2 9-6 12l-8 5-8-5c-4-3-6-7-6-12z" />
      <path d="M14 20c0-5 4-9 10-9s10 4 10 9" />
      <path d="M24 34l-2 8M18 32l-6 6M30 32l6 6" />
      <circle cx="18" cy="23" r="2.5" />
      <circle cx="30" cy="23" r="2.5" />
      <path d="M21 31h6" />
    </>
  ),
  /* Vértebra */
  vertebra: (
    <>
      <circle cx="24" cy="24" r="8" />
      <circle cx="24" cy="24" r="3" />
      <path d="M24 16V6M24 32v10M16 24H6M32 24h10" />
      <path d="M18 18l-6-6M30 18l6-6M18 30l-6 6M30 30l6 6" />
    </>
  ),
  /* Huevo fósil */
  egg: (
    <>
      <path d="M24 6c8 0 14 11 14 21a14 14 0 0 1-28 0C10 17 16 6 24 6z" />
      <path d="M14 30l6-4 5 5 6-4 4 4" />
      <path d="M19 16l3 3M27 13l-2 4" />
    </>
  ),
  /* Huella de dino (3 dedos) */
  footprint: (
    <>
      <path d="M24 42c-7 0-12-5-12-11 0-5 4-8 6-13 1-3 3-5 6-5s5 2 6 5c2 5 6 8 6 13 0 6-5 11-12 11z" />
      <path d="M14 14c-3-3-4-7-3-10 4 0 8 3 9 7M34 14c3-3 4-7 3-10-4 0-8 3-9 7" />
      <path d="M20 34l1 4M28 34l-1 4" />
    </>
  ),
  /* Garra */
  claw: (
    <>
      <path d="M8 8c2 14 10 24 24 30-8-10-12-20-12-30-4 4-9 4-12 0z" />
      <path d="M20 14c4 8 10 15 18 20" />
      <path d="M14 34c4 3 9 5 14 6" />
    </>
  ),
  /* Costilla */
  rib: (
    <>
      <path d="M12 6v36" />
      <path d="M12 12c12 0 22 6 24 18" />
      <path d="M12 22c8 1 15 5 17 12" />
      <path d="M12 32c5 1 9 4 11 8" />
      <path d="M8 10h8M8 20h8M8 30h8" />
    </>
  ),
  /* Diente */
  tooth: (
    <>
      <path d="M14 8h20l-3 12c-1 6-4 14-7 20-3-6-6-14-7-20z" />
      <path d="M17 16h14" />
      <path d="M21 24c1 6 2 11 3 16" />
    </>
  ),
  /* Ala de pterodáctilo */
  wing: (
    <>
      <path d="M6 14c10-4 20-2 28 6M6 14c2 12 10 22 24 28" />
      <path d="M34 20c4 6 6 14 4 22" />
      <path d="M6 14l-3-5M14 13l1-6M23 14l4-5" />
      <path d="M14 13c4 8 12 16 22 20" />
    </>
  ),
  /* Columna vertebral */
  spine: (
    <>
      <path d="M6 34c8 4 16 2 22-4s10-14 14-20" />
      <circle cx="9" cy="33" r="3.5" />
      <circle cx="17" cy="35" r="3.5" />
      <circle cx="25" cy="31" r="3.5" />
      <circle cx="31" cy="24" r="3.5" />
      <circle cx="36" cy="16" r="3.5" />
      <path d="M9 29V24M17 31v-5M25 27v-5M31 20v-5" />
    </>
  ),
};

/** Icono de fósil line-art que brilla y se "dibuja" al hacer hover. */
export default function FossilIcon({ kind, className }: FossilIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('fossil-icon', className)}
      aria-hidden
    >
      {PATHS[kind]}
    </svg>
  );
}
