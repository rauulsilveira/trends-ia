import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token não enviado" });

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "trendly_secret");
    (req as any).user = decoded; // injeta info do usuário
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
