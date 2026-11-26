/** Categorías del stack (agrupación de habilidades). */
export type StackCategory =
  | 'backend'
  | 'frontend'
  | 'movil'
  | 'datos'
  | 'devops'
  | 'videojuegos';

/** Tipo de fósil line-art asociado a una habilidad (icono SVG). */
export type FossilKind =
  | 'skull'
  | 'tricera'
  | 'vertebra'
  | 'egg'
  | 'footprint'
  | 'claw'
  | 'rib'
  | 'tooth'
  | 'wing'
  | 'spine';

export interface Skill {
  name: string;
  /** Nivel de dominio 0-100 (honesta, autoevaluada) */
  level: number;
  /** Breve descripción contextual de la habilidad */
  hint?: string;
  /** Estado actual: ya la uso en proyectos o está en aprendizaje activo */
  stage?: 'aplico' | 'desarrollo';
  /** Icono de fósil line-art que la representa */
  fossil: FossilKind;
}

export interface SkillGroup {
  id: StackCategory;
  /** Nombre de la categoría en español */
  label: string;
  /** Descriptor corto, ej. "El motor del sistema" */
  subtitle: string;
  /** Descripción editorial de la categoría */
  description: string;
  /** Color de acento de la categoría (hex) */
  accent: string;
  /** Icono de fósil de la categoría */
  icon: FossilKind;
  skills: Skill[];
}
