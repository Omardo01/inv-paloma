"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      /* el servidor distingue «contraseña mal» de «falta configurar la base» */
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Contraseña incorrecta.");
    } catch {
      setError("No se pudo conectar. Revisa tu conexión.");
    }
    setLoading(false);
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center px-6"
      style={{ backgroundColor: "#fffbfc", color: "#4b2b34", fontFamily: "var(--font-sans)" }}
    >
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl p-8 text-center"
        style={{ backgroundColor: "#fff", border: "1px solid #f6e0e7", boxShadow: "0 30px 70px -30px rgba(185,85,113,0.45)" }}
      >
        <p className="mb-2 text-[10px] uppercase tracking-[0.35em]" style={{ color: "#b95571" }}>
          Panel de invitaciones
        </p>
        <h1 className="mb-6 text-5xl" style={{ fontFamily: "var(--font-great-vibes)", color: "#b95571" }}>
          Acceso
        </h1>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="mb-3 w-full rounded-full px-5 py-3 text-sm outline-none"
          style={{ backgroundColor: "#fdf6f8", border: `1px solid ${error ? "#d24a4a" : "#f6e0e7"}`, color: "#4b2b34" }}
        />

        {error && (
          <p className="mb-3 text-xs leading-relaxed" style={{ color: "#d24a4a" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-full py-3 text-sm uppercase tracking-[0.2em] text-white transition-opacity disabled:opacity-60"
          style={{ backgroundColor: "#b95571", boxShadow: "0 16px 30px -14px rgba(185,85,113,0.7)" }}
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
