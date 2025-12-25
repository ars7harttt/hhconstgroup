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

  // Parse body
  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return sendJson(res, 400, { ok: false, error: "Invalid JSON" });
  }

  const { name, email, phone, service, message, website } = body;

  // Honeypot spam protection
  if (website) return sendJson(res, 200, { ok: true });

  // Validation
  if (!name || !email || !phone) {
    return sendJson(res, 400, {
      ok: false,
      error: "Name, email, and phone are required."
    });
  }

  // Env validation
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
    const leadResult = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: `New Quote Request: ${name}`,
      text:
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n` +
        `Project Type: ${service || "(not selected)"}\n\n` +
        `Message:\n${message || "(no details provided)"}`
    });

    if (leadResult?.error) {
      console.error("LEAD EMAIL ERROR:", leadResult.error);
      return sendJson(res, 500, {
        ok: false,
        error: leadResult.error.message || "Failed to send lead email"
      });
    }

    const id = leadResult?.data?.id;
    if (!id) {
      console.error("LEAD EMAIL NO ID:", leadResult);
      return sendJson(res, 500, {
        ok: false,
        error: "Lead email sent but no message ID returned"
      });
    }

    try {
      const autoReply = await resend.emails.send({
        from: process.env.MAIL_FROM,
        to: email,
        subject: "We received your request ✅",
        text:
          `Hi ${name},\n\n` +
          `Thank you for contacting HH Construction Group Inc.\n\n` +
          `We’ve received your request and will contact you shortly.\n\n` +
          `Here’s a copy of what you sent:\n\n` +
          `Phone: ${phone}\n` +
          `Project Type: ${service || "(not selected)"}\n` +
          `Message:\n${message || "(no details provided)"}\n\n` +
          `If you need to add more details, just reply to this email.\n\n` +
          `— HH Construction Group Inc.`
      });

      if (autoReply?.error) {
        console.error("AUTO-REPLY ERROR:", autoReply.error);
      }
    } catch (autoErr) {
      console.error("AUTO-REPLY THROW:", autoErr);
    }

    return sendJson(res, 200, { ok: true, id });

  } catch (err) {
    console.error("CONTACT API ERROR:", err);
    return sendJson(res, 500, {
      ok: false,
      error: err?.message || "Email failed to send"
    });
  }
};