
const express = require("express");
const OpenAI = require("openai");
const path = require("path");

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "OPENAI_API_KEY missing hai" });
    }

    const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const message = String(req.body.message || "").trim();

    if (!message) {
      return res.status(400).json({ error: "Message khaali hai" });
    }

    const history = Array.isArray(req.body.history)
      ? req.body.history.slice(-8).filter(
          m => ["user", "assistant"].includes(m.role) &&
               typeof m.content === "string"
        )
      : [];

    const result = await ai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tum ek helpful futuristic AI assistant ho. Hamesha natural Hindi ya user ki language mein jawab do. Jawab clear, useful aur safe rakho."
        },
        ...history,
        { role: "user", content: message }
      ]
    });

    res.json({
      reply: result.choices[0].message.content || "Abhi jawab nahi mila."
    });
  } catch (error) {
    console.error("AI request failed:", error.message);
    res.status(500).json({
      error: "AI request fail hui. API key, billing aur server logs check karo."
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`JARVIS server running on port ${port}`);
});
    
         
