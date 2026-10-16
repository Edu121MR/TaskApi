import { Router } from "express";
import { supabase } from "../../lib/supabase.js";

export const healthRouter = Router();

healthRouter.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// Verifica que la API llega a Supabase. Si la URL o la llave están mal -> 503.
healthRouter.get("/db", async (req, res) => {
  const { error } = await supabase
    .from("tasks")
    .select("id", { head: true, count: "exact" });
  if (error) {
    return res.status(503).json({ status: "error", database: "unreachable" });
  }
  res.json({ status: "ok", database: "connected" });
});
