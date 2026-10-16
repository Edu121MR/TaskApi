// El controller solo traduce HTTP <-> service: lee req, llama al service
// y responde. No tiene try/catch: en Express 5 los errores de funciones
// async llegan solos al errorHandler.
export function createTaskController(taskService) {
  return {
    async list(req, res) {
      res.json(await taskService.list());
    },

    async getById(req, res) {
      res.json(await taskService.getById(req.params.id));
    },

    async create(req, res) {
      res.status(201).json(await taskService.create(req.body));
    },

    async update(req, res) {
      res.json(await taskService.update(req.params.id, req.body));
    },

    async remove(req, res) {
      await taskService.remove(req.params.id);
      res.status(204).send();
    },
  };
}
