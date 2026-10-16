-- Paso 7: tabla de usuarios para la autenticación con JWT.
-- Ejecutar en Supabase -> SQL Editor.

create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  email         text not null unique check (email = lower(email) and length(email) <= 320),
  password_hash text not null,                 -- hash de bcrypt, nunca la contraseña
  created_at    timestamptz not null default now()
);

-- Cerrada para la llave pública: solo nuestro servidor (secret key) la usa.
alter table public.users enable row level security;

grant select, insert, update, delete on table public.users to service_role;
