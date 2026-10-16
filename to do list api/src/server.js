import { env } from "./config/env.js";
import { createApp } from "./app.js";

const app = createApp();

app.listen(env.PORT, (error) => {
  if (error) {
    if (error.code === "EADDRINUSE") {
      console.error(
        `El puerto ${env.PORT} ya está en uso. Cierra la otra terminal donde corre la API (Ctrl+C) o cambia PORT en .env.`,
      );
      process.exit(1);
    }
    throw error;
  }
  console.log(`Server listening on http://localhost:${env.PORT}/api`);
  console.log(`Docs: http://localhost:${env.PORT}/api/docs`);
});
