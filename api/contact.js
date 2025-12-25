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

  // honeypot (optional)
  if (website) return sendJson(res, 200, { ok: true });

  if (!name || !email || !phone) {
    return sendJson(res, 400, { ok: false, error: "Name, email, and phone are required." });
  }

  try {
    const result = await resend.emails.send({
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

    console.log("RESEND SEND RESULT:", result);

    const id = (result && result.data && result.data.id) || result.id || null;
    if (!id) return sendJson(res, 500, { ok: false, error: "Resend returned no message id" });

    return sendJson(res, 200, { ok: true, id });
  } catch (err) {
    console.error("RESEND SEND ERROR:", err);
    return sendJson(res, 500, { ok: false, error: err.message || "Resend failed" });
  }
};