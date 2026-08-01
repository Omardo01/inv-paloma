# XV de Yesenia

Invitación digital de XV años + panel para crear las invitaciones y ver las
confirmaciones. Next.js 16 (App Router), React 19, Tailwind v4 y Neon Postgres.

## Rutas

| Ruta | Qué es |
| --- | --- |
| `/` | La invitación en vista de muestra: se ve completa, pero el RSVP no guarda. |
| `/i/[slug]` | La invitación de un invitado: lleva su nombre, sus lugares y el RSVP real. |
| `/admin` | Panel: crear invitaciones y ver quién confirmó. Pide contraseña. |
| `/admin-login` | Acceso al panel. |

## Arrancar

```bash
npm install
npm run dev
```

`/` funciona sin base de datos. Para `/admin` y `/i/[slug]` hace falta Neon.

## Base de datos (Neon)

1. Vercel → Storage → Neon → crear la base y enlazarla al proyecto.
2. Traer las variables: `vercel env pull .env.local` (o copiar `DATABASE_URL` a
   mano desde `.env.example`).
3. Crear las tablas:

```bash
npm run db:setup
```

4. Poner la contraseña del panel:

```bash
npm run admin:password -- "TuContraseña"
```

Tres tablas: `guests` (una fila por invitación), `settings` (la contraseña,
hasheada con pbkdf2-sha256) y `admin_sessions` (los tokens de sesión).

## Dónde se cambia qué

- **`lib/quince.ts`** — todos los datos del evento: fecha, salón, itinerario,
  versículo, fotos, canción. Una sola fuente de verdad; las secciones lo leen.
- **`components/invitation.tsx`** — el orden de las secciones y el tema
  («Jardín de lirios»: colores y tipografías).
- **`components/quince-kit.tsx`** — las piezas (fecha, cuenta regresiva,
  itinerario, galería, RSVP, reproductor). Leen el tema como CSS vars `--q-*`.
- **`components/quince-deco.tsx`** — estrellas, lirios y la portada con foto.

## Fotos y música

Las fotos servidas están en `public/quince/fotos/` en webp (lado largo 1600 px,
2000 px la portada). El mapa contra los originales y el comando para
regenerarlas está en `public/quince/CREDITOS.md`. La canción es
`public/quince/cancion.mp3`.

## Pendientes

Padres, padrinos, corte de honor y el vals siguen sin definirse: no están en
`lib/quince.ts` y por eso no aparecen en la invitación.
