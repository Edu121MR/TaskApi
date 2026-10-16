import { ValidationError } from "../utils/http-error.js";

export const validateSchema =
  (schema, source = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[source] ?? {});
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || source,
        message: issue.message,
      }));
      throw new ValidationError(details);
    }
    req[source] = result.data;
    next();
  };
