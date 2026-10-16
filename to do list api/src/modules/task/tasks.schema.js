import { z } from "zod";

// Estos schemas tienen dos usos:
//   1) validar la entrada (middleware validateSchema)
//   2) generar la documentación OpenAPI con z.toJSONSchema()
// .meta() agrega description/example: no afecta la validación,
// solo aparece en Swagger. Una sola fuente de verdad.

// .trim() limpia espacios antes de validar y guardar ("  hola " -> "hola"),
// así un title de solo espacios también cuenta como vacío.
export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters")
    .meta({ description: "Título de la tarea", example: "Preparar la demo" }),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be at most 1000 characters")
    .optional()
    .meta({
      description: "Detalle opcional",
      example: "Repasar OpenAPI y Swagger UI",
    }),
  done: z
    .boolean()
    .optional()
    .meta({ description: "Si la tarea está completada", example: false }),
});

// PATCH: los mismos campos pero todos opcionales; debe venir al menos uno.
export const updateTaskSchema = createTaskSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field (title, description, done) is required",
  })
  .meta({ description: "Envía solo los campos a cambiar (al menos uno)" });

// Los params de la URL siempre llegan como string:
// z.coerce.number() convierte "5" en el número 5. "abc" -> NaN -> 400.
export const taskIdParamSchema = z.object({
  id: z.coerce
    .number({ error: "Id must be a number" })
    .int("Id must be an integer")
    .positive("Id must be positive")
    .meta({ description: "Id de la tarea", example: 1 }),
});

// Describe lo que devuelve la API (una fila de la tabla tasks).
// No se usa para validar: solo para la documentación de las respuestas.
export const taskSchema = z
  .object({
    id: z.number().int().meta({ example: 1 }),
    title: z.string().meta({ example: "Preparar la demo" }),
    description: z
      .string()
      .nullable()
      .meta({ example: "Repasar OpenAPI y Swagger UI" }),
    done: z.boolean().meta({ example: false }),
    created_at: z
      .string()
      .meta({ format: "date-time", example: "2026-10-10T20:00:00.000Z" }),
  })
  .meta({ description: "Una tarea guardada en la base de datos" });