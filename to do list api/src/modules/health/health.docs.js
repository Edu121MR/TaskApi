import { z } from "zod";
import { jsonResponse } from "../../docs/helpers.js";

const healthSchema = z.object({
  status: z.string().meta({ example: "ok" }),
});

const dbHealthSchema = z.object({
  status: z.string().meta({ example: "ok" }),
  database: z.string().meta({ example: "connected" }),
});

export const healthDocs = {
  tags: [{ name: "Health", description: "Estado del servidor" }],

  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Estado de la API",
        responses: {
          200: jsonResponse("La API responde", healthSchema),
        },
      },
    },
    "/health/db": {
      get: {
        tags: ["Health"],
        summary: "Estado de la base de datos",
        responses: {
          200: jsonResponse("Conectada a Supabase", dbHealthSchema),
          503: jsonResponse("No se pudo conectar a Supabase", dbHealthSchema),
        },
      },
    },
  },
};
