import { unwrap } from "../../lib/supabase.js";

const TABLE_NAME = "tasks";
const TABLE_COLUMNS = "id, title, description, done, created_at";

// El repository solo habla con la base de datos.
// Si una fila no existe devuelve null; NO decide si eso es un 404.
//   maybeSingle() -> null si no hay fila
//   single()      -> error si no hay exactamente una fila
export function createTaskRepository(supabase) {
  return {
    async findAll() {
      return unwrap(
        await supabase
          .from(TABLE_NAME)
          .select(TABLE_COLUMNS)
          .order("created_at", { ascending: false }),
      );
    },

    async findById(id) {
      return unwrap(
        await supabase
          .from(TABLE_NAME)
          .select(TABLE_COLUMNS)
          .eq("id", id)
          .maybeSingle(),
      );
    },

    async create(data) {
      return unwrap(
        await supabase
          .from(TABLE_NAME)
          .insert(data)
          .select(TABLE_COLUMNS)
          .single(),
      );
    },

    async update(id, data) {
      return unwrap(
        await supabase
          .from(TABLE_NAME)
          .update(data)
          .eq("id", id)
          .select(TABLE_COLUMNS)
          .maybeSingle(),
      );
    },

    async remove(id) {
      return unwrap(
        await supabase
          .from(TABLE_NAME)
          .delete()
          .eq("id", id)
          .select(TABLE_COLUMNS)
          .maybeSingle(),
      );
    },
  };
}
