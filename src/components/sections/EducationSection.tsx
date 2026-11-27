'use client';

import { motion } from 'framer-motion';
import AmberCard from '@/components/ui/AmberCard';

const EASE = [0.22, 1, 0.36, 1] as const;

const EDUCATION = [
  {
    index: '01',
    title: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
    organization: 'Servicio Nacional de Aprendizaje (SENA)',
    note: 'Actualmente en etapa práctica',
  },
  {
    index: '02',
    title: 'Curso Complementario en Bases de Datos',
    organization: 'Servicio Nacional de Aprendizaje (SENA)',
    note: 'Certificado',
  },
  {
    index: '03',
    title: 'Media Técnica en Sistemas',
    organization: 'Formación base en informática',
    note: 'Lógica y fundamentos de sistemas',
  },
];

/** Formación real en tecnología, en tarjetas limpias y sin elementos 3D. */
export default function EducationSection() {
  return (
    <section id="formacion" className="relative py-14 sm:py-28">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: EASE }}
          className="flex items-center gap-4"
        >
          <span className="rounded-full border border-studio-gold/45 bg-studio-gold/15 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-studio-ink">
            04 — Formación
          </span>
          <span aria-hidden className="h-px flex-1 bg-studio-border" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, delay: 0.06, ease: EASE }}
          className="mt-6 max-w-2xl"
        >
          <h2 className="font-display text-3xl font-bold leading-tight text-studio-ink sm:text-4xl lg:text-[2.6rem]">
            Formación y{' '}
            <span className="text-studio-gradient">Certificaciones</span>
          </h2>
          <p className="mt-3 text-base text-studio-slate">
            Mi ruta en tecnología, de la base en sistemas al desarrollo de software aplicado.
          </p>
        </motion.div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:mt-10 lg:grid-cols-3">
          {EDUCATION.map((item, i) => (
            <AmberCard key={item.index} delay={0.08 * i} className="p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-studio-purple/30 bg-studio-purple/10 font-mono text-xs font-bold text-studio-purple-deep">
                  {item.index}
                </span>
                <span aria-hidden className="h-px flex-1 bg-studio-border" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold leading-snug text-studio-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-studio-purple-deep">{item.organization}</p>
              <p className="mt-4 inline-flex rounded-full border border-studio-green/35 bg-studio-green/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-studio-green-deep">
                {item.note}
              </p>
            </AmberCard>
          ))}
        </div>
      </div>
    </section>
  );
}
