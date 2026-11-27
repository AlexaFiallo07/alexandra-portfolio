import nodemailer from 'nodemailer';
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
 * - Envía por Gmail SMTP usando un App Password de Google
 *   (GMAIL_USER + GMAIL_APP_PASSWORD) y CONTACT_TO_EMAIL como destino.
 * - Sin credenciales, en desarrollo solo registra la señal; en producción
 *   responde 503 para no simular un envío que no ocurrió.
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

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.CONTACT_TO_EMAIL ?? user;

  if (!user || !pass || !to) {
    console.warn('[contacto] Falta GMAIL_USER, GMAIL_APP_PASSWORD o CONTACT_TO_EMAIL');
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { ok: false, error: 'El formulario aún no está configurado.' },
        { status: 503 },
      );
    }
    console.log(
      `[contacto] Señal recibida (sin envío real)\n  De: ${name} <${email}>\n  Mensaje: ${message.slice(0, 160)}…`,
    );
    return NextResponse.json({
      ok: true,
      message: 'Señal recibida. Te responderé pronto.',
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: process.env.CONTACT_FROM_EMAIL ?? `Portafolio <${user}>`,
      to,
      replyTo: email,
      subject: `Nueva señal de ${name} — Portafolio`,
      text: `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`,
    });
  } catch (err) {
    console.error('[contacto] Error al enviar por Gmail:', err);
    return NextResponse.json(
      { ok: false, error: 'No se pudo enviar la señal. Inténtalo más tarde.' },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: 'Señal recibida. Te responderé pronto.',
  });
}
