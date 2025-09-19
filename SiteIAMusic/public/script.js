document.getElementById("generateBtn").addEventListener("click", async () => {
  const desc = document.getElementById("desc").value;
  const resultDiv = document.getElementById("result");

  if (!desc.trim()) {
    resultDiv.innerHTML = "⚠️ Escreva uma descrição primeiro!";
    return;
  }

  resultDiv.innerHTML = "⏳ Gerando música...";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: desc })
    });

    if (!response.ok) throw new Error("Erro ao chamar a API");

    const data = await response.json();
    console.log("Resposta da API Suno:", data);

    if (data.audio_url) {
      resultDiv.innerHTML = `
        ✅ Música gerada!<br>
        <audio controls src="${data.audio_url}"></audio>
      `;
    } else if (data.task_id) {
      resultDiv.innerHTML = `🔄 A música ainda está sendo processada. Tente novamente em alguns segundos. (task_id: ${data.task_id})`;
    } else {
      resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }

  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = "❌ Erro ao gerar música.";
  }
});
