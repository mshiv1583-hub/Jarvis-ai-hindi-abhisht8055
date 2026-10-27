
import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));

app.get("/health", (req, res) => {
  res.json({ status: "online" });
});

app.post("/api/chat", async (req, res) => {
  try {
    const message = String(req.body?.message || "").trim();

    if (!message) {
      return res.status(400).json({ error: "Sawaal likho." });
    }

    const ai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await ai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      instructions:
        "Tum JARVIS ho. Saral Hindi ya Hinglish mein helpful jawab do.",
      input: message
    });

    res.json({ reply: response.output_text });
  } catch (error) {
    console.error("AI error:", error.message);
    res.status(500).json({
      error: "AI connect nahi hua. Server settings check karo."
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log("JARVIS server started");
});
         
