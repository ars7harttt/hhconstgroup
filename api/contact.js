module.exports = async (req, res) => {
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
  
    console.log("RESEND SEND RESULT:", JSON.stringify(result));
  
    // IMPORTANT: return the id so we can verify in Resend logs
    const id = result?.data?.id || result?.id || null;
    if (!id) {
      return sendJson(res, 500, { ok: false, error: "Resend returned no message id" });
    }
  
    return sendJson(res, 200, { ok: true, id });
  } catch (err) {
    console.error("RESEND SEND ERROR:", err);
    return sendJson(res, 500, {
      ok: false,
      error: err?.message || "Resend failed"
    });
  }
}