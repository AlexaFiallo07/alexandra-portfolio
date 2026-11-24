import { CONTACT } from '@/lib/utils';

const NAV = [
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'eras', label: 'Eras & Skills' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'contacto', label: 'Contacto' },
];

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12v3.14c0 .3.21.67.8.55A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth={1.6}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" strokeLinecap="round" />
    </svg>
  );
}

/** Pie de página con estratigrafía decorativa y canales de contacto. */
export default function Footer() {
  return (
    <footer className="relative border-t border-meso-rock/80 bg-meso-night">
      {/* Estratos decorativos */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-meso-amber/50 to-transparent" />

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Marca */}
        <div>
          <p className="font-display text-2xl font-semibold">
            Alexandra <span className="text-amber-gradient">Fiallo</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-meso-mist">
            Full Stack &amp; 3D Web Developer. Creo software útil que capacite a las
            personas y videojuegos que se sientan vivos.
          </p>
          <div className="mt-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-meso-rock">
            <span className="text-[#9C6B3F]">Triásico</span>
            <span aria-hidden className="h-px w-8 bg-meso-rock" />
            <span className="text-[#22774F]">Jurásico</span>
            <span aria-hidden className="h-px w-8 bg-meso-rock" />
            <span className="text-meso-amber/70">Cretácico</span>
          </div>
        </div>

        {/* Navegación */}
        <nav aria-label="Enlaces del pie">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-meso-amber">
            Estratos
          </p>
          <ul className="mt-4 space-y-2.5">
            {NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-sm text-meso-limestone/70 transition-colors hover:text-meso-amber"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Canales */}
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-meso-amber">
            Contacto
          </p>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href={CONTACT.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 text-sm text-meso-limestone/70 transition-colors hover:text-meso-amber"
              >
                <GitHubIcon className="h-4 w-4" />
                {CONTACT.githubHandle}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="group inline-flex items-center gap-2.5 text-sm text-meso-limestone/70 transition-colors hover:text-meso-amber"
              >
                <MailIcon className="h-4 w-4" />
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="border-t border-meso-rock/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 font-mono text-[11px] uppercase tracking-[0.16em] text-meso-mist/70 sm:flex-row sm:px-8">
          <p>© 2026 Alexandra Fiallo</p>
          <p className="text-meso-mist/70">Next.js · Three.js · Fósiles</p>
        </div>
      </div>
    </footer>
  );
}
