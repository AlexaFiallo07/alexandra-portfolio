'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';
import PixelRaptor from '@/components/dino/PixelRaptor';

const LINKS = [
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'stack', label: 'Stack' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'formacion', label: 'Formación' },
];

/**
 * Navbar de una sola fila: marca a la izquierda, pista Dino independiente en el
 * centro y navegación + CTA a la derecha. En móvil la pista se compacta y los
 * enlaces pasan al menú hamburguesa sin romper la fila.
 */
export default function Navbar() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const ids = ['inicio', ...LINKS.map((l) => l.id), 'contacto'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Barra superior de progreso */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-studio-purple-deep via-studio-purple to-studio-green"
      />

      <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-3 sm:px-4">
        <nav
          aria-label="Navegación principal"
          className="studio-glass relative flex w-full max-w-6xl items-center justify-between gap-3 rounded-full px-3 py-2 sm:gap-4 sm:px-4"
        >
          {/* ---------- Izquierda: marca ---------- */}
          <button
            onClick={() => go('inicio')}
            className="flex shrink-0 items-center gap-2.5 rounded-full pr-1 transition-opacity hover:opacity-85"
            aria-label="Volver al inicio"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full border border-studio-purple-deep bg-studio-purple font-display text-sm font-bold text-white shadow-sm">
              AF
            </span>
            <span className="hidden font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-studio-ink sm:block">
              A. Fiallo
            </span>
          </button>

          {/* ---------- Centro: pista Dino independiente ---------- */}
          <div className="flex min-w-0 flex-1 justify-center sm:max-w-xs lg:max-w-sm">
            <PixelRaptor />
          </div>

          {/* ---------- Derecha: enlaces, CTA y menú ---------- */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ul className="hidden items-center gap-0.5 lg:flex">
              {LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => go(link.id)}
                    className={cn(
                      'relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
                      active === link.id
                        ? 'bg-studio-purple/10 text-studio-purple-deep after:absolute after:bottom-0.5 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-studio-purple-deep after:content-[""]'
                        : 'text-studio-slate hover:bg-studio-pearl hover:text-studio-ink',
                    )}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            <button
              onClick={() => go('contacto')}
              className={cn(
                'hidden rounded-full border px-4 py-1.5 text-sm font-semibold transition-all md:inline-flex',
                active === 'contacto'
                  ? 'border-studio-purple-deep bg-studio-purple-deep text-white shadow-studio'
                  : 'border-studio-purple-deep bg-studio-purple text-white hover:bg-studio-purple-deep',
              )}
            >
              Contacto
            </button>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
              className="grid h-8 w-8 place-items-center rounded-full border border-studio-border bg-studio-bg text-studio-ink sm:h-9 sm:w-9 lg:hidden"
            >
              <span className="relative block h-3 w-4">
                <span
                  className={cn(
                    'absolute inset-x-0 top-0 h-0.5 bg-current transition-transform',
                    open && 'top-1/2 -translate-y-1/2 rotate-45',
                  )}
                />
                <span
                  className={cn(
                    'absolute inset-x-0 bottom-0 h-0.5 bg-current transition-transform',
                    open && 'bottom-1/2 translate-y-1/2 -rotate-45',
                  )}
                />
              </span>
            </button>
          </div>

          {/* Panel móvil/tablet: misma cápsula, sin segunda fila permanente */}
          {open && (
            <motion.ul
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="studio-glass absolute left-0 right-0 top-full z-50 mt-2 flex flex-col gap-0.5 rounded-2xl p-2.5 lg:hidden"
            >
              {[...LINKS, { id: 'contacto', label: 'Contacto' }].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => go(link.id)}
                    className={cn(
                      'w-full rounded-xl px-4 py-2 text-left text-sm font-medium transition-colors',
                      active === link.id
                        ? 'bg-studio-purple/10 text-studio-purple-deep'
                        : 'text-studio-ink hover:bg-studio-pearl',
                    )}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </nav>
      </header>
    </>
  );
}
