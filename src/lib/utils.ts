import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Une clases condicionales resolviendo conflictos de Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Canales de contacto reales de Alexandra. */
export const CONTACT = {
  email: 'alexafialloc@gmail.com',
  github: 'https://github.com/AlexaFiallo07',
  githubHandle: '@AlexaFiallo07',
} as const;

/** Formatea un número como porcentaje de excavación. */
export function pct(value: number) {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
}
