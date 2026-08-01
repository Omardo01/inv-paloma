import { NextResponse } from "next/server";
import { updateGuest, deleteGuest } from "@/lib/guests";
import { requireAdmin } from "@/lib/auth";

/** Editar nombre, lugares o teléfono de una invitación. */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Id inválido" }, { status: 400 });

  const body = (await req.json()) as { name?: string; seats?: number | string; phone?: string };
  const data: { name?: string; seats?: number; phone?: string } = {};

  if (body.name !== undefined) {
    const nombre = body.name.trim();
    if (!nombre) return NextResponse.json({ error: "Falta el nombre" }, { status: 400 });
    data.name = nombre;
  }
  if (body.seats !== undefined) {
    const lugares = Number(body.seats);
    if (!Number.isInteger(lugares) || lugares < 1 || lugares > 20) {
      return NextResponse.json({ error: "Los lugares deben ser un número entre 1 y 20" }, { status: 400 });
    }
    data.seats = lugares;
  }
  if (body.phone !== undefined) data.phone = body.phone;

  const guest = await updateGuest(id, data);
  if (!guest) return NextResponse.json({ error: "Invitado no encontrado" }, { status: 404 });
  return NextResponse.json(guest);
}

/** Borrar una invitación. */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const deny = await requireAdmin();
  if (deny) return deny;

  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Id inválido" }, { status: 400 });

  await deleteGuest(id);
  return NextResponse.json({ ok: true });
}
