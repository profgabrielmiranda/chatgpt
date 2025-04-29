const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

// Permitir CORS para qualquer origem (ou especifique o domínio do seu site WordPress)
app.use(cors());
// Se quiser restringir:
app.use(cors({ origin: "https://www.profgabrielmiranda.com.br" }));

app.use(bodyParser.json());

// Inicialização do cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Mensagem não enviada." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // ou use "gpt-3.5-turbo" se preferir
      messages: [
        {
          role: "system",
          content: "Você é um assistente que responde com fórmulas matemáticas usando LaTeX entre delimitadores \\[ \\].",
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

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
