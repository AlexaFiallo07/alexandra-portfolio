'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

/** Interacción compartida por las vitrinas 3D: seleccionar, arrastrar y mirar al cursor. */
export function useStudioPointer(onActivate?: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(false);
  const [dragging, setDragging] = useState(false);

  const dragStart = useRef({ x: 0, y: 0, moved: false });
  const lastPos = useRef({ x: 0, y: 0 });
  const dragDelta = useRef({ x: 0, y: 0 });
  const pointerNorm = useRef({ x: 0, y: 0 });
  const activateRef = useRef(onActivate);
  activateRef.current = onActivate;

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      pointerNorm.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerNorm.current.y = -((event.clientY / window.innerHeight) * 2 - 1);

      if (!dragging) return;
      const dx = event.clientX - dragStart.current.x;
      const dy = event.clientY - dragStart.current.y;
      if (Math.hypot(dx, dy) > 4) dragStart.current.moved = true;
      dragDelta.current.x += event.clientX - lastPos.current.x;
      dragDelta.current.y += event.clientY - lastPos.current.y;
      lastPos.current = { x: event.clientX, y: event.clientY };
    };

    const onPointerUp = () => {
      if (!dragging) return;
      setDragging(false);
      if (!dragStart.current.moved) {
        setSelected((prev) => !prev);
        activateRef.current?.();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelected(false);
        setDragging(false);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [dragging]);

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    dragStart.current = { x: event.clientX, y: event.clientY, moved: false };
    lastPos.current = { x: event.clientX, y: event.clientY };
    dragDelta.current = { x: 0, y: 0 };
    setDragging(true);
  }, []);

  const onKeyDownActivate = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelected((prev) => !prev);
      activateRef.current?.();
    }
  }, []);

  return {
    containerRef,
    selected,
    dragging,
    dragDelta,
    pointerNorm,
    onPointerDown,
    onKeyDownActivate,
  };
}
