import express from "express"; // aqui o problema é: ECMAScript imports and exports cannot be written in a CommonJS file under 'verbatimModuleSyntax'. Adjust the 'type' field in the nearest 'package.json' to make this file an ECMAScript module, or adjust your 'verbatimModuleSyntax', 'module', and 'moduleResolution' settings in TypeScript.ts(1295)
import cors from "cors"; // aqui o problema é: Não foi possível localizar o arquivo de declaração para o módulo 'cors'. 'c:/WorkSpace ME/Trends-ia/backend/node_modules/cors/lib/index.js' tem implicitamente um tipo 'any'.
import dotenv from "dotenv";// aqui o problema é ECMAScript imports and exports cannot be written in a CommonJS file under 'verbatimModuleSyntax'. Adjust the 'type' field in the nearest 'package.json' to make this file an ECMAScript module, or adjust your 'verbatimModuleSyntax', 'module', and 'moduleResolution' settings in TypeScript.

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Backend Trends IA funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
