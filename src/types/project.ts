export interface ProjectTech {
  label: string;
}

/** Tipo de desarrollo: administración PYMES, tienda virtual, API, web. */
export type ProjectCategory = 'pyme' | 'tienda' | 'api' | 'web';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  /** Categoría del desarrollo (para el badge temático) */
  category: ProjectCategory;
  status: 'destacado' | 'en-excavacion' | 'fosilizado';
  year: string;
  stack: string[];
  highlights: string[];
  /** Arquitectura del sistema — lista de capas/nodos para el modal */
  architecture?: Array<{ layer: string; detail: string }>;
  repoUrl?: string;
  liveUrl?: string;
  emoji?: string;
  /** Marcado en true cuando la ficha es una plantilla pendiente de rellenar */
  isPlaceholder?: boolean;
}
