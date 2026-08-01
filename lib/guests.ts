import { db } from "./db";

/**
 * Invitados de los XV. Una fila por invitación (una familia o una persona),
 * con su `slug` — la parte final del enlace que se manda por WhatsApp.
 *
 * `confirmed`: null = todavía no responde, 1 = asiste, 0 = no asiste.
 * `seats`: los lugares que se le apartaron.
 * `attending`: cuántos van de verdad, que puede ser menos. Es el número que
 * importa para la comida y las sillas.
 */
export type Guest = {
  id: number;
  slug: string;
  name: string;
  seats: number;
  phone: string | null;
  confirmed: 1 | 0 | null;
  attending: number | null;
  confirmed_at: string | null;
  notes: string | null;
  created_at: string;
};

export type Stats = {
  total: number;
  confirmed: number;
  declined: number;
  pending: number;
  totalSeats: number;
  confirmedSeats: number;
};

/**
 * Slug legible a partir del nombre, con cuatro caracteres al azar al final
 * para que dos «Familia Pérez» no choquen y el enlace no sea adivinable.
 */
function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 25);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || "invitado"}-${suffix}`;
}

export async function getAllGuests(): Promise<Guest[]> {
  const sql = db();
  return (await sql`SELECT * FROM guests ORDER BY created_at DESC`) as Guest[];
}

export async function getGuestBySlug(slug: string): Promise<Guest | null> {
  const sql = db();
  const rows = (await sql`SELECT * FROM guests WHERE slug = ${slug}`) as Guest[];
  return rows[0] ?? null;
}

export async function createGuest(data: { name: string; seats: number; phone?: string }): Promise<Guest> {
  const sql = db();
  const slug = generateSlug(data.name);
  const rows = (await sql`
    INSERT INTO guests (slug, name, seats, phone)
    VALUES (${slug}, ${data.name}, ${data.seats}, ${data.phone || null})
    RETURNING *
  `) as Guest[];
  return rows[0];
}

export async function updateGuest(
  id: number,
  data: { name?: string; seats?: number; phone?: string },
): Promise<Guest | null> {
  const sql = db();
  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  if (data.name !== undefined) {
    fields.push(`name = $${i++}`);
    values.push(data.name);
  }
  if (data.seats !== undefined) {
    fields.push(`seats = $${i++}`);
    values.push(data.seats);
  }
  if (data.phone !== undefined) {
    fields.push(`phone = $${i++}`);
    values.push(data.phone || null);
  }
  if (fields.length === 0) return null;
  values.push(id);
  const rows = (await sql.query(
    `UPDATE guests SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
    values,
  )) as Guest[];
  return rows[0] ?? null;
}

export async function deleteGuest(id: number): Promise<void> {
  const sql = db();
  await sql`DELETE FROM guests WHERE id = ${id}`;
}

/**
 * Respuesta del invitado desde su propia invitación.
 *
 * `attending` se limita a los lugares que tiene apartados: nadie puede
 * apuntar más gente de la que se le invitó. Si dice que no, va en 0.
 */
export async function confirmRSVP(
  slug: string,
  confirmed: boolean,
  attending?: number,
  notes?: string,
): Promise<Guest | null> {
  const sql = db();
  const now = new Date().toISOString();
  const rows = (await sql`
    UPDATE guests
    SET confirmed = ${confirmed ? 1 : 0},
        attending = CASE
          WHEN ${!confirmed} THEN 0
          WHEN ${attending ?? null}::int IS NULL THEN seats
          ELSE LEAST(GREATEST(${attending ?? 0}::int, 0), seats)
        END,
        confirmed_at = ${now},
        notes = ${notes ?? null}
    WHERE slug = ${slug}
    RETURNING *
  `) as Guest[];
  return rows[0] ?? null;
}

export async function getStats(): Promise<Stats> {
  const sql = db();
  const rows = (await sql`
    SELECT
      COUNT(*)::int                                            AS total,
      COUNT(*) FILTER (WHERE confirmed = 1)::int               AS confirmed,
      COUNT(*) FILTER (WHERE confirmed = 0)::int               AS declined,
      COUNT(*) FILTER (WHERE confirmed IS NULL)::int           AS pending,
      COALESCE(SUM(seats), 0)::int                             AS "totalSeats",
      -- los que asisten de verdad; si alguien confirmó antes de que existiera
      -- la columna, se cuentan sus lugares apartados
      COALESCE(SUM(COALESCE(attending, seats)) FILTER (WHERE confirmed = 1), 0)::int AS "confirmedSeats"
    FROM guests
  `) as Stats[];
  return rows[0];
}
