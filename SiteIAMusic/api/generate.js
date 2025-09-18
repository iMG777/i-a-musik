import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // <-- crie o app antes de usar
app.use(express.json());

// servir a pasta public com HTML, CSS e JS
app.use(express.static(path.join(__dirname, "../public")));

// rota que o site vai chamar
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch("https://api.suno.ai/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SUNO_API_KEY}`
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao gerar música" });
  }
});

// Render ou Railway precisa que o servidor rode em uma porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
