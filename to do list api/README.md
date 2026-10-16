# To Do List API

API REST de tareas con Node (Express 5) + Supabase, documentada con Swagger y protegida con JWT.

## Cómo correrla

1. `npm install`
2. En Supabase → SQL Editor, ejecutar `supabase/02_auth.sql` (tabla `users`). La tabla `tasks` debe existir.
3. Crear un archivo `.env` con:

   ```
   SUPABASE_URL=https://<tu-proyecto>.supabase.co
   SUPABASE_SECRET_KEY=sb_secret_...
   JWT_SECRET=<al menos 32 caracteres>
   JWT_EXPIRES_IN=1h
   ```

   Generar el `JWT_SECRET` con:
   `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`

4. `npm run dev`

## Endpoints

- Docs (Swagger): `http://localhost:3000/api/docs`
- OpenAPI JSON: `http://localhost:3000/api/docs/openapi.json`
- `GET /api/health`, `GET /api/health/db`
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET|POST /api/tasks`, `GET|PATCH|DELETE /api/tasks/:id` (requieren `Authorization: Bearer <token>`)

## Postman

Importar `postman/tasks-api.openapi.json` (Import → archivo → Postman Collection).
Después del login, pegar el `accessToken` en la variable `bearerToken` de la colección.

## Estructura

```
src/
  config/       variables de entorno validadas con zod
  lib/          cliente de Supabase y JWT
  middlewares/  validate, auth (requireAuth), errores
  docs/         OpenAPI + Swagger UI
  modules/
    health/
    auth/       routes → controller → service → repository
    task/       routes → controller → service → repository
```
