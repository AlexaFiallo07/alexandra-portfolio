import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Une clases condicionales resolviendo conflictos de Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Canales de contacto de Alexandra.
 * ⚠️ Reemplaza estos valores con tu correo, GitHub y LinkedIn reales.
 */
export const CONTACT = {
  email: 'alexandra.fiallo.dev@gmail.com',
  github: 'https://github.com/alexandrafiallo',
  githubHandle: '@alexandrafiallo',
  linkedin: 'https://www.linkedin.com/in/alexandra-fiallo',
  linkedinHandle: 'Alexandra Fiallo',
} as const;

/** Formatea un número como porcentaje de excavación. */
export function pct(value: number) {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
}
