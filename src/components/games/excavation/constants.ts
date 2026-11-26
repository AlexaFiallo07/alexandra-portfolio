/** Medidas del lecho de excavación, en unidades de mundo. */
export const BED_WIDTH = 5;
export const BED_DEPTH = 3.8;

/** Densidad de la malla deformable (≈12k vértices). */
export const TERRAIN_SEG_X = 128;
export const TERRAIN_SEG_Z = 96;

/** Profundidad máxima que se puede retirar. */
export const MAX_DEPTH = 0.56;

/** Superficie descubierta necesaria para activar la inspección (88 %). */
export const REVEAL_THRESHOLD = 0.88;

/** Parámetros de cada herramienta: radio y profundidad por trazo. */
export const TOOL_SETTINGS = {
  brush: { radius: 0.54, strength: 0.018, dust: 0.65 },
  chisel: { radius: 0.21, strength: 0.055, dust: 1 },
} as const;
