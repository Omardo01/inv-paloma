import { NextResponse } from "next/server";
import {
  getAdminPasswordHash,
  verifyPassword,
  createSession,
  ADMIN_COOKIE,
  SESSION_DAYS,
} from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }));
  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Falta la contraseña" }, { status: 400 });
  }

  /* Si la base no está lista, decirlo tal cual: sin esto el fallo se ve como
     «contraseña incorrecta» y se pierde media hora buscando por dónde no es. */
  let stored: string | null;
  try {
    stored = await getAdminPasswordHash();
  } catch {
    return NextResponse.json(
      { error: "La base de datos todavía no está configurada (falta DATABASE_URL y `npm run db:setup`)." },
      { status: 503 },
    );
  }

  if (!stored) {
    return NextResponse.json(
      { error: 'Aún no hay contraseña. Créala con: npm run admin:password -- "TuContraseña"' },
      { status: 503 },
    );
  }
  if (!verifyPassword(password, stored)) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  const token = await createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86_400,
  });
  return res;
}
