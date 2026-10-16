import { z } from "zod";

// Funciones pequeñas para no repetir JSON en cada *.docs.js.
// OJO: este archivo NO importa openapi.js ni ningún *.docs.js.
// openapi.js -> *.docs.js -> helpers.js. Si los helpers vivieran en
// openapi.js habría un import circular y la app fallaría al arrancar.

const JSON_TYPE = "application/json";

// Convierte un schema de zod en JSON Schema (sin la clave $schema,
// que OpenAPI no necesita dentro de components/paths).
// io: "input" describe lo que se ENVÍA (body, params);
// io: "output" describe lo que se RECIBE (respuestas).
export function toSchema(zodSchema, io = "input") {
  const { $schema, ...jsonSchema } = z.toJSONSchema(zodSchema, { io });
  return jsonSchema;
}

// Referencia a un schema declarado en components.schemas
export function ref(name) {
  return { $ref: `#/components/schemas/${name}` };
}

// requestBody en JSON. Acepta un schema de zod o un { $ref }.
export function jsonBody(schema, description) {
  return {
    required: true,
    ...(description && { description }),
    content: { [JSON_TYPE]: { schema: asSchema(schema) } },
  };
}

// Respuesta exitosa en JSON. Sin schema -> respuesta sin cuerpo (ej. 204).
export function jsonResponse(description, schema) {
  if (!schema) return { description };
  return {
    description,
    content: { [JSON_TYPE]: { schema: asSchema(schema) } },
  };
}

// Respuesta de error: siempre usa el schema común "Error" (definido en openapi.js)
export function errorResponse(description) {
  return jsonResponse(description, ref("Error"));
}

// Parámetro :id de la ruta, generado desde el schema de zod que lo valida
export function idParam(zodIdSchema, description = "Identificador del recurso") {
  return {
    name: "id",
    in: "path",
    required: true,
    description,
    schema: toSchema(zodIdSchema),
  };
}

// Marca todas las operaciones como protegidas (candado en Swagger) y les
// agrega la respuesta 401. Es el requireAuth de la documentación.
export function secure(paths) {
  const result = {};
  for (const [path, item] of Object.entries(paths)) {
    result[path] = {};
    for (const [key, value] of Object.entries(item)) {
      result[path][key] =
        key === "parameters"
          ? value
          : {
              ...value,
              security: [{ bearerAuth: [] }],
              responses: {
                ...value.responses,
                401: errorResponse("Token faltante, inválido o expirado"),
              },
            };
    }
  }
  return result;
}

// Si recibe un schema de zod lo convierte; si ya es JSON Schema/$ref lo deja igual
function asSchema(schema) {
  return schema instanceof z.ZodType ? toSchema(schema) : schema;
}
