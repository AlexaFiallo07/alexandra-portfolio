'use client';

import { useEffect, type ReactNode } from 'react';
import { useGLTF } from '@react-three/drei';
import CanvasLoader from '@/components/3d/CanvasLoader';
import GlbErrorBoundary from '@/components/3d/GlbErrorBoundary';
import { MODEL_PATHS, type ModelFile } from '@/lib/modelFiles';
import useModelAvailable from '@/lib/useModelAvailable';

interface ModelGateProps {
  file: ModelFile;
  /** Escena procedural que se muestra si el GLB no existe o falla. */
  fallback: ReactNode;
  /** Escena con el GLB (normalmente un <Canvas> con Suspense). */
  children: ReactNode;
  label?: string;
}

/**
 * Compuerta única para los tres GLB: comprueba el archivo, precarga con
 * useGLTF y, ante cualquier fallo, monta el respaldo procedural.
 */
export default function ModelGate({
  file,
  fallback,
  children,
  label = 'Cargando modelo GLB…',
}: ModelGateProps) {
  const available = useModelAvailable(file);

  useEffect(() => {
    if (available) useGLTF.preload(MODEL_PATHS[file]);
  }, [available, file]);

  if (available === null) {
    return (
      <div className="h-full w-full">
        <CanvasLoader label={label} />
      </div>
    );
  }

  if (!available) return <>{fallback}</>;

  return <GlbErrorBoundary fallback={fallback}>{children}</GlbErrorBoundary>;
}
