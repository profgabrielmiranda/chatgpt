const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OpenAI } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Sua chave no Render
});

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um assistente que responde com fórmulas matemáticas usando LaTeX entre delimitadores \\[ \\]",
        },
        { role: "user", content: userMessage },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Erro na chamada da API:", error);
    res.status(500).json({ error: "Erro ao buscar resposta do ChatGPT." });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
