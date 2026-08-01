import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { quince } from "@/lib/quince";

// El gate se evalúa en cada request (nunca cacheado).
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAuthed())) redirect("/admin-login");

  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      <div className="flex items-center justify-between gap-3 px-4 py-1.5 text-white" style={{ backgroundColor: "#4b2b34" }}>
        <span className="text-[11px] uppercase tracking-[0.2em] opacity-80">
          Panel<span className="hidden sm:inline"> · XV de {quince.name}</span>
        </span>
        <form action="/api/admin/logout" method="post">
          <button type="submit" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.15em] transition-colors hover:bg-white/15">
            Cerrar sesión →
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}
