/** GLB permitidos: el robot T-Rex de la vitrina y el cráneo fósil. */
export const MODEL_FILES = {
  trexHero: 'trex_hero.glb',
  fossilSkull: 'fossil_skull.glb',
} as const;

export type ModelFile = (typeof MODEL_FILES)[keyof typeof MODEL_FILES];

export const MODEL_PATHS: Record<ModelFile, string> = {
  [MODEL_FILES.trexHero]: `/models/${MODEL_FILES.trexHero}`,
  [MODEL_FILES.fossilSkull]: `/models/${MODEL_FILES.fossilSkull}`,
};

export const MODEL_CLIPS = {
  trexHero: { idle: 'Idle', roar: 'Roar' },
  fossilSkull: { idle: 'Idle' },
} as const;
