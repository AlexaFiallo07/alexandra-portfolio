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
    default: 'Alexandra Fiallo — El Multiverso Jurásico del Código',
    template: '%s · Alexandra Fiallo',
  },
  description:
    'Portafolio de Alexandra Fiallo: Desarrolladora de Software Full-Stack / Backend & Mobile. Una experiencia inmersiva donde dinosaurios de estilos artísticos coexisten con código de verdad.',
  keywords: [
    'Alexandra Fiallo',
    'Full Stack Developer',
    'Backend Developer',
    'Mobile Developer',
    'Django',
    'Node.js',
    'React',
    'Portafolio',
    'Multiverso Jurásico',
  ],
  authors: [{ name: 'Alexandra Fiallo' }],
  creator: 'Alexandra Fiallo',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Alexandra Fiallo — Multiverso Jurásico del Código',
    title: 'Alexandra Fiallo — El Multiverso Jurásico del Código',
    description:
      'Software útil, eficiente y con personalidad. Explora mi stack entre dinosaurios de todo tipo de estilo.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alexandra Fiallo — El Multiverso Jurásico del Código',
    description: 'Full-Stack / Backend & Mobile. Dinosaurios + código.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F4F4F7',
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
