const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

module.exports = async (req, res) => {
  // Only allow POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { ok: false, error: "Use POST" });
  }

  // Parse body (Vercel sometimes gives object, sometimes string)
  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return sendJson(res, 400, { ok: false, error: "Invalid JSON" });
  }

  const { name, email, phone, service, message, website } = body;

  // Honeypot anti-spam (add <input name="website" style="display:none"> if you want)
  if (website) return sendJson(res, 200, { ok: true });

  // Basic validation
  if (!name || !email || !phone) {
    return sendJson(res, 400, {
      ok: false,
      error: "Name, email, and phone are required."
    });
  }

  // Env validation (helps debugging)
  if (!process.env.RESEND_API_KEY) {
    return sendJson(res, 500, { ok: false, error: "Missing RESEND_API_KEY" });
  }
  if (!process.env.MAIL_FROM) {
    return sendJson(res, 500, { ok: false, error: "Missing MAIL_FROM" });
  }
  if (!process.env.MAIL_TO) {
    return sendJson(res, 500, { ok: false, error: "Missing MAIL_TO" });
  }

  try {
    const result = await resend.emails.send({
      from: process.env.MAIL_FROM, // e.g. "HH Construction <no-reply@hhconstructions.net>" OR "onboarding@resend.dev"
      to: process.env.MAIL_TO,     // your inbox
      replyTo: email,              // customer email
      subject: `New Quote Request: ${name}`,
      text:
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n` +
        `Project Type: ${service || "(not selected)"}\n\n` +
        `Message:\n${message || "(no details provided)"}`
    });

    // Resend returns { data, error }
    if (result?.error) {
      console.error("RESEND ERROR OBJ:", result.error);
      return sendJson(res, 500, {
        ok: false,
        error: result.error.message || "Resend error"
      });
    }

    const id = result?.data?.id;
    if (!id) {
      console.log("RESEND RAW RESULT:", result);
      return sendJson(res, 500, {
        ok: false,
        error: "Resend response missing id (check logs)"
      });
    }

    return sendJson(res, 200, { ok: true, id });
  } catch (err) {
    console.error("RESEND THROW:", err);
    return sendJson(res, 500, {
      ok: false,
      error: err?.message || "Email failed to send"
    });
  }
};