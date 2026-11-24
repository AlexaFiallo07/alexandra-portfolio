'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import AmberCard from '@/components/ui/AmberCard';
import { CONTACT } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

type Status = 'idle' | 'sending' | 'success' | 'error';

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

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth={1.6}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" strokeLinecap="round" />
    </svg>
  );
}

const inputCls =
  'w-full rounded-lg border border-meso-rock bg-white px-4 py-3 text-sm text-meso-limestone placeholder:text-meso-mist/50 outline-none transition-colors focus:border-meso-amber/70 focus:ring-2 focus:ring-meso-amber/20';

/**
 * Sección de contacto: formulario mesozoico con validación client/server
 * y canales directos (GitHub + correo con copiado al portapapeles).
 */
export default function ContactSection() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
      company: String(data.get('company') ?? ''), // honeypot
    };

    if (payload.name.trim().length < 2) {
      setStatus('error');
      setError('Escribe tu nombre para iniciar la señal.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email.trim())) {
      setStatus('error');
      setError('Introduce un correo electrónico válido.');
      return;
    }
    if (payload.message.trim().length < 10) {
      setStatus('error');
      setError('El mensaje debe tener al menos 10 caracteres.');
      return;
    }

    setStatus('sending');
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? 'No se pudo enviar la señal.');
      }
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Algo salió mal. Inténtalo de nuevo.');
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${CONTACT.email}`;
    }
  };

  return (
    <section id="contacto" className="relative py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(102,87,226,0.12),transparent_65%)] blur-2xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center gap-4"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-meso-amber">
            04 — Contacto
          </span>
          <span aria-hidden className="h-px flex-1 bg-meso-rock" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
          className="mt-6 max-w-2xl"
        >
          <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-[2.75rem]">
            Abramos una <span className="text-amber-gradient">excavación</span> juntos
          </h2>
          <p className="mt-4 text-meso-mist">
            ¿Proyecto web, app 3D o videojuego? Envía una señal y te respondo en
            24–48 horas.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          {/* ---------- Formulario ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <AmberCard className="p-6 sm:p-8">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="flex min-h-[360px] flex-col items-center justify-center text-center"
                >
                  <span
                    aria-hidden
                    className="grid h-16 w-16 place-items-center rounded-full border-2 border-meso-amber bg-meso-amber/10 text-2xl text-meso-amber shadow-amber"
                  >
                    ✓
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-semibold">
                    Señal recibida
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-meso-mist">
                    Tu mensaje queda fosilizado en mi bandeja. Te responderé lo antes
                    posible.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-7 rounded-full border border-meso-rock px-6 py-2.5 text-sm text-meso-limestone transition-colors hover:border-meso-amber/60 hover:text-meso-amber"
                  >
                    Enviar otra señal
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-meso-mist"
                      >
                        Nombre
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Tu nombre"
                        maxLength={80}
                        required
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-meso-mist"
                      >
                        Correo
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="tu@correo.com"
                        maxLength={120}
                        required
                        className={inputCls}
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label
                      htmlFor="contact-message"
                      className="mb-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-meso-mist"
                    >
                      Mensaje
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={6}
                      maxLength={2000}
                      placeholder="Cuéntame sobre tu proyecto, idea o vacante…"
                      required
                      className={`${inputCls} resize-y`}
                    />
                  </div>

                  {/* Honeypot antispam (invisible) */}
                  <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                    <label htmlFor="contact-company">Empresa</label>
                    <input
                      id="contact-company"
                      name="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {status === 'error' && error && (
                    <p
                      role="alert"
                      className="mt-4 rounded-lg border border-[#D0605A]/60 bg-[#D0605A]/10 px-4 py-3 text-sm text-[#A83F39]"
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg bg-meso-amber px-6 py-3.5 text-sm font-semibold text-meso-night shadow-amber transition-all hover:bg-meso-ember disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'sending' ? (
                      <>
                        <span
                          aria-hidden
                          className="h-4 w-4 animate-spin rounded-full border-2 border-meso-night/30 border-t-meso-night"
                        />
                        Enviando señal…
                      </>
                    ) : (
                      <>
                        Enviar señal
                        <span aria-hidden>→</span>
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-meso-mist/70">
                    Sin spam · Solo roca sedimentada
                  </p>
                </form>
              )}
            </AmberCard>
          </motion.div>

          {/* ---------- Canales directos ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
            className="flex flex-col gap-6"
          >
            {/* GitHub */}
            <a
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <AmberCard className="flex items-center gap-5 p-6">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-meso-rock bg-meso-night text-meso-limestone transition-colors group-hover:border-meso-amber/60 group-hover:text-meso-amber">
                  <GitHubIcon className="h-6 w-6" />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-meso-mist">
                    Repositorios
                  </span>
                  <span className="mt-1 block truncate font-display text-lg font-semibold transition-colors group-hover:text-meso-amber">
                    {CONTACT.githubHandle}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="ml-auto text-meso-mist transition-all group-hover:translate-x-1 group-hover:text-meso-amber"
                >
                  ↗
                </span>
              </AmberCard>
            </a>

            {/* Correo */}
            <AmberCard className="p-6">
              <div className="flex items-center gap-5">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-meso-rock bg-meso-night text-meso-limestone">
                  <MailIcon className="h-6 w-6" />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-meso-mist">
                    Correo directo
                  </span>
                  <span className="mt-1 block truncate font-display text-lg font-semibold">
                    {CONTACT.email}
                  </span>
                </span>
              </div>
              <button
                onClick={copyEmail}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-meso-rock px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-meso-limestone transition-colors hover:border-meso-amber/60 hover:text-meso-amber"
              >
                <CopyIcon className="h-4 w-4" />
                {copied ? 'Copiado ✓' : 'Copiar correo'}
              </button>
            </AmberCard>

            {/* Disponibilidad */}
            <AmberCard className="p-6" glow={false}>
              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#22774F]" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#22774F]">
                    Disponible
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-meso-mist">
                    Abierta a proyectos indie &amp; AAA, freelance de desarrollo web/full
                    stack, experiencias 3D y colaboraciones creativas.
                  </p>
                  <p className="mt-3 font-mono text-[10px] tracking-[0.16em] text-meso-mist/70">
                    Respuesta estimada: 24–48 h
                  </p>
                </div>
              </div>
            </AmberCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
