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
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" strokeLinecap="round" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" strokeLinecap="round" />
    </svg>
  );
}

const inputCls =
  'w-full rounded-xl border border-studio-border bg-studio-bg px-4 py-3 text-sm text-studio-ink placeholder:text-studio-slate/60 outline-none transition-colors focus:border-studio-purple focus:bg-studio-card focus:ring-2 focus:ring-studio-purple/15';

/**
 * Sección de contacto luminosa con tarjetas blancas y canales directos.
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
      company: String(data.get('company') ?? ''),
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
    <section id="contacto" className="relative py-20 sm:py-28">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: EASE }}
          className="flex items-center gap-4"
        >
          <span className="rounded-full border border-studio-green/35 bg-studio-green/10 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-studio-green-deep">
            05 — Contacto
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
            Construyamos tu próximo{' '}
            <span className="text-studio-gradient">proyecto juntos</span>
          </h2>
          <p className="mt-3 text-base text-studio-slate">
            ¿Sistema administrativo para tu PYME, tienda virtual o API REST? Escríbeme y te respondo
            en 24–48 horas.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          {/* ---------- Formulario ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, ease: EASE }}
          >
            <AmberCard className="p-6 sm:p-8">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="flex min-h-[360px] flex-col items-center justify-center text-center"
                >
                  <span
                    aria-hidden
                    className="grid h-16 w-16 place-items-center rounded-full border-2 border-studio-green bg-studio-green/15 text-2xl font-bold text-studio-green-deep"
                  >
                    ✓
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-bold text-studio-ink">
                    ¡Mensaje recibido!
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-studio-slate">
                    Tu señal llegó limpia al estudio. Te responderé lo antes posible.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-7 rounded-full border border-studio-border bg-studio-bg px-6 py-2.5 text-sm font-semibold text-studio-ink transition-colors hover:border-studio-purple hover:text-studio-purple-deep"
                  >
                    Enviar otro mensaje
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-studio-purple-deep"
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
                        className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-studio-purple-deep"
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
                      className="mb-2 block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-studio-purple-deep"
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

                  {/* Honeypot antispam */}
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
                      className="mt-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-studio-purple-deep bg-studio-purple px-6 py-3.5 text-sm font-semibold text-white shadow-brutal transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-studio-purple-deep disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'sending' ? (
                      <>
                        <span
                          aria-hidden
                          className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                        />
                        Enviando señal…
                      </>
                    ) : (
                      <>
                        Enviar mensaje
                        <span aria-hidden>→</span>
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-studio-slate">
                    Sin spam · Respuesta directa
                  </p>
                </form>
              )}
            </AmberCard>
          </motion.div>

          {/* ---------- Canales directos ---------- */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
            className="flex flex-col gap-5"
          >
            <a
              href={CONTACT.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <AmberCard className="flex items-center gap-4 p-5">
                <span className="grid h-13 w-13 shrink-0 place-items-center rounded-xl border border-studio-border bg-studio-bg p-3 text-studio-ink transition-colors group-hover:border-studio-purple group-hover:text-studio-purple">
                  <GitHubIcon className="h-6 w-6" />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-studio-slate">
                    Repositorios
                  </span>
                  <span className="mt-0.5 block truncate font-display text-lg font-bold text-studio-ink transition-colors group-hover:text-studio-purple-deep">
                    {CONTACT.githubHandle}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="ml-auto text-studio-slate transition-all group-hover:translate-x-1 group-hover:text-studio-purple"
                >
                  ↗
                </span>
              </AmberCard>
            </a>

            <AmberCard className="p-5">
              <div className="flex items-center gap-4">
                <span className="grid h-13 w-13 shrink-0 place-items-center rounded-xl border border-studio-border bg-studio-bg p-3 text-studio-green-deep">
                  <MailIcon className="h-6 w-6" />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-studio-slate">
                    Correo directo
                  </span>
                  <span className="mt-0.5 block truncate font-display text-base font-bold text-studio-ink sm:text-lg">
                    {CONTACT.email}
                  </span>
                </span>
              </div>
              <button
                onClick={copyEmail}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-studio-border bg-studio-bg px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-studio-ink transition-colors hover:border-studio-green hover:text-studio-green-deep"
              >
                <CopyIcon className="h-4 w-4" />
                {copied ? 'Copiado ✓' : 'Copiar correo'}
              </button>
            </AmberCard>

            <AmberCard className="bg-studio-pearl/80 p-5" glow={false}>
              <div className="flex items-start gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-studio-green" />
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-studio-green-deep">
                    Disponible para proyectos
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-studio-slate">
                    Abierta a apoyar desarrollos web Full Stack, backend con Django/Node, apps
                    móviles y prototipos de videojuegos formativos.
                  </p>
                  <p className="mt-2.5 font-mono text-[10px] font-medium tracking-[0.16em] text-studio-purple-deep">
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
