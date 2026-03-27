export async function sendMessage(message) {
  try {
    const res = await fetch("http://localhost:3023/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    
    if (!res.ok || data.error) {
      console.error("Backend Error:", data.details || data.error);
      return `Error de API: ${data.details || data.error}`;
    }

    return data.reply;
  } catch (error) {
    console.error("Error communicating with Chatbot API:", error);
    return "Lo siento, tuve un problema al conectarme al servidor.";
  }
}
