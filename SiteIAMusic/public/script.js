document.getElementById("generateBtn").addEventListener("click", async () => {
  const desc = document.getElementById("desc").value;
  const resultDiv = document.getElementById("result");

  if (!desc.trim()) {
    resultDiv.innerHTML = "⚠️ Escreva uma descrição primeiro!";
    return;
  }

  resultDiv.innerHTML = "⏳ Gerando música...";

  try {
    // Sempre usa caminho relativo → funciona no localhost e no Render
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: desc })
    });

    if (!response.ok) {
      throw new Error("Erro ao chamar a API");
    }

    const data = await response.json();
    console.log("Resposta da API Suno:", data);

    // Exibe player se vier a URL do áudio
    if (data.audio_url) {
      resultDiv.innerHTML = `
        ✅ Música gerada!<br>
        <audio controls src="${data.audio_url}"></audio>
      `;
    } else {
      // Mostra JSON de fallback (ex: task_id ou erro)
      resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }

  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = "❌ Erro ao gerar música.";
  }
});
