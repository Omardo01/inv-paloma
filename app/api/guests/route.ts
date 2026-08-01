import { NextResponse } from "next/server";
import { getAllGuests, createGuest, getStats } from "@/lib/guests";
import { requireAdmin } from "@/lib/auth";

/** Lista de invitados + contadores, para el panel. */
export async function GET() {
  const deny = await requireAdmin();
  if (deny) return deny;
  const [guests, stats] = await Promise.all([getAllGuests(), getStats()]);
  return NextResponse.json({ guests, stats });
}

/** Crear una invitación. */
export async function POST(req: Request) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const { name, seats, phone } = (await req.json()) as {
    name?: string;
    seats?: number | string;
    phone?: string;
  };

  const nombre = name?.trim();
  const lugares = Number(seats);
  if (!nombre) return NextResponse.json({ error: "Falta el nombre" }, { status: 400 });
  if (!Number.isInteger(lugares) || lugares < 1 || lugares > 20) {
    return NextResponse.json({ error: "Los lugares deben ser un número entre 1 y 20" }, { status: 400 });
  }

  const guest = await createGuest({ name: nombre, seats: lugares, phone });
  return NextResponse.json(guest, { status: 201 });
}
