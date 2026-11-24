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
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" strokeLinecap="round" />
    </svg>
  );
}

/** Meteorito divertido estilo estudio que cruza el pie de página. */
function Meteorite() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-20 overflow-hidden">
      <div className="animate-meteor absolute left-[68%] top-4 flex -translate-x-1/2 items-center">
        <svg width="132" height="24" viewBox="0 0 132 24" fill="none" aria-hidden>
          <defs>
            <linearGradient id="footer-meteor-tail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0" />
              <stop offset="55%" stopColor="#7C3AED" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
            <linearGradient id="footer-meteor-core" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <path d="M2 12 h106" stroke="url(#footer-meteor-tail)" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 8 h62" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
          <circle cx="120" cy="12" r="8" fill="url(#footer-meteor-core)" stroke="#18181B" strokeWidth="2" />
          <circle cx="117" cy="9" r="2" fill="#D1FAE5" opacity="0.9" />
          <circle cx="123" cy="15" r="1" fill="#5B21B6" opacity="0.6" />
          <circle cx="108" cy="6" r="1.4" fill="#7C3AED" />
          <circle cx="101" cy="17" r="1" fill="#10B981" />
        </svg>
      </div>
    </div>
  );
}

/** Dinosaurio chibi verde y morado despidiéndose con la patita. */
function WavingDino() {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12 shrink-0" role="img" aria-label="Dinosaurio despidiéndose">
      <defs>
        <linearGradient id="footer-dino-body" x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="58%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="footer-dino-belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D1FAE5" />
          <stop offset="100%" stopColor="#A7F3D0" />
        </linearGradient>
        <linearGradient id="footer-dino-plate" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <pattern id="footer-dino-scales" width="8" height="7" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#FFFFFF" opacity="0.24" />
        </pattern>
        <filter id="footer-dino-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1.6" stdDeviation="1.6" floodColor="#5B21B6" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Sombra y cola */}
      <ellipse cx="32" cy="61" rx="17" ry="2.4" fill="#5B21B6" opacity="0.12" />
      <path d="M16 46 Q4 45 6 35 Q6 32 9 33 Q13 42 20 40 Z" fill="url(#footer-dino-body)" stroke="#18181B" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M10 36 Q13 41 17 43" stroke="#D1FAE5" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />

      {/* Cuerpo, vientre y patitas */}
      <g filter="url(#footer-dino-shadow)">
        <ellipse cx="32" cy="46" rx="16" ry="12" fill="url(#footer-dino-body)" stroke="#18181B" strokeWidth="2.2" />
      </g>
      <ellipse cx="32" cy="46" rx="15" ry="11" fill="url(#footer-dino-scales)" />
      <path d="M21 40 Q29 36 38 38" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.5" />
      <ellipse cx="33" cy="49" rx="10" ry="7" fill="url(#footer-dino-belly)" stroke="#A7F3D0" strokeWidth="0.8" />
      <path d="M27 49 q6 2 12 0" stroke="#059669" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.35" />
      <ellipse cx="25" cy="57" rx="6.5" ry="4" fill="url(#footer-dino-body)" stroke="#18181B" strokeWidth="1.8" />
      <ellipse cx="41" cy="57" rx="6.5" ry="4" fill="url(#footer-dino-body)" stroke="#18181B" strokeWidth="1.8" />
      {[22, 27, 38, 43].map((x) => (
        <ellipse key={x} cx={x} cy="59" rx="1.7" ry="1" fill="#FFFFFF" stroke="#18181B" strokeWidth="0.7" />
      ))}

      {/* Placas dorsales con brillo */}
      {[[23, 34], [32, 31], [41, 34]].map(([cx, cy]) => (
        <g key={`${cx}`}>
          <path d={`M${cx - 5} ${cy + 5} Q${cx} ${cy - 7} ${cx + 5} ${cy + 5} Z`} fill="url(#footer-dino-plate)" stroke="#18181B" strokeWidth="1.5" strokeLinejoin="round" />
          <path d={`M${cx - 2} ${cy + 1} Q${cx} ${cy - 4} ${cx + 2} ${cy + 1}`} stroke="#FFFFFF" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.55" />
        </g>
      ))}

      {/* Patita que saluda: se conserva la animación */}
      <g className="animate-wave" style={{ transformBox: 'fill-box', transformOrigin: 'center top' }}>
        <ellipse cx="48" cy="42" rx="4" ry="8" fill="url(#footer-dino-body)" stroke="#18181B" strokeWidth="1.8" />
        <path d="M46 38 q2 -2 4 0" stroke="#D1FAE5" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.75" />
        {[45, 48, 51].map((x) => (
          <path key={x} d={`M${x} 36 l0.5 -2.5`} stroke="#FFFFFF" strokeWidth="1.1" strokeLinecap="round" />
        ))}
      </g>

      {/* Cabeza: hocico, cejas, ojos con doble brillo y sonrisa */}
      <g filter="url(#footer-dino-shadow)">
        <circle cx="33" cy="25" r="15" fill="url(#footer-dino-body)" stroke="#18181B" strokeWidth="2.2" />
      </g>
      <path d="M24 17 Q32 12 41 16" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.55" />
      <ellipse cx="41" cy="29" rx="7" ry="5" fill="url(#footer-dino-belly)" stroke="#A7F3D0" strokeWidth="0.9" />
      <ellipse cx="46" cy="27.5" rx="1.6" ry="1.1" fill="#18181B" />
      <path d="M26 18 q3 -2 5 0" stroke="#18181B" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M36 18 q3 -1 5 0.8" stroke="#18181B" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <circle cx="30" cy="23" r="3.2" fill="#18181B" />
      <circle cx="39" cy="23" r="3.2" fill="#18181B" />
      <circle cx="31.1" cy="21.8" r="1.1" fill="#FFFFFF" />
      <circle cx="40.1" cy="21.8" r="1.1" fill="#FFFFFF" />
      <circle cx="28.9" cy="24.4" r="0.55" fill="#FFFFFF" opacity="0.85" />
      <circle cx="37.9" cy="24.4" r="0.55" fill="#FFFFFF" opacity="0.85" />
      <ellipse cx="26" cy="29" rx="3" ry="2" fill="#7C3AED" opacity="0.28" />
      <ellipse cx="44" cy="30" rx="2.6" ry="1.6" fill="#7C3AED" opacity="0.22" />
      <path d="M33 30 q4 4 8 0" stroke="#18181B" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M36 32 q2 1.6 3.5 -0.2" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.75" />
    </svg>
  );
}

/** Pie de página luminoso (#FFFFFF sobre #F4F4F7). */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-studio-border bg-studio-card">
      <Meteorite />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Marca + dino de despedida */}
        <div>
          <div className="flex items-start gap-4">
            <div>
              <p className="font-display text-2xl font-bold text-studio-ink">
                Alexandra <span className="text-studio-gradient">Fiallo</span>
              </p>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-studio-slate">
                Desarrolladora de Software Full-Stack / Backend &amp; Mobile. Creo software
                útil que capacite a las personas y experiencias digitales llenas de vida.
              </p>
            </div>
            <WavingDino />
          </div>
          <div className="mt-5 flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.2em]">
            <span className="text-studio-purple-deep">Backend</span>
            <span aria-hidden className="h-px w-6 bg-studio-border" />
            <span className="text-studio-green-deep">Frontend</span>
            <span aria-hidden className="h-px w-6 bg-studio-border" />
            <span className="text-studio-purple">Mobile</span>
          </div>
        </div>

        {/* Navegación */}
        <nav aria-label="Enlaces del pie">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-studio-purple-deep">
            Secciones
          </p>
          <ul className="mt-4 space-y-2.5">
            {NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-sm font-medium text-studio-slate transition-colors hover:text-studio-purple"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Canales */}
        <div>
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-studio-purple-deep">
            Contacto
          </p>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href={CONTACT.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 text-sm font-medium text-studio-slate transition-colors hover:text-studio-purple"
              >
                <GitHubIcon className="h-4 w-4 text-studio-ink" />
                {CONTACT.githubHandle}
              </a>
            </li>
            <li>
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 text-sm font-medium text-studio-slate transition-colors hover:text-studio-purple"
              >
                <LinkedInIcon className="h-4 w-4 text-studio-purple-deep" />
                {CONTACT.linkedinHandle}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT.email}`}
                className="group inline-flex items-center gap-2.5 text-sm font-medium text-studio-slate transition-colors hover:text-studio-green-deep"
              >
                <MailIcon className="h-4 w-4 text-studio-green-deep" />
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="border-t border-studio-border bg-studio-pearl/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 font-mono text-[11px] uppercase tracking-[0.16em] text-studio-slate sm:flex-row sm:px-8">
          <p>© 2026 Alexandra Fiallo</p>
          <p>Next.js · SVG Interactivo · Dinosaurios</p>
        </div>
      </div>
    </footer>
  );
}
