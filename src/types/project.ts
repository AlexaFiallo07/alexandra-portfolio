export interface ProjectTech {
  label: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  /** Era geológica asociada (para el badge temático) */
  era: 'triassic' | 'jurassic' | 'cretaceous';
  status: 'destacado' | 'en-excavacion' | 'fosilizado';
  year: string;
  stack: string[];
  highlights: string[];
  /** Arquitectura del sistema — lista de capas/nodos para el modal */
  architecture?: Array<{ layer: string; detail: string }>;
  repoUrl?: string;
  liveUrl?: string;
  emoji?: string;
}
