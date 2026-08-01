"use client";

/**
 * Piezas de la invitación.
 *
 * El tema («Jardín de lirios») se inyecta una sola vez como CSS vars con
 * `<ThemeScope>` y todas las piezas de aquí leen esas vars, así que cambiar un
 * color o una tipografía es tocar el tema, no cada sección.
 *
 * Tokens: --q-bg --q-paper --q-paper2 --q-ink --q-mid --q-faint --q-line
 *         --q-accent --q-accent-deep --q-display --q-script --q-body --q-deco
 */

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "motion/react";
import confetti from "canvas-confetti";
import { quince, mapsUrl, calendarUrl } from "@/lib/quince";
import { useCountdown } from "@/components/magic";

/* ─────────────────────────────────────────────
   Tema
   ───────────────────────────────────────────── */

export type Theme = {
  bg: string;
  paper: string;
  paper2: string;
  ink: string;
  mid: string;
  faint: string;
  line: string;
  accent: string;
  accentDeep: string;
  /** familia de los títulos grandes */
  display: string;
  /** familia caligráfica (nombre de la festejada) */
  script: string;
  /** familia del cuerpo de texto */
  body: string;
  /** familia de los kickers en mayúsculas con tracking */
  deco: string;
};

export function themeVars(t: Theme): CSSProperties {
  return {
    "--q-bg": t.bg,
    "--q-paper": t.paper,
    "--q-paper2": t.paper2,
    "--q-ink": t.ink,
    "--q-mid": t.mid,
    "--q-faint": t.faint,
    "--q-line": t.line,
    "--q-accent": t.accent,
    "--q-accent-deep": t.accentDeep,
    "--q-display": t.display,
    "--q-script": t.script,
    "--q-body": t.body,
    "--q-deco": t.deco,
  } as CSSProperties;
}

/** Envoltura raíz de una opción: aplica el tema y el color de fondo/texto. */
export function ThemeScope({
  theme,
  children,
  className = "",
  style = {},
}: {
  theme: Theme;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <main
      className={`min-h-dvh ${className}`}
      style={{
        ...themeVars(theme),
        background: "var(--q-bg)",
        color: "var(--q-ink)",
        fontFamily: "var(--q-body)",
        ...style,
      }}
    >
      {children}
    </main>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed left-0 top-0 z-50 h-[2px] origin-left"
      style={{ scaleX: width, width: "100%", background: "var(--q-accent)" }}
    />
  );
}

/* ─────────────────────────────────────────────
   Tipografía de sección
   ───────────────────────────────────────────── */

export function SectionTitle({
  children,
  kicker,
  align = "center",
}: {
  children: ReactNode;
  kicker?: string;
  align?: "center" | "left";
}) {
  return (
    <motion.div
      className={`mb-10 ${align === "center" ? "text-center" : "text-left"}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-70px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
    >
      {kicker && (
        <motion.p
          className="mb-3 text-[10px] uppercase tracking-[0.4em]"
          style={{ fontFamily: "var(--q-deco)", color: "var(--q-accent-deep)" }}
          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {kicker}
        </motion.p>
      )}
      <motion.h2
        className="text-4xl md:text-5xl"
        style={{ fontFamily: "var(--q-display)", color: "var(--q-ink)" }}
        variants={{ hidden: { opacity: 0, y: 14, filter: "blur(8px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)" } }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.h2>
    </motion.div>
  );
}

/** Sección con el ancho y los separadores estándar. */
export function Section({
  children,
  alt = false,
  className = "",
  id,
}: {
  children: ReactNode;
  alt?: boolean;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`relative border-t px-6 py-20 ${className}`}
      style={{ borderColor: "var(--q-line)", background: alt ? "var(--q-paper2)" : "transparent" }}
    >
      <div className="mx-auto max-w-3xl">{children}</div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Separadores
   ───────────────────────────────────────────── */

export function Divider({ variant = "diamond", className = "" }: { variant?: "diamond" | "line" | "dots"; className?: string }) {
  if (variant === "line") {
    return (
      <motion.div
        className={`mx-auto h-px ${className}`}
        style={{ background: "var(--q-accent)", transformOrigin: "center" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    );
  }
  if (variant === "dots") {
    return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1 w-1 rounded-full"
            style={{ background: "var(--q-accent)" }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, type: "spring", stiffness: 260, damping: 18 }}
          />
        ))}
      </div>
    );
  }
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <motion.span
        className="h-px w-16"
        style={{ background: "var(--q-line)", transformOrigin: "right" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      />
      <motion.span
        className="block h-2 w-2 rotate-45"
        style={{ border: "1px solid var(--q-accent)" }}
        initial={{ opacity: 0, rotate: 0, scale: 0 }}
        whileInView={{ opacity: 1, rotate: 45, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 16 }}
      />
      <motion.span
        className="h-px w-16"
        style={{ background: "var(--q-line)", transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Música
   ───────────────────────────────────────────── */

/**
 * Botón flotante de música. Mismo comportamiento que el de la boda:
 *
 * - Intenta arrancar sola; como los navegadores bloquean el autoplay con
 *   sonido, si falla se queda esperando el PRIMER gesto del usuario.
 * - Ese enganche se quita en cuanto suena una vez, para que una pausa manual
 *   no la reanude sola con el siguiente scroll.
 * - `quince.music.start` salta el silencio del principio del MP3, también al
 *   repetir.
 */
export function MusicToggle({ className = "bottom-5 right-5" }: { className?: string }) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    audio.volume = 0.55;

    const atStart = () => {
      if (audio.currentTime < quince.music.start) audio.currentTime = quince.music.start;
    };
    audio.addEventListener("loadedmetadata", atStart);

    const start = () => {
      atStart();
      return audio.play();
    };

    let unlocked = false;
    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    const onGesture = () => {
      if (unlocked) return;
      unlocked = true;
      removeGestureListeners();
      start().catch(() => {});
    };
    const removeGestureListeners = () => {
      events.forEach((e) => window.removeEventListener(e, onGesture));
    };

    start()
      .then(() => {
        unlocked = true;
      })
      .catch(() => {
        events.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));
      });

    return () => {
      audio.removeEventListener("loadedmetadata", atStart);
      removeGestureListeners();
    };
  }, []);

  /* onPlay/onPause del <audio> son los que mueven el estado, así que aquí no se
     toca `setPlaying`: si no, el ícono se desincroniza. */
  const toggle = () => {
    const audio = ref.current;
    if (!audio) return;
    if (audio.paused) {
      if (audio.currentTime < quince.music.start) audio.currentTime = quince.music.start;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  return (
    <>
      <audio
        ref={ref}
        src={quince.music.src}
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={(e) => {
          const a = e.currentTarget;
          a.currentTime = quince.music.start;
          a.play().catch(() => {});
        }}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? `Pausar ${quince.music.title}` : `Reproducir ${quince.music.title}`}
        className={`fixed z-50 grid h-11 w-11 place-items-center rounded-full backdrop-blur transition-transform hover:scale-105 active:scale-95 ${className}`}
        style={{
          background: "color-mix(in srgb, var(--q-accent-deep) 92%, transparent)",
          boxShadow: "0 8px 20px -8px color-mix(in srgb, var(--q-accent-deep) 70%, transparent)",
        }}
      >
        {playing ? (
          /* ecualizador: sólo se anima mientras suena */
          <span className="flex h-4 items-end gap-[3px]">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-[3px] rounded-full bg-white"
                animate={{ height: ["6px", "16px", "6px"] }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.18 }}
              />
            ))}
          </span>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        )}
      </button>
    </>
  );
}

/* ─────────────────────────────────────────────
   Cuenta regresiva
   ───────────────────────────────────────────── */

export function Countdown({ compact = false }: { compact?: boolean }) {
  const t = useCountdown(quince.iso);
  const cells = [
    { v: t.d, l: "Días" },
    { v: t.h, l: "Horas" },
    { v: t.m, l: "Min" },
    { v: t.s, l: "Seg" },
  ];
  return (
    <div className={`flex items-start justify-center ${compact ? "gap-5" : "gap-6 md:gap-10"}`}>
      {cells.map((c, i) => (
        <div key={c.l} className="flex items-start">
          <div className="text-center">
            <div
              className={`tabular-nums leading-none ${compact ? "text-2xl" : "text-4xl md:text-5xl"}`}
              style={{ fontFamily: "var(--q-display)", color: "var(--q-ink)" }}
            >
              {String(c.v).padStart(2, "0")}
            </div>
            <div
              className="mt-2 text-[9px] uppercase tracking-[0.3em]"
              style={{ fontFamily: "var(--q-deco)", color: "var(--q-faint)" }}
            >
              {c.l}
            </div>
          </div>
          {i < cells.length - 1 && (
            <span className={`px-2 opacity-30 ${compact ? "text-2xl" : "text-4xl md:text-5xl"}`} style={{ color: "var(--q-accent)" }}>
              ·
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Botones
   ───────────────────────────────────────────── */

export function PillLink({ href, children, solid = false }: { href: string; children: ReactNode; solid?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-full px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition-transform active:scale-95"
      style={
        solid
          ? { background: "var(--q-accent-deep)", color: "var(--q-paper)", fontFamily: "var(--q-deco)" }
          : { border: "1px solid var(--q-accent)", color: "var(--q-accent-deep)", fontFamily: "var(--q-deco)" }
      }
    >
      {children}
    </a>
  );
}

export function PillButton({ onClick, children, solid = true }: { onClick: () => void; children: ReactNode; solid?: boolean }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-8 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] transition-transform active:scale-95"
      style={
        solid
          ? { background: "var(--q-accent-deep)", color: "var(--q-paper)", fontFamily: "var(--q-deco)" }
          : { border: "1px solid var(--q-accent)", color: "var(--q-accent-deep)", fontFamily: "var(--q-deco)" }
      }
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────
   Bloques que vienen de la invitación impresa
   ───────────────────────────────────────────── */

/** El bloque grande de la fecha: SÁBADO · 05 · de septiembre · a las 7:00 PM. */
export function BigDate({ compact = false }: { compact?: boolean }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex w-full max-w-md items-center justify-center gap-4">
        <span className="h-px flex-1" style={{ background: "var(--q-line)" }} />
        <span
          className="text-[10px] uppercase tracking-[0.35em]"
          style={{ fontFamily: "var(--q-deco)", color: "var(--q-mid)" }}
        >
          {quince.weekday}
        </span>
        <span className="h-px flex-1" style={{ background: "var(--q-line)" }} />
      </div>

      {/* El número es el ancla visual de toda la invitación: en móvil escala con
          el ancho (22vw) para que se coma la pantalla sin desbordarla. */}
      <div className={`flex items-baseline gap-4 ${compact ? "my-2" : "my-5"}`}>
        <span
          className={`leading-none tabular-nums ${compact ? "text-6xl" : "text-[34vw] sm:text-[13rem]"}`}
          style={{ fontFamily: "var(--q-display)", color: "var(--q-accent-deep)" }}
        >
          {quince.day}
        </span>
        <div className="text-left">
          <p className={compact ? "text-xl" : "text-5xl sm:text-6xl"} style={{ fontFamily: "var(--q-script)", color: "var(--q-ink)" }}>
            de {quince.month.toLowerCase()}
          </p>
          <p
            className={`uppercase tracking-[0.25em] ${compact ? "text-[10px]" : "text-sm"}`}
            style={{ fontFamily: "var(--q-deco)", color: "var(--q-faint)" }}
          >
            {quince.year}
          </p>
        </div>
      </div>

      <div className="flex w-full max-w-md items-center justify-center gap-4">
        <span className="h-px flex-1" style={{ background: "var(--q-line)" }} />
        <span
          className={`uppercase tracking-[0.3em] ${compact ? "text-[10px]" : "text-xs sm:text-sm"}`}
          style={{ fontFamily: "var(--q-deco)", color: "var(--q-mid)" }}
        >
          a las {quince.time}
        </span>
        <span className="h-px flex-1" style={{ background: "var(--q-line)" }} />
      </div>
    </motion.div>
  );
}

/** El versículo de la invitación impresa. */
export function Verse({ className = "" }: { className?: string }) {
  return (
    <motion.figure
      className={`mx-auto max-w-md text-center ${className}`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      <blockquote className="text-2xl italic leading-relaxed sm:text-[28px]" style={{ fontFamily: "var(--q-body)", color: "var(--q-ink)" }}>
        “{quince.verse.text}”
      </blockquote>
      <figcaption
        className="mt-6 text-xs uppercase tracking-[0.3em]"
        style={{ fontFamily: "var(--q-deco)", color: "var(--q-accent-deep)" }}
      >
        {quince.verse.ref}
      </figcaption>
    </motion.figure>
  );
}

/** Vestimenta y regalo, como las dos píldoras de la invitación impresa. */
export function DetailPills() {
  const rows = [
    { k: "Código de vestimenta", v: quince.dressCode },
    { k: quince.gift.title, v: quince.gift.desc },
  ];
  return (
    <div className="mx-auto flex max-w-md flex-col gap-3">
      {rows.map((r, i) => (
        <motion.div
          key={r.k}
          className="flex flex-col items-center rounded-full px-6 py-4 text-center"
          style={{ background: "var(--q-paper2)", border: "1px solid var(--q-line)" }}
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[9px] uppercase tracking-[0.3em]" style={{ fontFamily: "var(--q-deco)", color: "var(--q-accent-deep)" }}>
            {r.k}
          </p>
          <p className="mt-1 text-lg leading-tight" style={{ fontFamily: "var(--q-display)", color: "var(--q-ink)" }}>
            {r.v}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/** El salón y la dirección, con botón de mapa. */
export function Venue({ align = "center" }: { align?: "center" | "left" }) {
  const e = quince.party;
  return (
    <motion.div
      className={align === "center" ? "text-center" : "text-left"}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="text-[10px] uppercase tracking-[0.35em]" style={{ fontFamily: "var(--q-deco)", color: "var(--q-accent-deep)" }}>
        Ubicada en
      </p>
      <p className="mt-4 text-2xl leading-snug" style={{ fontFamily: "var(--q-display)" }}>
        {e.place}
      </p>
      <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed" style={{ color: "var(--q-mid)" }}>
        {e.address}
      </p>
      <div className={`mt-6 ${align === "center" ? "" : "text-left"}`}>
        <PillLink href={mapsUrl(e.mapsQuery)}>Cómo llegar</PillLink>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Itinerario · la línea avanza con el scroll
   ───────────────────────────────────────────── */

export function Itinerary() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const height = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.001 });

  return (
    <div ref={ref} className="relative pl-12">
      {/* riel */}
      <div className="absolute bottom-2 left-[15px] top-2 w-px" style={{ background: "var(--q-line)" }} />
      <motion.div
        className="absolute left-[15px] top-2 w-px origin-top"
        style={{ scaleY: height, height: "calc(100% - 16px)", background: "var(--q-accent)" }}
      />
      <div className="flex flex-col gap-8">
        {quince.itinerary.map((item, i) => (
          <motion.div
            key={item.time + item.title}
            className="relative"
            initial={{ opacity: 0, x: 14 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
          >
            <span
              className="absolute -left-12 top-0.5 flex h-8 w-8 items-center justify-center rounded-full text-sm"
              style={{ background: "var(--q-paper)", border: "1px solid var(--q-accent)" }}
            >
              {item.icon}
            </span>
            <p className="text-[10px] uppercase tracking-[0.3em]" style={{ fontFamily: "var(--q-deco)", color: "var(--q-accent-deep)" }}>
              {item.time}
            </p>
            <p className="mt-1 text-lg leading-tight" style={{ fontFamily: "var(--q-display)" }}>
              {item.title}
            </p>
            <p className="mt-0.5 text-xs" style={{ color: "var(--q-mid)" }}>
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Fotos de la sesión
   ───────────────────────────────────────────── */

/**
 * Marco de foto. Con `src` muestra la imagen; sin `src` cae al marco vacío
 * (sigue sirviendo para maquetar antes de tener la foto).
 *
 * `objectPosition` importa: en los encuadres verticales la cara queda arriba,
 * así que el recorte por defecto es hacia el centro-alto.
 */
export function PhotoFrame({
  src,
  alt = "",
  caption,
  year,
  className = "",
  shape = "rect",
  objectPosition = "center 30%",
  priority = false,
  sizes = "(min-width: 640px) 33vw, 50vw",
}: {
  src?: string;
  alt?: string;
  caption?: string;
  year?: string;
  className?: string;
  shape?: "rect" | "arch" | "circle";
  objectPosition?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const radius = shape === "arch" ? "999px 999px 8px 8px" : shape === "circle" ? "999px" : "8px";
  return (
    <motion.div
      className={`relative flex flex-col items-center justify-end overflow-hidden ${className}`}
      style={{
        borderRadius: radius,
        border: "1px solid var(--q-line)",
        background:
          "linear-gradient(150deg, color-mix(in srgb, var(--q-accent) 22%, var(--q-paper)) 0%, var(--q-paper2) 55%, color-mix(in srgb, var(--q-accent) 12%, var(--q-paper)) 100%)",
      }}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" style={{ objectPosition }} />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-3xl opacity-25">✦</span>
      )}
      {(caption || year) && (
        <div className="relative w-full px-3 pb-3 pt-8 text-center" style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--q-ink) 45%, transparent), transparent)" }}>
          {caption && <p className="text-[10px] leading-tight text-white/95">{caption}</p>}
          {year && <p className="text-[8px] uppercase tracking-[0.25em] text-white/70">{year}</p>}
        </div>
      )}
    </motion.div>
  );
}

export function GalleryGrid({ shape = "rect" }: { shape?: "rect" | "arch" | "circle" }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {quince.gallery.map((g) => (
        <PhotoFrame
          key={g.src}
          src={g.src}
          alt={g.alt}
          objectPosition={g.pos}
          /* las horizontales cruzan la fila: en 3:4 se perdería la escena.
             El arco sólo se ve bien en vertical, así que ahí caen a recto. */
          shape={g.v ? shape : shape === "arch" ? "rect" : shape}
          sizes={g.v ? "(min-width: 640px) 33vw, 50vw" : "(min-width: 640px) 66vw, 100vw"}
          className={g.v ? "aspect-[3/4]" : "col-span-2 aspect-[3/2]"}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   RSVP · guarda contra la API de invitados
   ───────────────────────────────────────────── */

/**
 * Confirmación de asistencia.
 *
 * - Con `slug` (la invitación real de un invitado) manda la respuesta a
 *   `POST /api/rsvp/[slug]` y deja registrado cuántos lugares se ocupan.
 * - Sin `slug` (la vista de muestra en `/`) el modal funciona igual pero no
 *   guarda nada: sirve para revisar cómo se ve.
 *
 * `initialConfirmed` viene de la BD: 1 sí, 0 no, null sin responder. Si el
 * invitado ya respondió, se le enseña su respuesta y puede cambiarla.
 */
export function RSVP({
  slug,
  seats = 4,
  initialConfirmed = null,
  confettiColors,
}: {
  slug?: string;
  seats?: number;
  initialConfirmed?: 1 | 0 | null;
  confettiColors?: string[];
}) {
  const [open, setOpen] = useState(false);
  const [going, setGoing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<1 | 0 | null>(initialConfirmed);
  const [done, setDone] = useState(false);

  const colors = confettiColors ?? ["#ffa2b9", "#ffb2c5", "#ffc2d1", "#b95571", "#ffffff"];

  const celebrate = () => {
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 }, colors });
    setTimeout(() => confetti({ particleCount: 50, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors }), 200);
    setTimeout(() => confetti({ particleCount: 50, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors }), 350);
  };

  const confirm = async () => {
    if (going === null) return;
    const asiste = going > 0;
    setError(null);

    if (slug) {
      setSaving(true);
      try {
        const res = await fetch(`/api/rsvp/${slug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            confirmed: asiste,
            attending: going,
            notes: asiste ? `Asistirán ${going} de ${seats} lugares` : "No podrá asistir",
          }),
        });
        if (!res.ok) throw new Error("no se pudo guardar");
      } catch {
        setSaving(false);
        setError("No se pudo guardar. Revisa tu conexión e inténtalo otra vez.");
        return;
      }
      setSaving(false);
    }

    setAnswer(asiste ? 1 : 0);
    setDone(true);
    if (asiste) celebrate();
  };

  /* Etiqueta del botón según lo que ya haya respondido este invitado. */
  const cta =
    answer === 1 ? "Cambiar mi respuesta" : answer === 0 ? "Cambiar mi respuesta" : "Confirmar asistencia";

  return (
    <div className="text-center">
      <p className="mx-auto max-w-md text-sm leading-relaxed" style={{ color: "var(--q-mid)" }}>
        {answer === 1 ? (
          <>Tu lugar ya está apartado. ¡Nos vemos el {quince.dateShort}!</>
        ) : answer === 0 ? (
          <>Ya avisaste que no podrás acompañarnos. Si algo cambia, puedes decírnoslo aquí.</>
        ) : (
          <>
            Nos encantaría contar contigo. Confirma tu asistencia antes del{" "}
            <strong style={{ color: "var(--q-ink)" }}>{quince.rsvpDeadline}</strong>.
          </>
        )}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <PillButton
          onClick={() => {
            setDone(false);
            setError(null);
            setOpen(true);
          }}
        >
          {cta}
        </PillButton>
        <PillLink href={calendarUrl()}>Agregar al calendario</PillLink>
      </div>

      <p className="mt-8 text-[10px] uppercase tracking-[0.3em]" style={{ fontFamily: "var(--q-deco)", color: "var(--q-faint)" }}>
        {quince.hashtag}
      </p>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-5"
            style={{ background: "rgba(20,14,24,0.55)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="w-full max-w-sm rounded-2xl px-7 py-9 text-center"
              style={{ background: "var(--q-paper)", border: "1px solid var(--q-line)" }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              {!done ? (
                <>
                  <p className="text-[10px] uppercase tracking-[0.35em]" style={{ fontFamily: "var(--q-deco)", color: "var(--q-accent-deep)" }}>
                    Confirmación
                  </p>
                  <p className="mt-4 text-2xl" style={{ fontFamily: "var(--q-display)" }}>
                    ¿Cuántos asisten?
                  </p>
                  <p className="mt-2 text-xs" style={{ color: "var(--q-mid)" }}>
                    Tienes {seats} {seats === 1 ? "lugar" : "lugares"} reservados.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {Array.from({ length: seats + 1 }, (_, n) => (
                      <button
                        key={n}
                        onClick={() => setGoing(n)}
                        className="h-11 w-11 rounded-full text-sm transition-transform active:scale-95"
                        style={
                          going === n
                            ? { background: "var(--q-accent-deep)", color: "var(--q-paper)", border: "1px solid var(--q-accent-deep)" }
                            : { border: "1px solid var(--q-line)", color: "var(--q-mid)" }
                        }
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  {error && (
                    <p className="mt-5 text-xs" style={{ color: "#b3261e" }}>
                      {error}
                    </p>
                  )}
                  <div className="mt-8 flex flex-col items-center gap-3">
                    <PillButton onClick={confirm}>
                      {saving ? "Guardando…" : going === 0 ? "No podré asistir" : "Confirmar"}
                    </PillButton>
                    <button className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--q-faint)" }} onClick={() => setOpen(false)}>
                      Cerrar
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-4xl">{going === 0 ? "🤍" : "🎉"}</span>
                  <p className="mt-4 text-2xl" style={{ fontFamily: "var(--q-display)" }}>
                    {going === 0 ? "Gracias por avisar" : "¡Nos vemos ahí!"}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed" style={{ color: "var(--q-mid)" }}>
                    {going === 0
                      ? "Te vamos a extrañar en la fiesta."
                      : `Quedan apuntados ${going} ${going === 1 ? "lugar" : "lugares"} para el ${quince.dateShort}.`}
                  </p>
                  {!slug && (
                    <p className="mt-5 text-[9px] uppercase tracking-[0.25em]" style={{ fontFamily: "var(--q-deco)", color: "var(--q-faint)" }}>
                      Vista de muestra · no se guardó nada
                    </p>
                  )}
                  <div className="mt-6">
                    <PillButton onClick={() => setOpen(false)} solid={false}>
                      Cerrar
                    </PillButton>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Pie
   ───────────────────────────────────────────── */

export function Footer({ note }: { note?: string }) {
  return (
    <footer className="border-t px-6 py-12 text-center" style={{ borderColor: "var(--q-line)" }}>
      {/* la despedida: nombre del salón y dirección, con enlace al mapa */}
      <p className="mx-auto max-w-sm text-lg leading-relaxed" style={{ fontFamily: "var(--q-display)", color: "var(--q-ink)" }}>
        Te espero en mi fiesta, ubicada en{" "}
        <a
          href={mapsUrl(quince.party.mapsQuery)}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 transition-opacity hover:opacity-70"
          style={{ color: "var(--q-accent-deep)" }}
        >
          {quince.party.place}
        </a>
        .
      </p>
      <p className="mx-auto mt-3 max-w-xs text-xs leading-relaxed" style={{ color: "var(--q-mid)" }}>
        {quince.party.address}
      </p>

      <p className="mt-9 text-5xl leading-none" style={{ fontFamily: "var(--q-script)", color: "var(--q-accent-deep)" }}>
        {quince.name}
      </p>
      <p className="mt-3 text-[10px] uppercase tracking-[0.35em]" style={{ fontFamily: "var(--q-deco)", color: "var(--q-faint)" }}>
        {quince.dateShort} · {quince.city}
      </p>
      {note && (
        <p className="mx-auto mt-6 max-w-sm text-[10px] leading-relaxed" style={{ color: "var(--q-faint)" }}>
          {note}
        </p>
      )}
    </footer>
  );
}

/* ─────────────────────────────────────────────
   Utilidades de animación
   ───────────────────────────────────────────── */

/** Revela un texto letra por letra. */
export function LetterReveal({
  text,
  delay = 0,
  className = "",
  style = {},
}: {
  text: string;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span className={className} style={style} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: delay + i * 0.045, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}

/** Marca el momento en que el componente ya montó (para animaciones de entrada). */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
