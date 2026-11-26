import { CONTACT } from '@/lib/utils';

const NAV = [
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'stack', label: 'Stack' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'formacion', label: 'Formación' },
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
              <stop offset="0%" stopColor="#6A4DAB" stopOpacity="0" />
              <stop offset="55%" stopColor="#6A4DAB" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#3E9D7B" />
            </linearGradient>
            <linearGradient id="footer-meteor-core" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3E9D7B" />
              <stop offset="100%" stopColor="#2B775D" />
            </linearGradient>
          </defs>
          <path d="M2 12 h106" stroke="url(#footer-meteor-tail)" strokeWidth="2" strokeLinecap="round" />
          <path d="M18 8 h62" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
          <circle cx="120" cy="12" r="8" fill="url(#footer-meteor-core)" stroke="#1F1433" strokeWidth="2" />
          <circle cx="117" cy="9" r="2" fill="#E2F3EA" opacity="0.9" />
          <circle cx="123" cy="15" r="1" fill="#3A2370" opacity="0.6" />
          <circle cx="108" cy="6" r="1.4" fill="#6A4DAB" />
          <circle cx="101" cy="17" r="1" fill="#3E9D7B" />
        </svg>
      </div>
    </div>
  );
}

/** Pie de página luminoso (#FFFFFF sobre #F6F3FB). */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-studio-border bg-studio-card">
      <Meteorite />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Marca */}
        <div>
          <div>
            <p className="font-display text-2xl font-bold text-studio-ink">
              Alexandra <span className="text-studio-gradient">Fiallo</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-studio-slate">
              Desarrolladora en etapa práctica ADSO. Construyo APIs, bases de datos e interfaces
              útiles, y exploro los videojuegos como forma de entrenar habilidades.
            </p>
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
          <p>ADSO · Full Stack · Videojuegos</p>
        </div>
      </div>
    </footer>
  );
}
