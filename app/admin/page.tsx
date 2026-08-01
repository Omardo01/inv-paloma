"use client";

/**
 * Panel de invitaciones. Hace exactamente dos cosas:
 *   1. crear invitaciones (nombre + lugares + teléfono opcional);
 *   2. ver quién confirmó, quién dijo que no y quién sigue sin responder.
 *
 * Nada de mesas, asientos ni regalos: eso se agrega el día que haga falta.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Guest, Stats } from "@/lib/guests";

/* ── paleta del panel, tomada del tema de la invitación ── */
const C = {
  bg: "#fffbfc",
  card: "#ffffff",
  line: "#f2dde4",
  ink: "#4b2b34",
  mid: "#8d6270",
  faint: "#c9a0ad",
  accent: "#b95571",
  soft: "#fdf6f8",
};

type Filter = "todos" | "confirmados" | "pendientes" | "no";

function StatusBadge({ confirmed }: { confirmed: 1 | 0 | null }) {
  const map = {
    1: { label: "✓ Confirmado", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    0: { label: "✗ No asiste", style: "bg-red-50 text-red-600 border-red-200" },
    null: { label: "⏳ Pendiente", style: "bg-amber-50 text-amber-600 border-amber-200" },
  } as const;
  const meta = map[String(confirmed) === "null" ? "null" : (confirmed as 1 | 0)];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${meta.style}`}>
      {meta.label}
    </span>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color: string }) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: C.line, background: color }}>
      <p className="text-2xl font-bold" style={{ color: C.ink }}>
        {value}
      </p>
      <p className="mt-0.5 text-sm font-medium" style={{ color: C.mid }}>
        {label}
      </p>
      {sub && (
        <p className="mt-0.5 text-xs" style={{ color: C.faint }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* alta */
  const [name, setName] = useState("");
  const [seats, setSeats] = useState("2");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  /* lista */
  const [filter, setFilter] = useState<Filter>("todos");
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/guests");
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { guests: Guest[]; stats: Stats };
      setGuests(data.guests);
      setStats(data.stats);
    } catch {
      setError("No se pudo cargar la lista. ¿Ya está configurada la base de datos?");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    if (saving || !name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, seats: Number(seats), phone }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error);
      }
      setName("");
      setSeats("2");
      setPhone("");
      await load();
    } catch (e) {
      setError(e instanceof Error && e.message ? e.message : "No se pudo crear la invitación.");
    }
    setSaving(false);
  }

  async function borrar(g: Guest) {
    if (!confirm(`¿Borrar la invitación de ${g.name}? Su enlace dejará de funcionar.`)) return;
    await fetch(`/api/guests/${g.id}`, { method: "DELETE" });
    await load();
  }

  function enlace(slug: string) {
    return `${window.location.origin}/i/${slug}`;
  }

  async function copiar(slug: string) {
    await navigator.clipboard.writeText(enlace(slug));
    setCopied(slug);
    setTimeout(() => setCopied((s) => (s === slug ? null : s)), 1800);
  }

  /** Mensaje listo para WhatsApp; si hay teléfono abre el chat directo. */
  function whatsapp(g: Guest) {
    const texto = `¡Hola ${g.name}! Te comparto la invitación a mis XV años 💌\n${enlace(g.slug)}`;
    const base = g.phone ? `https://wa.me/${g.phone.replace(/\D/g, "")}` : "https://wa.me/";
    return `${base}?text=${encodeURIComponent(texto)}`;
  }

  const visibles = useMemo(() => {
    const q = search.trim().toLowerCase();
    return guests.filter((g) => {
      if (filter === "confirmados" && g.confirmed !== 1) return false;
      if (filter === "no" && g.confirmed !== 0) return false;
      if (filter === "pendientes" && g.confirmed !== null) return false;
      if (q && !g.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [guests, filter, search]);

  const FILTERS: { key: Filter; label: string }[] = [
    { key: "todos", label: "Todos" },
    { key: "confirmados", label: "Confirmados" },
    { key: "pendientes", label: "Sin responder" },
    { key: "no", label: "No asisten" },
  ];

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6" style={{ background: C.bg, color: C.ink }}>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold">Invitaciones</h1>
        <p className="mt-1 text-sm" style={{ color: C.mid }}>
          Crea una invitación por familia y comparte su enlace. Cuando respondan, aparece aquí.
        </p>

        {/* ── Contadores ── */}
        {stats && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Invitaciones" value={stats.total} sub={`${stats.totalSeats} lugares`} color={C.card} />
            <StatCard label="Confirmadas" value={stats.confirmed} sub={`${stats.confirmedSeats} asisten`} color="#f2fbf5" />
            <StatCard label="Sin responder" value={stats.pending} color="#fffaf0" />
            <StatCard label="No asisten" value={stats.declined} color="#fdf4f4" />
          </div>
        )}

        {/* ── Alta ── */}
        <form
          onSubmit={crear}
          className="mt-6 rounded-2xl border p-5"
          style={{ borderColor: C.line, background: C.card }}
        >
          <p className="text-sm font-medium">Nueva invitación</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Familia Pérez"
              className="flex-1 rounded-full px-4 py-2.5 text-sm outline-none"
              style={{ background: C.soft, border: `1px solid ${C.line}` }}
            />
            <input
              type="number"
              min={1}
              max={20}
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              placeholder="Lugares"
              className="rounded-full px-4 py-2.5 text-sm outline-none sm:w-28"
              style={{ background: C.soft, border: `1px solid ${C.line}` }}
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="WhatsApp (opcional)"
              inputMode="tel"
              className="rounded-full px-4 py-2.5 text-sm outline-none sm:w-52"
              style={{ background: C.soft, border: `1px solid ${C.line}` }}
            />
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="rounded-full px-6 py-2.5 text-sm text-white transition-opacity disabled:opacity-50"
              style={{ background: C.accent }}
            >
              {saving ? "Creando…" : "Crear"}
            </button>
          </div>
        </form>

        {error && (
          <p className="mt-4 rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "#f0c9c9", background: "#fdf4f4", color: "#b3261e" }}>
            {error}
          </p>
        )}

        {/* ── Filtros ── */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="rounded-full px-3 py-1.5 text-xs transition-colors"
              style={
                filter === f.key
                  ? { background: C.accent, color: "#fff" }
                  : { background: C.card, color: C.mid, border: `1px solid ${C.line}` }
              }
            >
              {f.label}
            </button>
          ))}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar…"
            className="ml-auto rounded-full px-4 py-1.5 text-xs outline-none"
            style={{ background: C.card, border: `1px solid ${C.line}`, minWidth: 160 }}
          />
        </div>

        {/* ── Lista ── */}
        <div className="mt-4 space-y-2 pb-16">
          {loading && (
            <p className="py-10 text-center text-sm" style={{ color: C.faint }}>
              Cargando…
            </p>
          )}

          {!loading && visibles.length === 0 && (
            <p className="py-10 text-center text-sm" style={{ color: C.faint }}>
              {guests.length === 0 ? "Todavía no hay invitaciones." : "Nada con ese filtro."}
            </p>
          )}

          {visibles.map((g) => (
            <div
              key={g.id}
              className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center"
              style={{ borderColor: C.line, background: C.card }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{g.name}</p>
                  <StatusBadge confirmed={g.confirmed} />
                </div>
                <p className="mt-1 text-xs" style={{ color: C.mid }}>
                  {/* si ya respondió, lo que importa es cuántos van de verdad */}
                  {g.confirmed === 1 && g.attending !== null
                    ? `Asisten ${g.attending} de ${g.seats}`
                    : `${g.seats} ${g.seats === 1 ? "lugar" : "lugares"}`}
                  {g.notes ? ` · ${g.notes}` : ""}
                </p>
                <p className="mt-0.5 truncate text-[11px]" style={{ color: C.faint }}>
                  /i/{g.slug}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => copiar(g.slug)}
                  className="rounded-full px-3 py-1.5 text-xs"
                  style={{ background: C.soft, border: `1px solid ${C.line}`, color: C.mid }}
                >
                  {copied === g.slug ? "¡Copiado!" : "Copiar enlace"}
                </button>
                <a
                  href={whatsapp(g)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full px-3 py-1.5 text-xs text-white"
                  style={{ background: "#25d366" }}
                >
                  WhatsApp
                </a>
                <a
                  href={`/i/${g.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full px-3 py-1.5 text-xs"
                  style={{ background: C.soft, border: `1px solid ${C.line}`, color: C.mid }}
                >
                  Ver
                </a>
                <button
                  onClick={() => borrar(g)}
                  className="rounded-full px-3 py-1.5 text-xs"
                  style={{ color: "#b3261e", border: "1px solid #f0c9c9" }}
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
