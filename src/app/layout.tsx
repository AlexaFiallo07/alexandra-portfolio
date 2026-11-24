import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Alexandra Fiallo — Full Stack & 3D Web Developer',
    template: '%s · Alexandra Fiallo',
  },
  description:
    'Portafolio de Alexandra Fiallo: Full Stack & 3D Web Developer y creadora de videojuegos (Indie & AAA). Software útil, experiencias interactivas y mundos en 3D con temática de la Era Mesozoica.',
  keywords: [
    'Alexandra Fiallo',
    'Full Stack Developer',
    '3D Web Developer',
    'React Three Fiber',
    'Next.js',
    'Videojuegos',
    'Game Developer',
    'Portafolio',
  ],
  authors: [{ name: 'Alexandra Fiallo' }],
  creator: 'Alexandra Fiallo',
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Alexandra Fiallo — Portafolio',
    title: 'Alexandra Fiallo — Full Stack & 3D Web Developer',
    description:
      'Software útil, experiencias interactivas y videojuegos impactantes. Explora mi stack organizado en tres eras geológicas.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alexandra Fiallo — Full Stack & 3D Web Developer',
    description:
      'Software útil, experiencias interactivas y videojuegos impactantes. Era Mesozoica edition.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FAFAF7',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="grain font-sans antialiased selection:bg-meso-amber/30">
        {children}
      </body>
    </html>
  );
}
