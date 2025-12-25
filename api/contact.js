import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { ok: false, error: "Use POST" });
  }

  // Vercel may give body as object or string depending on setup
  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return sendJson(res, 400, { ok: false, error: "Invalid JSON" });
  }

  const { name, email, phone, service, message, website } = body;

  // Optional honeypot anti-spam
  if (website) return sendJson(res, 200, { ok: true });

  if (!name || !email || !phone) {
    return sendJson(res, 4  code api/contact.js00, { ok: false, error: "Name, email, and phone are required." });
  }

  try {
    await resend.emails.send({
      from: process.env.MAIL_FROM, // e.g. "HH Construction <no-reply@hhconstructions.net>"
      to: process.env.MAIL_TO,     // your receiving email
      replyTo: email,
      subject: `New Quote Request: ${name}`,
      text:
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n` +
        `Project Type: ${service || "(not selected)"}\n\n` +
        `Message:\n${message || "(no details provided)"}`
    });

    return sendJson(res, 200, { ok: true });
  } catch (err) {
    console.error(err);
    return sendJson(res, 500, { ok: false, error: "Email failed to send." });
  }
}