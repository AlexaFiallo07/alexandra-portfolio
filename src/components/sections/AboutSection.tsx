'use client';

import { motion } from 'framer-motion';
import AmberCard from '@/components/ui/AmberCard';

const EASE = [0.22, 1, 0.36, 1] as const;

const VALUES = [
  {
    index: '01',
    title: 'Lógica y datos',
    text: 'Modelo datos, diseño APIs REST y escribo pruebas para que el sistema sea comprensible y mantenible.',
  },
  {
    index: '02',
    title: 'Interacción clara',
    text: 'Interfaces web y móviles accesibles, con animación y microinteracciones que ayudan en lugar de distraer.',
  },
  {
    index: '03',
    title: 'Aprendizaje continuo',
    text: 'Amplío el perfil con TypeScript, React, Docker y la ruta de videojuegos en C# y Rust, aplicando cada tema en proyectos pequeños.',
  },
];

/** Sobre mí: perfil honesto de Alexandra en etapa ADSO, sin personajes accesorios. */
export default function AboutSection() {
  return (
    <section id="sobre-mi" className="relative py-20 sm:py-28">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* Encabezado de sección */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: EASE }}
          className="flex items-center gap-4"
        >
          <span className="rounded-full border border-studio-purple/30 bg-studio-purple/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-studio-purple-deep">
            01 — Sobre mí
          </span>
          <span aria-hidden className="h-px flex-1 bg-studio-border" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative mt-10"
        >
          <div className="relative overflow-hidden rounded-3xl border border-studio-border bg-studio-card p-6 shadow-studio sm:p-10">
            <div className="max-w-3xl">
              <h2 className="font-display text-3xl font-bold leading-tight text-studio-ink sm:text-4xl lg:text-[2.6rem]">
                Full Stack en construcción:{' '}
                <span className="text-studio-gradient">datos, API e interfaz</span>.
              </h2>

              <p className="mt-5 text-base leading-relaxed text-studio-slate">
                Soy <strong className="font-semibold text-studio-ink">Alexandra Fiallo Carrillo</strong>
                . Estoy en la etapa práctica del Tecnólogo en Análisis y Desarrollo de Software (ADSO)
                del SENA. Construyo software que resuelve problemas concretos: modelo los datos,
                diseño la API e implemento la interfaz. Mi proyecto{' '}
                <strong className="font-semibold text-studio-ink">EffiAdmi</strong>, aún en
                desarrollo, resume ese enfoque en inventarios, pedidos, facturación y reportes.
              </p>
              <p className="mt-4 text-base leading-relaxed text-studio-slate">
                No me cierro a ningún tipo de proyecto. Me gusta crear herramientas funcionales para
                empresas que reduzcan cargas laborales y simplifiquen los procesos diarios. También
                disfruto desarrollar videojuegos creativos, intuitivos y divertidos que ayuden a
                entrenar habilidades o conocimientos.
              </p>

              <blockquote className="mt-7 rounded-2xl border-l-4 border-studio-gold bg-studio-pearl/70 px-5 py-4">
                <p className="font-display text-base font-medium italic leading-relaxed text-studio-ink sm:text-lg">
                  “El problema manda: lo simple se entiende, lo mantenible dura, lo útil se nota.
                  La tecnología es medio, no meta.”
                </p>
              </blockquote>
            </div>

            {/* Sellos de especialidad */}
            <div className="mt-8 flex flex-wrap gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]">
              <span className="rounded-md border border-studio-purple/25 bg-studio-purple/10 px-2.5 py-1 text-studio-purple-deep">
                Python · Django REST
              </span>
              <span className="rounded-md border border-studio-purple/25 bg-studio-purple/10 px-2.5 py-1 text-studio-purple-deep">
                JavaScript · Node.js
              </span>
              <span className="rounded-md border border-studio-green/30 bg-studio-green/10 px-2.5 py-1 text-studio-green-deep">
                MySQL · PostgreSQL · MongoDB
              </span>
              <span className="rounded-md border border-studio-border bg-studio-pearl px-2.5 py-1 text-studio-ink">
                Flutter · Videojuegos
              </span>
            </div>
          </div>
        </motion.div>

        {/* Pilares de trabajo */}
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {VALUES.map((v, i) => (
            <AmberCard key={v.index} delay={0.1 + i * 0.08} className="p-6">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-studio-purple/30 bg-studio-purple/10 font-mono text-xs font-bold text-studio-purple-deep">
                {v.index}
              </span>
              <h3 className="mt-4 font-display text-lg font-bold text-studio-ink">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-studio-slate">{v.text}</p>
            </AmberCard>
          ))}
        </div>
      </div>
    </section>
  );
}
