const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Allow", "POST");
    res.end(JSON.stringify({ ok: false, error: "Method not allowed. Use POST." }));
    return;
  }

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch (e) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: false, error: "Invalid JSON" }));
    return;
  }

  const { name, email, phone, service, message, website } = body;

  if (website) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (!name || !email || !phone) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: false, error: "Name, email, and phone are required." }));
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: false, error: "Server configuration error" }));
    return;
  }
  
  if (!process.env.MAIL_FROM || !process.env.MAIL_TO) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: false, error: "Server configuration error" }));
    return;
  }

  // IMPORTANT: Use a hardcoded trusted sender for auto-reply.
  const LEAD_FROM = `HH Construction Group <${process.env.MAIL_FROM}>`;
  const AUTO_FROM = `HH Construction Group <contact@hhconstructions.net>`;

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
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        ok: false,
        error: lead.error.message || "Lead email failed"
      }));
      return;
    }

    const leadId = lead?.data?.id || null;
    if (!leadId) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ok: false, error: "Email service error" }));
      return;
    }

    // 2) Auto-reply (to customer)
    const auto = await resend.emails.send({
      from: AUTO_FROM,
      to: email,
      replyTo: process.env.MAIL_TO,
      subject: "We've Received Your Request — HH Construction Group Inc ✅",
      text:
        `Hi ${name},\n\n` +
        `Thank you for contacting HH Construction Group Inc.\n\n` +
        `We've successfully received your request and appreciate you taking the time to reach out. ` +
        `A member of our team will review your project details and contact you shortly to discuss next steps.\n\n` +
        `If you have additional information, photos, or questions you'd like to share in the meantime, ` +
        `feel free to reply directly to this email.\n\n` +
        `We look forward to working with you.\n\n` +
        `Best regards,\n` +
        `HH Construction Group Inc.\n`
    });

    const autoId = auto?.data?.id || null;
    const autoReplyOk = !auto?.error;

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
      ok: true,
      id: leadId,
      autoReplyOk: autoReplyOk,
      autoReplyId: autoId
    }));

  } catch (err) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: false, error: err?.message || "Server error" }));
  }
};