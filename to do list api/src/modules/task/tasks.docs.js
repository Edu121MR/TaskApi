import {
  toSchema,
  ref,
  jsonBody,
  jsonResponse,
  errorResponse,
  idParam,
  secure,
} from "../../docs/helpers.js";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  taskSchema,
} from "./tasks.schema.js";

// Documentación de las rutas de task.routes.js.
// Los schemas salen de tasks.schema.js: si cambia la validación,
// la documentación cambia sola.

const taskIdParam = idParam(taskIdParamSchema.shape.id, "Id de la tarea");

export const tasksDocs = {
  tags: [{ name: "Tasks", description: "CRUD de tareas" }],

  // Se registran en components.schemas y aparecen en la sección "Schemas"
  schemas: {
    Task: toSchema(taskSchema, "output"),
    CreateTask: toSchema(createTaskSchema),
    UpdateTask: toSchema(updateTaskSchema),
  },

  paths: secure({
    "/tasks": {
      get: {
        tags: ["Tasks"],
        summary: "Listar tareas",
        description: "Devuelve todas las tareas, de la más reciente a la más antigua.",
        responses: {
          200: jsonResponse("Lista", { type: "array", items: ref("Task") }),
        },
      },
      post: {
        tags: ["Tasks"],
        summary: "Crear tarea",
        requestBody: jsonBody(ref("CreateTask")),
        responses: {
          201: jsonResponse("Creada", ref("Task")),
          400: errorResponse("Datos inválidos"),
        },
      },
    },

    "/tasks/{id}": {
      parameters: [taskIdParam],
      get: {
        tags: ["Tasks"],
        summary: "Obtener tarea",
        responses: {
          200: jsonResponse("Tarea", ref("Task")),
          400: errorResponse("Datos inválidos"),
          404: errorResponse("Tarea no encontrada"),
        },
      },
      patch: {
        tags: ["Tasks"],
        summary: "Actualizar tarea",
        requestBody: jsonBody(ref("UpdateTask")),
        responses: {
          200: jsonResponse("Actualizada", ref("Task")),
          400: errorResponse("Datos inválidos"),
          404: errorResponse("Tarea no encontrada"),
        },
      },
      delete: {
        tags: ["Tasks"],
        summary: "Eliminar tarea",
        responses: {
          204: jsonResponse("Eliminada"),
          400: errorResponse("Datos inválidos"),
          404: errorResponse("Tarea no encontrada"),
        },
      },
    },
  }),
};
