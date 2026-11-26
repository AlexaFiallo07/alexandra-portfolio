'use client';

import { useCallback, useEffect, useState } from 'react';
import { FOSSIL_CATALOG } from './catalog';
import { BED_DEPTH, BED_WIDTH, REVEAL_THRESHOLD } from './constants';
import type { ExcavationPhase, ExcavationTool, Specimen } from './types';

/** Posición, escala y giro aleatorios; nunca repetimos el fósil anterior. */
function createSpecimen(avoid?: string): Specimen {
  const pool = FOSSIL_CATALOG.filter((item) => item.id !== avoid);
  const spec = pool[Math.floor(Math.random() * pool.length)] ?? FOSSIL_CATALOG[0];
  const scale = 0.9 + Math.random() * 0.22;
  const marginX = spec.footprint[0] * scale + 0.35;
  const marginZ = spec.footprint[1] * scale + 0.35;
  const x = (Math.random() * 2 - 1) * Math.max(0, BED_WIDTH / 2 - marginX);
  const z = (Math.random() * 2 - 1) * Math.max(0, BED_DEPTH / 2 - marginZ);
  const topY = -(spec.burial + Math.random() * 0.025);
  const y = topY - (spec.elevation * scale) / 2;

  return {
    spec,
    position: [x, y, z],
    rotationY: Math.random() * Math.PI * 2,
    scale,
    topY,
  };
}

/** Estado del ciclo: excavar → emerger → inspeccionar → siguiente. */
export function useExcavation() {
  const [round, setRound] = useState(1);
  const [specimen, setSpecimen] = useState<Specimen>(() => createSpecimen());
  const [tool, setTool] = useState<ExcavationTool>('brush');
  const [phase, setPhase] = useState<ExcavationPhase>('digging');
  const [progress, setProgress] = useState(0);
  const [found, setFound] = useState<string[]>([]);

  const handleProgress = useCallback((value: number) => {
    const clamped = Math.max(0, Math.min(1, value));
    setProgress(clamped);
    if (clamped >= REVEAL_THRESHOLD) {
      setPhase((current) => (current === 'digging' ? 'emerging' : current));
    }
  }, []);

  useEffect(() => {
    if (phase !== 'emerging') return;
    const timer = window.setTimeout(() => {
      setPhase('inspecting');
      setFound((current) =>
        current.includes(specimen.spec.id) ? current : [...current, specimen.spec.id],
      );
    }, 1150);
    return () => window.clearTimeout(timer);
  }, [phase, specimen.spec.id]);

  const next = useCallback(() => {
    setSpecimen((current) => createSpecimen(current.spec.id));
    setRound((value) => value + 1);
    setPhase('digging');
    setProgress(0);
  }, []);

  return { round, specimen, tool, setTool, phase, progress, found, handleProgress, next };
}
