const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(obj));
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { ok: false, error: "Use POST" });
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return sendJson(res, 400, { ok: false, error: "Invalid JSON" });
  }

  const { name, email, phone, service, message, website } = body;

  // Honeypot anti-spam
  if (website) return sendJson(res, 200, { ok: true });

  if (!name || !email || !phone) {
    return sendJson(res, 400, {
      ok: false,
      error: "Name, email, and phone are required."
    });
  }

  if (!process.env.RESEND_API_KEY || !process.env.MAIL_FROM || !process.env.MAIL_TO) {
    return sendJson(res, 500, { ok: false, error: "Server email configuration error" });
  }

  // If AUTO_REPLY_FROM is not set, default to onboarding@resend.dev
  const AUTO_REPLY_FROM = process.env.AUTO_REPLY_FROM || "onboarding@resend.dev";

  try {
    /* ===============================
       1) LEAD EMAIL (to you)
       Uses your domain sender
    =============================== */
    const leadEmail = await resend.emails.send({
      from: `HH Construction Group <${process.env.MAIL_FROM}>`,
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

    if (leadEmail?.error) {
      console.error("LEAD EMAIL ERROR:", leadEmail.error);
      return sendJson(res, 500, { ok: false, error: leadEmail.error.message || "Failed to send lead email" });
    }

    const leadId = leadEmail?.data?.id;
    if (!leadId) {
      console.error("LEAD EMAIL NO ID:", leadEmail);
      return sendJson(res, 500, { ok: false, error: "Lead email sent but no ID returned" });
    }

    /* ===============================
       2) AUTO-REPLY (to customer)
       Uses Resend trusted sender
    =============================== */
    try {
      const autoReply = await resend.emails.send({
        from: `HH Construction Group <${AUTO_REPLY_FROM}>`, // ✅ key change
        to: email,
        replyTo: process.env.MAIL_TO, // customer replies go to your inbox
        subject: "We received your request ✅",
        text:
          `Hi ${name},\n\n` +
          `Thank you for contacting HH Construction Group Inc.\n\n` +
          `We’ve received your request and will contact you shortly.\n\n` +
          `Here is a copy of your submission:\n\n` +
          `Phone: ${phone}\n` +
          `Project Type: ${service || "(not selected)"}\n\n` +
          `Message:\n${message || "(no details provided)"}\n\n` +
          `If you have additional details, feel free to reply to this email.\n\n` +
          `— HH Construction Group Inc.\n` +
          `Los Angeles, CA`
      });

      if (autoReply?.error) {
        console.error("AUTO-REPLY ERROR:", autoReply.error);
      }
    } catch (autoErr) {
      console.error("AUTO-REPLY FAILED:", autoErr);
    }

    return sendJson(res, 200, { ok: true, id: leadId });

  } catch (err) {
    console.error("CONTACT API ERROR:", err);
    return sendJson(res, 500, { ok: false, error: err?.message || "Email failed to send" });
  }
};