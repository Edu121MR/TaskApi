import { NotFoundError } from "../../utils/http-error.js";

// El service tiene la lógica de negocio: aquí se decide que
// "el repository devolvió null" significa 404 Task not found.
export function createTaskService(taskRepository) {
  function ensureExists(task) {
    if (!task) throw new NotFoundError("Task not found");
    return task;
  }

  return {
    list: () => taskRepository.findAll(),

    async getById(id) {
      return ensureExists(await taskRepository.findById(id));
    },

    create: (data) => taskRepository.create(data),

    async update(id, data) {
      return ensureExists(await taskRepository.update(id, data));
    },

    async remove(id) {
      ensureExists(await taskRepository.remove(id));
    },
  };
}
