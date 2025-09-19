import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

// Caminhos absolutos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  // Rota da API
  if (req.method === "POST" && req.url === "/api/generate") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", async () => {
      try {
        const { prompt } = JSON.parse(body);

        if (!prompt || !prompt.trim()) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: "Prompt não pode estar vazio." }));
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

        res.writeHead(response.ok ? 200 : response.status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      } catch (err) {
        console.error("Erro interno:", err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Erro ao gerar música" }));
      }
    });
    return;
  }

  // Servir arquivos estáticos da pasta public
  let filePath = path.join(__dirname, "public", req.url === "/" ? "index.html" : req.url);
  let ext = path.extname(filePath).toLowerCase();

  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif"
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Arquivo não encontrado");
    } else {
      res.writeHead(200, { "Content-Type": mimeTypes[ext] || "text/plain" });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
