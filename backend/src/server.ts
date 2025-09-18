import dotenv from "dotenv";
import app from "./app.js";

// Carregar variáveis de ambiente
dotenv.config({ path: "../.env" });

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
});
