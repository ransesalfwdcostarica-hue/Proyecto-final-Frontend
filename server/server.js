import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Endpoint chatbot
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "Eres un asistente útil especializado en fitness, salud, y entrenamiento. Solo responde de forma amigable y concisa."
    });

    const result = await model.generateContent(message);
    const responseText = result.response.text();

    res.json({
      reply: responseText,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error en la API de Gemini",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 3023;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
