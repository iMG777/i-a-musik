const generateBtn = document.getElementById("generateBtn");
const descInput = document.getElementById("desc");
const resultDiv = document.getElementById("result");

generateBtn.addEventListener("click", async () => {
  const prompt = descInput.value.trim();
  if (!prompt) {
    resultDiv.innerHTML = "⚠️ Escreva uma descrição primeiro!";
    return;
  }

  resultDiv.innerHTML = "⏳ Gerando música...";

  try {
    // Chama o endpoint do seu servidor
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    console.log("Resposta API:", data);

    if (data.error) {
      resultDiv.innerHTML = `❌ Erro: ${data.error}`;
      return;
    }

    // Se o áudio ainda não estiver pronto, faz polling
    if (data.task_id && !data.audio_url) {
      resultDiv.innerHTML = `⏳ Música em processamento...`;
      const audioData = await pollTask(data.task_id);
      if (audioData.audio_url) {
        showAudio(audioData.audio_url);
      } else {
        resultDiv.innerHTML = `❌ Erro ao gerar música.`;
      }
    } else if (data.audio_url) {
      showAudio(data.audio_url);
    }

  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = "❌ Erro ao gerar música.";
  }
});

async function pollTask(taskId) {
  const maxRetries = 20;
  const interval = 5000; // 5 segundos
  for (let i = 0; i < maxRetries; i++) {
    await new Promise(r => setTimeout(r, interval));
    try {
      const statusResp = await fetch(`/api/status?task_id=${taskId}`);
      const statusData = await statusResp.json();
      console.log("Status polling:", statusData);
      if (statusData.audio_url) return statusData;
    } catch (err) {
      console.error("Erro no polling:", err);
    }
  }
  return null;
}

function showAudio(url) {
  resultDiv.innerHTML = `
    ✅ Música gerada!<br>
    <audio controls src="${url}"></audio>
  `;
}
