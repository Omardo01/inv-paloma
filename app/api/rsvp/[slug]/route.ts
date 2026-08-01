import { NextResponse } from "next/server";
import { confirmRSVP } from "@/lib/guests";

/**
 * Respuesta del invitado desde su propia invitación. Es la única ruta pública
 * que escribe: no lleva sesión de admin, sólo puede tocar la fila de su slug y
 * únicamente el estado del RSVP.
 */
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { confirmed, attending, notes } = (await req.json()) as {
    confirmed?: boolean;
    attending?: number;
    notes?: string;
  };

  if (typeof confirmed !== "boolean") {
    return NextResponse.json({ error: "Falta `confirmed`" }, { status: 400 });
  }

  /* El tope real lo pone la BD contra los lugares apartados; aquí sólo se
     descarta lo que ni siquiera es un número. */
  const cuantos = Number.isInteger(attending) ? (attending as number) : undefined;

  const guest = await confirmRSVP(slug, confirmed, cuantos, notes?.slice(0, 300));
  if (!guest) return NextResponse.json({ error: "Invitación no encontrada" }, { status: 404 });

  return NextResponse.json({ ok: true, confirmed: guest.confirmed, attending: guest.attending });
}
