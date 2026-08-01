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
     «contraseña incorrecta» y se pierde media hora buscando por dónde no es.
     Se distinguen los dos casos porque se arreglan de forma distinta. */
  let stored: string | null;
  try {
    stored = await getAdminPasswordHash();
  } catch {
    const error = process.env.DATABASE_URL
      ? "Hay conexión a la base, pero faltan las tablas. Corre `npm run db:setup`."
      : "Falta la variable DATABASE_URL en este entorno.";
    return NextResponse.json({ error }, { status: 503 });
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
