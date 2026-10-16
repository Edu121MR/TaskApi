import { Router } from "express";
import { supabase } from "../../lib/supabase.js";
import { validateSchema } from "../../middlewares/validate.js";
import { requireAuth } from "../../middlewares/auth.js";
import { createTaskRepository } from "./task.repository.js";
import { createTaskService } from "./task.service.js";
import { createTaskController } from "./task.controller.js";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
} from "./tasks.schema.js";

const taskRepository = createTaskRepository(supabase);
const taskService = createTaskService(taskRepository);
const taskController = createTaskController(taskService);

export const tasksRouter = Router();

// Todas las rutas de tareas requieren token. Controller, service y
// repository no cambian: la seguridad vive en un middleware.
tasksRouter.use(requireAuth);

const validateId = validateSchema(taskIdParamSchema, "params");

tasksRouter.get("/", taskController.list);
tasksRouter.post("/", validateSchema(createTaskSchema), taskController.create);

tasksRouter.get("/:id", validateId, taskController.getById);
tasksRouter.patch(
  "/:id",
  validateId,
  validateSchema(updateTaskSchema),
  taskController.update,
);
tasksRouter.delete("/:id", validateId, taskController.remove);
