import express from "express";

const app = express();

// Rota de teste simples
app.get("/test", (req, res) => {
  res.json({ 
    message: "API funcionando!",
    users: [
      {
        id: 4,
        facebookId: "24808605398764380",
        name: "Raul Silveira",
        role: "admin",
        status: "ativo",
        createdAt: "2025-09-18T20:03:16.992Z",
        _count: {
          LoginLogs: 3
        }
      }
    ]
  });
});

app.listen(4000, () => {
  console.log("🚀 Servidor de teste rodando em http://localhost:4000");
});
