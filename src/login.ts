// src/routes/login.ts
import express from "express";
import {  authenticateFacebookUser } from "./mockFacebookAuth.js";   

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { token } = req.body;

    // usando mock por enquanto
    const user = await  authenticateFacebookUser(token);

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Erro ao autenticar usuário" });
  }
});

export default router;
