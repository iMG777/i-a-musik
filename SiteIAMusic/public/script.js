const resultDiv = document.getElementById("result");
const generateBtn = document.getElementById("generateBtn");
const desc = document.getElementById("desc");

generateBtn.addEventListener("click", async () => {
  if (!desc.value.trim()) {
    resultDiv.innerHTML = "⚠️ Escreva uma descrição primeiro!";
    return;
  }

  resultDiv.innerHTML = "⏳ Gerando música...";

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: desc.value })
    });

    const data = await response.json();
    console.log("Resposta API:", data);

    if (data.audio_url) {
      resultDiv.innerHTML = `<audio controls src="${data.audio_url}"></audio>`;
    } else if (data.task_id) {
      resultDiv.innerHTML = `🔄 Música em processamento. Aguardando...`;
      pollAudio(data.task_id);
    } else {
      resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    }

  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = "❌ Erro ao gerar música.";
  }
});

// Função de polling
async function pollAudio(taskId) {
  try {
    const res = await fetch(`/api/status?task_id=${taskId}`);
    const data = await res.json();

    if (data.audio_url) {
      resultDiv.innerHTML = `<audio controls src="${data.audio_url}"></audio>`;
    } else {
      setTimeout(() => pollAudio(taskId), 2000); // tenta novamente a cada 2s
    }
  } catch (err) {
    console.error(err);
  }
}
