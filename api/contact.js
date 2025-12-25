module.exports = async (req, res) => {
    try {
      // CORS (optional but helpful)
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  
      if (req.method === "OPTIONS") return res.status(200).end();
  
      if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "Use POST" });
      }
  
      // Vercel usually parses JSON automatically when Content-Type is application/json
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  
      const { name, email, message } = body || {};
      if (!name || !email || !message) {
        return res.status(400).json({ ok: false, error: "Missing fields" });
      }
  
      // TEMP: just return success to prove function works
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        error: err?.message || "Server error",
      });
    }
  };