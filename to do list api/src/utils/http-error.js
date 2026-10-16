// Error con código HTTP. Cualquier capa (service, middleware) puede lanzarlo
// y el errorHandler global lo convierte en la respuesta JSON correspondiente.
export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.details = details;
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Resource not found") {
    super(404, message);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "No autenticado") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Conflict") {
    super(409, message);
    this.name = "ConflictError";
  }
}

export class ValidationError extends HttpError {
  constructor(details) {
    super(400, "Validation failed", details);
    this.name = "ValidationError";
  }
}
