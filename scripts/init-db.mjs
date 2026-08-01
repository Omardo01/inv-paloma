// Crea el esquema en Neon (Postgres).
// Uso:  node --env-file=.env.local scripts/init-db.mjs   (o: npm run db:setup)
//
// Es idempotente: se puede volver a correr sobre una base que ya tiene datos.
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("✗ Falta DATABASE_URL. Córrelo con: node --env-file=.env.local scripts/init-db.mjs");
  process.exit(1);
}
const sql = neon(url);

/* Invitados: una fila por invitación.
   confirmed → NULL sin responder · 1 asiste · 0 no asiste */
await sql`CREATE TABLE IF NOT EXISTS guests (
  id            SERIAL PRIMARY KEY,
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  seats         INTEGER NOT NULL DEFAULT 1,
  phone         TEXT,
  confirmed     SMALLINT DEFAULT NULL,
  confirmed_at  TEXT DEFAULT NULL,
  notes         TEXT DEFAULT NULL,
  created_at    TEXT NOT NULL DEFAULT (now()::text)
)`;

/* Acceso al panel: la contraseña (hasheada) vive en `settings` y las sesiones
   son tokens opacos con caducidad. */
await sql`CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
)`;
await sql`CREATE TABLE IF NOT EXISTS admin_sessions (
  token      TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
)`;

console.log("✓ Esquema listo (guests, settings, admin_sessions)");

const [{ n }] = await sql`SELECT COUNT(*)::int AS n FROM guests`;
console.log(`• guests: ${n} invitación(es)`);

const [{ p }] = await sql`SELECT COUNT(*)::int AS p FROM settings WHERE key = 'admin_password'`;
if (p === 0) {
  console.log('\n→ Falta la contraseña del panel:  npm run admin:password -- "TuContraseña"');
}
