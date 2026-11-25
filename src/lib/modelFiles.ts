/** Archivos GLB aceptados por el portafolio y sus nombres de clips. */
export const MODEL_FILES = {
  theropodRun: 'theropod_run.glb',
  fossilSkull: 'fossil_skull.glb',
  trexHero: 'trex_hero.glb',
} as const;

export type ModelFile = (typeof MODEL_FILES)[keyof typeof MODEL_FILES];

export const MODEL_PATHS: Record<ModelFile, string> = {
  [MODEL_FILES.theropodRun]: `/models/${MODEL_FILES.theropodRun}`,
  [MODEL_FILES.fossilSkull]: `/models/${MODEL_FILES.fossilSkull}`,
  [MODEL_FILES.trexHero]: `/models/${MODEL_FILES.trexHero}`,
};

export const MODEL_CLIPS = {
  theropodRun: { idle: 'Idle', run: 'Run', jump: 'Jump' },
  fossilSkull: { idle: 'Idle' },
  trexHero: { idle: 'Idle', roar: 'Roar' },
} as const;
