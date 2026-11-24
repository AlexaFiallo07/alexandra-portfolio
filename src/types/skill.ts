export type Era = 'triassic' | 'jurassic' | 'cretaceous';

export interface Skill {
  name: string;
  /** Nivel de dominio 0-100 (para la barra de excavación) */
  level: number;
  /** Breve descripción contextual de la habilidad */
  hint?: string;
}

export interface EraGroup {
  era: Era;
  /** Nombre de la era en español */
  label: string;
  /** Rango temporal, ej. "252 – 201 Ma" */
  range: string;
  /** Descriptor de la era, ej. "Nacimiento de los gigantes" */
  subtitle: string;
  /** Descripción editorial de la era */
  description: string;
  /** Color de acento de la era (hex) */
  accent: string;
  skills: Skill[];
}
