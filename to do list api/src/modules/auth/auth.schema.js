import { z } from "zod";

// El pipe hace que se pierda el formato email en la documentación,
// por eso se agrega de nuevo con .meta().
export const credentialsSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Email inválido"))
    .meta({ format: "email", example: "ana@test.com" }),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(72, "La contraseña debe tener como máximo 72 caracteres")
    .meta({ example: "supersecreta" }),
});
