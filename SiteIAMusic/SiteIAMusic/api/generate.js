// /api/generate.js
import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

// Caminhos para servir arquivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Servir a pasta public com HTML, CSS e JS
app.use(express.static(path.join(__dirname, "../public")));

// Rota que o frontend vai chamar para gerar música
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt não pode estar vazio." });
    }

    // Chamada para a API do Suno AI
    const response = await fetch("https://api.suno.ai/v1/music/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SUNO_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        model: "V4",   // modelo recomendado, você pode trocar para V3_5 ou V4_5
        format: "mp3", // ou "wav"
        duration: 60   // duração da música em segundos
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro Suno API:", data);
      return res.status(response.status).json({ error: data });
    }

    // Retornar para o frontend
    res.json(data);

  } catch (error) {
    console.error("Erro interno:", error);
    res.status(500).json({ error: "Erro ao gerar música" });
  }
});

// Porta para rodar localmente ou em Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
