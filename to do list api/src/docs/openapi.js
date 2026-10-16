import { z } from "zod";
import { toSchema } from "./helpers.js";
import { healthDocs } from "../modules/health/health.docs.js";
import { authDocs } from "../modules/auth/auth.docs.js";
import { tasksDocs } from "../modules/task/tasks.docs.js";

// Junta la documentación de todos los módulos en un solo documento OpenAPI 3.1.
// Para documentar un módulo nuevo: crear su *.docs.js y agregarlo a esta lista.
const modules = [healthDocs, authDocs, tasksDocs];

// Schema común de error: es exactamente lo que responde el errorHandler
const errorSchema = z
  .object({
    error: z.string().meta({ example: "Validation failed" }),
    details: z
      .array(
        z.object({
          field: z.string().meta({ example: "title" }),
          message: z.string().meta({ example: "Title is required" }),
        }),
      )
      .optional()
      .meta({ description: "Solo en errores de validación (400)" }),
  })
  .meta({ description: "Formato de todos los errores de la API" });

export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "To Do List API",
    version: "1.0.0",
    description:
      "API REST de tareas (Express 5 + Supabase). Validación y documentación generadas desde los mismos schemas de zod.",
  },
  // Las rutas de los *.docs.js son relativas a /api
  servers: [{ url: "/api" }],
  tags: modules.flatMap((m) => m.tags ?? []),
  paths: Object.assign({}, ...modules.map((m) => m.paths ?? {})),
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: Object.assign(
      { Error: toSchema(errorSchema, "output") },
      ...modules.map((m) => m.schemas ?? {}),
    ),
  },
};
