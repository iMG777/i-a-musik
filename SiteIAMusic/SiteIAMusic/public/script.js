document.getElementById("generateBtn").addEventListener("click", async () => {
  const desc = document.getElementById("desc").value;
  const resultDiv = document.getElementById("result");

  if (!desc.trim()) {
    resultDiv.innerHTML = "⚠️ Escreva uma descrição primeiro!";
    return;
  }

  resultDiv.innerHTML = "⏳ Gerando música...";

  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: desc })
    });

    if (!response.ok) throw new Error("Erro ao chamar a API");

    const data = await response.json();
    console.log("Resposta da Suno AI:", data);

    // Supondo que a API retorne um link de áudio em data.audio_url
    if (data.audio_url) {
      resultDiv.innerHTML = `
        ✅ Música gerada!<br>
        <audio controls src="${data.audio_url}"></audio>
      `;
    } else {
      resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }

  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = "❌ Erro ao gerar música.";
  }
});
