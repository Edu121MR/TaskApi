import { HttpError } from "../utils/http-error.js";

// Rutas que no existen -> 404 con el mismo formato que el resto de errores
export function notFoundHandler(req, res) {
  res
    .status(404)
    .json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}

// Error handler global (lleva 4 parámetros, así Express sabe que es de errores).
// En Express 5, si una función async lanza un error o una promesa se rechaza,
// Express lo manda aquí automáticamente. En Express 4 había que usar try/catch
// o express-async-handler en cada ruta.
export function errorHandler(err, req, res, next) {
  // JSON mal formado en el body (lo lanza express.json())
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Malformed JSON body" });
  }

  if (err instanceof HttpError) {
    const body = { error: err.message };
    if (err.details) body.details = err.details;
    return res.status(err.status).json(body);
  }

  // Cualquier otro error (p. ej. Supabase) -> 500 sin filtrar detalles internos
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
}
