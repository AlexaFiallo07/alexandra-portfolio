import type { Metadata, Viewport } from 'next';
import { Poppins, Fira_Code } from 'next/font/google';
import './globals.css';

const sans = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Alexandra Fiallo Carrillo — Full Stack en formación',
    template: '%s · Alexandra Fiallo Carrillo',
  },
  description:
    'Portafolio de Alexandra Fiallo Carrillo, desarrolladora en etapa práctica ADSO: APIs, bases de datos, apps web y móviles, EffiAdmi, videojuegos formativos y formación en el SENA.',
  keywords: [
    'Alexandra Fiallo Carrillo',
    'ADSO',
    'SENA',
    'Full Stack Developer',
    'Django',
    'Django REST Framework',
    'Flutter',
    'Three.js',
    'Videojuegos formativos',
    'Portafolio',
  ],
  authors: [{ name: 'Alexandra Fiallo Carrillo' }],
  creator: 'Alexandra Fiallo Carrillo',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Alexandra Fiallo Carrillo — Full Stack en formación',
    title: 'Alexandra Fiallo Carrillo — Full Stack en formación',
    description:
      'APIs, bases de datos, apps móviles y videojuegos formativos. Explora el stack, los proyectos y la formación de Alexandra.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alexandra Fiallo Carrillo — Full Stack en formación',
    description: 'ADSO, Full Stack, Flutter y videojuegos con proyectos reales.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F6F3FB',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${sans.variable} ${mono.variable}`}>
      <body className="studio-grid font-sans antialiased text-studio-ink selection:bg-studio-purple/15 selection:text-studio-purple-deep">
        {children}
      </body>
    </html>
  );
}
