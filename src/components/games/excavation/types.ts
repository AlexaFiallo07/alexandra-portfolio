/** Herramienta seleccionada en el yacimiento. */
export type ExcavationTool = 'brush' | 'chisel';

/** Fases del ciclo de excavación. */
export type ExcavationPhase = 'digging' | 'emerging' | 'inspecting';

/** Formas procedurales disponibles (se usan si no hay GLB). */
export type FossilShape = 'trex' | 'claw' | 'ammonite' | 'vertebra';

export interface FossilSpec {
  id: string;
  shape: FossilShape;
  /** Nombre científico que se muestra en la tarjeta. */
  name: string;
  common: string;
  period: string;
  fact: string;
  accent: string;
  /** Altura aproximada del hueso, en unidades de mundo (centra la malla). */
  elevation: number;
  /** Profundidad de la parte más alta del hueso bajo la superficie (0 = a ras). */
  burial: number;
  /** Semiejes X/Z de la huella usada para medir el progreso. */
  footprint: [number, number];
  /**
   * Ruta opcional a un GLB en `/models`. Si se define, se carga con
   * `useGLTF` y se encuadra con `fitModel`; si falla, vuelve al procedural.
   */
  glb?: string;
  /** Enlace desbloqueado al completar el hallazgo. */
  href?: string;
  hrefLabel?: string;
}

/** Instancia aleatoria de un fósil en una partida. */
export interface Specimen {
  spec: FossilSpec;
  position: [number, number, number];
  rotationY: number;
  scale: number;
  /** Y de la superficie del hueso: la tierra debe bajar por debajo de ella. */
  topY: number;
}

/** Un punto de cepillado pendiente de aplicar al terreno. */
export interface DigPoint {
  x: number;
  z: number;
  tool: ExcavationTool;
}

/** API expuesta por el sistema de polvo para que el terreno emita partículas. */
export interface DustApi {
  emit?: (x: number, z: number, strength: number) => void;
}
