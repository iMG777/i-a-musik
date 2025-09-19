// /api/generate.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt não pode estar vazio." });
    }

    const response = await fetch("https://api.suno.ai/v1/music/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SUNO_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        model: "V4",
        format: "mp3",
        duration: 60
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Erro interno:", error);
    return res.status(500).json({ error: "Erro ao gerar música" });
  }
}
