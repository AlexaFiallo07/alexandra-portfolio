'use client';

import { useEffect, useState } from 'react';
import type { ModelFile } from '@/lib/modelFiles';

const cache = new Map<ModelFile, boolean>();

/**
 * Consulta al servidor si el GLB existe. Usamos una ruta API en vez de un
 * HEAD directo a /models para no ensuciar la consola con 404 esperados.
 * `null` significa "todavía comprobando".
 */
export default function useModelAvailable(file: ModelFile): boolean | null {
  const [available, setAvailable] = useState<boolean | null>(() => cache.get(file) ?? null);

  useEffect(() => {
    if (cache.has(file)) {
      setAvailable(cache.get(file) ?? false);
      return;
    }

    const controller = new AbortController();
    fetch(`/api/models/status?file=${encodeURIComponent(file)}`, {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then(async (response) => {
        if (!response.ok) return false;
        const data = (await response.json()) as { available?: boolean };
        return Boolean(data.available);
      })
      .then((exists) => {
        cache.set(file, exists);
        setAvailable(exists);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        cache.set(file, false);
        setAvailable(false);
      });

    return () => controller.abort();
  }, [file]);

  return available;
}
