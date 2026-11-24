import { CONTACT } from '@/lib/utils';

const NAV = [
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'stack', label: 'Stack' },
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

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.4 8.65 22 11 22 14.1V21h-4v-6.1c0-1.45-.03-3.32-2.02-3.32-2.02 0-2.33 1.58-2.33 3.21V21h-4V9Z" />
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

/** Meteorito que cruza el pie de página. */
function Meteorite() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 overflow-hidden">
      <div className="animate-meteor absolute left-[65%] top-2 h-1 w-16 -translate-x-1/2 rotate-[-18deg] rounded-full bg-gradient-to-r from-transparent via-meso-moss to-meso-amber shadow-[0_0_12px_2px_rgba(196,163,90,0.55)]" />
    </div>
  );
}

/** Dinosaurio chibi despidiéndose con la patita. */
function WavingDino() {
  return (
    <svg viewBox="0 0 64 64" className="h-11 w-11" role="img" aria-label="Dinosaurio despidiéndose">
      {/* Cola */}
      <path d="M14 46 Q4 44 6 36 Q12 42 18 40 Z" fill="#6FCF97" />
      {/* Cuerpo */}
      <ellipse cx="32" cy="46" rx="16" ry="12" fill="#6FCF97" />
      <ellipse cx="33" cy="49" rx="10" ry="7" fill="#BFEED4" />
      {/* Patas */}
      <ellipse cx="25" cy="57" rx="6.5" ry="4" fill="#3E9E70" />
      <ellipse cx="41" cy="57" rx="6.5" ry="4" fill="#3E9E70" />
      {/* Placas */}
      {[[23, 34], [32, 31], [41, 34]].map(([cx, cy]) => (
        <path key={`${cx}`} d={`M${cx - 5} ${cy + 5} Q${cx} ${cy - 7} ${cx + 5} ${cy + 5} Z`} fill="#C4A35A" />
      ))}
      {/* Patita que saluda */}
      <g
        className="animate-wave"
        style={{ transformBox: 'fill-box', transformOrigin: 'center top' }}
      >
        <ellipse cx="48" cy="42" rx="4" ry="8" fill="#3E9E70" />
      </g>
      {/* Cabeza */}
      <circle cx="33" cy="25" r="15" fill="#6FCF97" />
      <ellipse cx="41" cy="29" rx="7" ry="5" fill="#BFEED4" />
      {/* Ojos cerrados de despedida (ríe) */}
      <path d="M27 23 q3 -3 6 0" stroke="#16324A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M37 23 q3 -3 6 0" stroke="#16324A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* Sonrisa */}
      <path d="M33 30 q4 4 8 0" stroke="#16324A" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Rubor */}
      <ellipse cx="27" cy="29" rx="3" ry="2" fill="#F2A6C8" opacity="0.85" />
    </svg>
  );
}

/** Pie de página con meteorito, dino de despedida y canales de contacto. */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-meso-rock/80 bg-meso-night">
      <Meteorite />

      {/* Estratos decorativos */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-meso-amber/50 to-transparent" />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Marca + dino de despedida */}
        <div>
          <div className="flex items-start gap-4">
            <div>
              <p className="font-display text-2xl font-semibold">
                Alexandra <span className="text-amber-gradient">Fiallo</span>
              </p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-meso-mist">
                Desarrolladora de Software Full-Stack / Backend &amp; Mobile. Creo software
                útil que capacite a las personas y experiencias que se sientan vivas.
              </p>
            </div>
            <WavingDino />
          </div>
          <div className="mt-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-meso-mist/60">
            <span className="text-[#A98FD6]">Backend</span>
            <span aria-hidden className="h-px w-8 bg-meso-rock" />
            <span className="text-[#6FCF97]">Frontend</span>
            <span aria-hidden className="h-px w-8 bg-meso-rock" />
            <span className="text-meso-moss/80">Mobile</span>
          </div>
        </div>

        {/* Navegación */}
        <nav aria-label="Enlaces del pie">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-meso-amber">
            Secciones
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
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 text-sm text-meso-limestone/70 transition-colors hover:text-meso-amber"
              >
                <LinkedInIcon className="h-4 w-4" />
                {CONTACT.linkedinHandle}
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
          <p className="text-meso-mist/70">Next.js · Three.js · Dinosaurios</p>
        </div>
      </div>
    </footer>
  );
}
