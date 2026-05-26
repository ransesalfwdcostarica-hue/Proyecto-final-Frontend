import { API_BASE_URL } from "./apiConfig";

export async function sendMessage(messages, contextoUsuario) {
  try {
    const token = localStorage.getItem("token");

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({ messages, contextoUsuario }),
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

