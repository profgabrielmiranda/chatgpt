const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

// Habilita CORS para ambas as versões do domínio com e sem www
app.use(cors({
  origin: [
    "https://profgabrielmiranda.com.br",
    "https://www.profgabrielmiranda.com.br"
  ]
}));

app.use(bodyParser.json());

// Inicializa o cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint principal para o chat
app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Mensagem não enviada." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um assistente que responde com fórmulas matemáticas em LaTeX entre delimitadores \\[ \\].",
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Erro na chamada da OpenAI:", error);
    res.status(500).json({ error: "Erro ao gerar resposta com o ChatGPT." });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
