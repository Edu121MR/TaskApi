import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./openapi.js";

export const docsRouter = Router();

// JSON crudo: se puede importar en Postman o usar para generar clientes.
// Va ANTES de Swagger UI para que no lo capture su middleware de archivos.
// Con la URL completa del servidor, así Postman sabe a dónde mandar las requests.
docsRouter.get("/openapi.json", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}/api`;
  res.json({ ...openApiDocument, servers: [{ url: baseUrl }] });
});

// GET /api/docs -> página interactiva de Swagger UI
docsRouter.use("/", swaggerUi.serve);
docsRouter.get(
  "/",
  swaggerUi.setup(openApiDocument, {
    customSiteTitle: "To Do List API - Docs",
    // El token pegado en "Authorize" sobrevive aunque se refresque la página
    swaggerOptions: { persistAuthorization: true },
  }),
);
