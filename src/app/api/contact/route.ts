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

/** Evita inyección HTML al interpolar datos del visitante en el correo. */
const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    };
    return entities[char] ?? char;
  });

/** Confirmación para la persona que escribió: misma paleta y tono del sitio. */
function confirmationHtml(name: string, message: string) {
  const safeName = escapeHtml(name);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:32px 16px;background:#F6F3FB;font-family:Poppins,Arial,sans-serif;color:#1F1433;">
    <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E4DCF1;border-radius:24px;overflow:hidden;box-shadow:0 12px 30px rgba(58,35,112,.10);">
      <div style="padding:28px 28px 22px;background:linear-gradient(135deg,#3A2370 0%,#6A4DAB 100%);color:#FFFFFF;">
        <p style="margin:0;font:600 11px/1.4 'Fira Code',monospace;letter-spacing:.18em;text-transform:uppercase;color:#C4A35A;">🦴 Portafolio · Señal recibida</p>
        <p style="margin:14px 0 0;font-size:26px;font-weight:700;line-height:1.25;">¡Hola, ${safeName}! 🦖</p>
      </div>
      <div style="padding:28px;">
        <p style="margin:0 0 18px;font-size:15px;line-height:1.7;color:#3A2370;">
          Gracias por escribirme desde mi portafolio. Ya tengo tu mensaje y te responderé pronto.
        </p>
        <div style="border-left:4px solid #C4A35A;background:#F6F3FB;border-radius:12px;padding:16px 18px;">
          <p style="margin:0 0 8px;font:600 10px/1.4 'Fira Code',monospace;letter-spacing:.14em;text-transform:uppercase;color:#6A4DAB;">Tu mensaje</p>
          <p style="margin:0;font-size:14px;line-height:1.7;color:#1F1433;">${safeMessage}</p>
        </div>
        <p style="margin:22px 0 0;font-size:13px;line-height:1.7;color:#6A4DAB;">
          Mientras tanto, puedes explorar los proyectos y la formación en el portafolio. 🦴
        </p>
        <div style="margin-top:24px;padding-top:18px;border-top:1px solid #E4DCF1;font-size:12px;line-height:1.8;color:#6A4DAB;">
          Alexandra Fiallo Carrillo · ADSO · Full Stack · Videojuegos<br />
          <a href="https://github.com/AlexaFiallo07" style="color:#3A2370;text-decoration:none;">GitHub 🦖</a>
          &nbsp;·&nbsp;
          <a href="mailto:alexafialloc@gmail.com" style="color:#3A2370;text-decoration:none;">Correo 🦴</a>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

/** Aviso interno para Alexandra con los datos del contacto y reply-to listo. */
function ownerHtml(name: string, email: string, message: string) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');

  return `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:32px 16px;background:#F6F3FB;font-family:Poppins,Arial,sans-serif;color:#1F1433;">
    <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E4DCF1;border-radius:24px;padding:28px;box-shadow:0 12px 30px rgba(58,35,112,.10);">
      <p style="margin:0;font:600 11px/1.4 'Fira Code',monospace;letter-spacing:.18em;text-transform:uppercase;color:#6A4DAB;">🦖 Nueva señal desde el portafolio</p>
      <p style="margin:12px 0 20px;font-size:22px;font-weight:700;color:#3A2370;">${safeName} te escribió</p>
      <p style="margin:0 0 10px;font-size:14px;line-height:1.7;color:#1F1433;"><strong>Correo:</strong> <a href="mailto:${safeEmail}" style="color:#3A2370;">${safeEmail}</a></p>
      <div style="margin-top:18px;border-left:4px solid #C4A35A;background:#F6F3FB;border-radius:12px;padding:16px 18px;">
        <p style="margin:0;font-size:14px;line-height:1.7;color:#1F1433;">${safeMessage}</p>
      </div>
      <p style="margin:20px 0 0;font-size:12px;line-height:1.7;color:#6A4DAB;">Responde directamente: el reply-to apunta a quien escribió. 🦴</p>
    </div>
  </body>
</html>`;
}

/**
 * Endpoint de envío del formulario de contacto.
 *
 * - Valida los campos en el servidor y aplica honeypot antispam.
 * - Envía por Gmail SMTP con App Password (GMAIL_USER + GMAIL_APP_PASSWORD).
 * - Manda dos correos: confirmación bonita al visitante y aviso a Alexandra
 *   (CONTACT_TO_EMAIL), con reply-to hacia el remitente.
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

  const from = process.env.CONTACT_FROM_EMAIL ?? `Portafolio <${user}>`;

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });

    await Promise.all([
      // 1) Confirmación para quien contactó.
      transporter.sendMail({
        from,
        to: email,
        replyTo: to,
        subject: '¡Recibí tu señal! 🦖 — Alexandra Fiallo',
        text: `¡Hola, ${name}!\n\nGracias por escribirme desde mi portafolio. Ya tengo tu mensaje y te responderé pronto.\n\nTu mensaje:\n${message}\n\nAlexandra Fiallo Carrillo · ADSO · Full Stack · Videojuegos`,
        html: confirmationHtml(name, message),
      }),
      // 2) Aviso para Alexandra, con reply-to al remitente.
      transporter.sendMail({
        from,
        to,
        replyTo: email,
        subject: `Nueva señal de ${name} — Portafolio`,
        text: `Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`,
        html: ownerHtml(name, email, message),
      }),
    ]);
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
