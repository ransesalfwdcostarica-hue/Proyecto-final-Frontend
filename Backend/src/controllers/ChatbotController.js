const axios = require('axios');
const config = require('../config/config');

const buildUserContext = require('../MCP/contextBuilder');

const ChatbotController = {

    chat: async (req, res) => {

        try {

            // Extraer userId del token JWT (authMiddleware lo agrega a req.usuario)
            // Fallback a 1 mientras el chatbot esté en desarrollo
            const userId = req.usuario?.id_usuario || 1;

            // Construcción del contexto MCP
            const userContext =
                await buildUserContext(userId);

            console.log(
                "CONTEXTO DEL USUARIO:",
                JSON.stringify(userContext, null, 2)
            );

            const { messages } = req.body;

            const apiKey =
                process.env.GROQ_API_KEY ||
                config.groqApiKey;

            if (!apiKey) {

                return res.status(500).json({
                    error: "Configuración incompleta",
                    details:
                        "La clave GROQ_API_KEY no está configurada."
                });

            }

            // Contexto serializado para la IA
            const serializedContext =
                JSON.stringify(userContext, null, 2);

            const systemPrompt = `
Eres VitalBot, un preparador físico profesional y coach de salud de alto rendimiento.

## REGLAS PRINCIPALES

1. SOLO puedes responder temas relacionados con:
- fitness
- salud
- nutrición
- rutinas
- progreso físico
- recomposición corporal
- entrenamiento
- bienestar
- datos del usuario

2. Si el usuario pregunta algo fuera de fitness o salud responde EXACTAMENTE:
"Lo siento, solo puedo ayudarte con temas de fitness y salud. ¿Tienes alguna pregunta sobre entrenamiento o nutrición?"

3. Usa SIEMPRE el contexto del usuario proporcionado por la base de datos.

4. Personaliza las respuestas usando:
- peso
- altura
- objetivo
- rutinas
- alergias
- progreso
- feedbacks
- lugar de entrenamiento

5. Si falta información importante para responder correctamente:
Pide la información faltante antes de recomendar algo.

6. Mantén un tono:
- profesional
- motivador
- claro
- experto

7. NO inventes datos que no estén en el contexto.

8. Si el usuario responde algo corto como:
- "básico"
- "intermedio"
- "sí"
- "no"
- "70kg"

interpreta la respuesta dentro del contexto conversacional.

## FORMATO DE RESPUESTA

- Usa Markdown limpio
- Usa encabezados ##
- Usa listas con -
- Usa negritas para conceptos importantes
- NO uses asteriscos decorativos
- Máximo 300 palabras salvo que pidan detalle
`;

            const apiMessages = [

                {
                    role: "system",
                    content: `
${systemPrompt}

## CONTEXTO REAL DEL USUARIO
${serializedContext}
`
                },

                ...(messages || []).map(m => ({
                    role:
                        m.role === 'bot'
                            ? 'assistant'
                            : 'user',

                    content: m.content
                }))

            ];

            const response = await axios.post(

                "https://api.groq.com/openai/v1/chat/completions",

                {
                    model: "llama-3.3-70b-versatile",

                    messages: apiMessages,

                    temperature: 0.5,

                    max_tokens: 800
                },

                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    }
                }

            );

            const responseText =
                response.data.choices[0]
                    .message.content;

            return res.json({
                reply: responseText
            });

        } catch (error) {

            console.error(
                "Error en ChatbotController:",
                error.response?.data || error.message
            );

            return res.status(500).json({
                error: "Error en la API de Groq",
                details:
                    error.response?.data ||
                    error.message
            });

        }

    }

};

module.exports = ChatbotController;