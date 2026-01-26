const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

function sendJson(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.end(JSON.stringify(obj));
}

module.exports = async (req, res) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.statusCode = 200;
    res.end();
    return;
  }

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

  if (website) return sendJson(res, 200, { ok: true });

  if (!name || !email || !phone) {
    return sendJson(res, 400, { ok: false, error: "Name, email, and phone are required." });
  }

  if (!process.env.RESEND_API_KEY) return sendJson(res, 500, { ok: false, error: "Missing RESEND_API_KEY" });
  if (!process.env.MAIL_FROM) return sendJson(res, 500, { ok: false, error: "Missing MAIL_FROM" });
  if (!process.env.MAIL_TO) return sendJson(res, 500, { ok: false, error: "Missing MAIL_TO" });

  // IMPORTANT: Use a hardcoded trusted sender for auto-reply.
  // Do NOT store "HH Construction Group <...>" in env vars.
  const LEAD_FROM = `HH Construction Group <${process.env.MAIL_FROM}>`;
  const AUTO_FROM = `HH Construction Group <contact@hhconstructions.net>`; // trusted sender

  try {
    // 1) Lead email (to you)
    const lead = await resend.emails.send({
      from: LEAD_FROM,
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

    if (lead?.error) {
      return sendJson(res, 500, {
        ok: false,
        error: lead.error.message || "Lead email failed",
        leadError: lead.error
      });
    }

    const leadId = lead?.data?.id || null;
    if (!leadId) {
      return sendJson(res, 500, { ok: false, error: "Lead email missing id", leadRaw: lead });
    }

    // 2) Auto-reply (to customer) — capture result
    const auto = await resend.emails.send({
      from: AUTO_FROM,
      to: email,
      replyTo: process.env.MAIL_TO,
      subject: "We’ve Received Your Request — HH Construction Group Inc ✅",
      text:
        `Hi ${name},\n\n` +
        `Thank you for contacting HH Construction Group Inc.\n\n` +
        `We’ve successfully received your request and appreciate you taking the time to reach out. ` +
        `A member of our team will review your project details and contact you shortly to discuss next steps.\n\n` +
        `If you have additional information, photos, or questions you’d like to share in the meantime, ` +
        `feel free to reply directly to this email.\n\n` +
        `We look forward to working with you.\n\n` +
        `Best regards,\n` +
        `HH Construction Group Inc.\n`
    });

    // Return auto-reply status to you so we can see why it fails
    if (auto?.error) {
      return sendJson(res, 200, {
        ok: true,
        id: leadId,
        autoReplyOk: false,
        autoReplyError: auto.error.message || "Auto-reply failed",
        autoReplyErrorObj: auto.error
      });
    }

    const autoId = auto?.data?.id || null;

    return sendJson(res, 200, {
      ok: true,
      id: leadId,
      autoReplyOk: true,
      autoReplyId: autoId
    });

  } catch (err) {
    return sendJson(res, 500, { ok: false, error: err?.message || "Server error" });
  }
};