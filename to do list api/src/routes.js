import { Router } from "express";
import { healthRouter } from "./modules/health/health.routes.js";
import { tasksRouter } from "./modules/task/task.routes.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { docsRouter } from "./docs/docs.routes.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/tasks", tasksRouter);
apiRouter.use("/docs", docsRouter);