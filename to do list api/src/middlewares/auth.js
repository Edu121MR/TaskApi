import { verifyToken } from "../lib/jwt.js";
import { UnauthorizedError } from "../utils/http-error.js";

// Verifica el header Authorization: Bearer <token> antes de llegar al controller.
// Si es válido deja el usuario en req.user; si no, responde 401.
export function requireAuth(req, res, next) {
  const [scheme, token] = (req.get("authorization") ?? "").split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new UnauthorizedError("Falta el header Authorization: Bearer <token>");
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, email: payload.email };
  } catch {
    throw new UnauthorizedError("Token inválido o expirado");
  }
  next();
}
