import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** Honeypot antispam: debe venir vacío. */
  company?: unknown;
}

const badRequest = (error: string) =>
  NextResponse.json({ ok: false, error }, { status: 400 });

/**
 * Endpoint de envío del formulario de contacto.
 *
 * - Valida los campos en el servidor.
 * - Si existen `RESEND_API_KEY` y `CONTACT_TO_EMAIL`, envía el correo con Resend.
 * - En caso contrario, registra la señal en consola y responde éxito
 *   (útil durante el desarrollo sin credenciales).
 */
export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return badRequest('Cuerpo de solicitud inválido.');
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';
  const honeypot = typeof payload.company === 'string' ? payload.company : '';

  // Honeypot: un bot rellena este campo. Respondemos éxito sin procesar.
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  if (name.length < 2 || name.length > 80) {
    return badRequest('El nombre debe tener entre 2 y 80 caracteres.');
  }
  if (!EMAIL_RE.test(email) || email.length > 120) {
    return badRequest('Introduce un correo electrónico válido.');
  }
  if (message.length < 10 || message.length > 2000) {
    return badRequest('El mensaje debe tener entre 10 y 2000 caracteres.');
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (apiKey && to) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>',
          to: [to],
          reply_to: email,
          subject: `Nueva señal de ${name} — Portafolio`,
          text: `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`,
        }),
      });

      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        console.error('[contacto] Error de Resend:', res.status, detail);
        return NextResponse.json(
          { ok: false, error: 'No se pudo enviar la señal. Inténtalo más tarde.' },
          { status: 502 },
        );
      }
    } catch (err) {
      console.error('[contacto] Excepción al enviar:', err);
      return NextResponse.json(
        { ok: false, error: 'No se pudo enviar la señal. Inténtalo más tarde.' },
        { status: 502 },
      );
    }
  } else {
    console.log(
      `[contacto] Señal recibida (sin RESEND_API_KEY/CONTACT_TO_EMAIL)\n  De: ${name} <${email}>\n  Mensaje: ${message.slice(0, 160)}…`,
    );
  }

  return NextResponse.json({
    ok: true,
    message: 'Señal recibida. Te responderé pronto.',
  });
}
