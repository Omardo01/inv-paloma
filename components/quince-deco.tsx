"use client";

/**
 * Decoraciones de los XV de Yesenia.
 *
 * Las estrellas y los lirios salen de las dos imágenes que mandó la familia,
 * ya recortadas (fondo removido) en `public/quince/deco/`. Aquí sólo se
 * colocan, se animan y se reciclan entre plantillas.
 */

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { quince } from "@/lib/quince";

const STARS = quince.deco.stars;
const LILIES = quince.deco.lilies;

/* ─────────────────────────────────────────────
   Piezas sueltas
   ───────────────────────────────────────────── */

type StickerProps = {
  /** índice dentro del set (0-4) */
  i?: number;
  size: number;
  className?: string;
  style?: CSSProperties;
  rotate?: number;
  opacity?: number;
  /** flota suavemente en el sitio */
  float?: boolean;
  delay?: number;
  priority?: boolean;
};

function Sticker({
  src,
  alt,
  size,
  className = "",
  style = {},
  rotate = 0,
  opacity = 1,
  float = false,
  delay = 0,
  priority = false,
}: StickerProps & { src: string; alt: string }) {
  const inner = (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className="h-full w-full object-contain"
      style={{ filter: "drop-shadow(0 6px 14px rgba(180,90,120,0.16))" }}
    />
  );
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      style={{ width: size, height: size, opacity, ...style }}
      initial={{ opacity: 0, scale: 0.7, rotate: rotate - 12 }}
      animate={
        float
          ? { opacity, scale: 1, rotate, y: [0, -10, 0] }
          : { opacity, scale: 1, rotate }
      }
      transition={
        float
          ? {
              opacity: { duration: 0.8, delay },
              scale: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
              rotate: { duration: 0.8, delay },
              y: { repeat: Infinity, duration: 5 + (delay % 2), ease: "easeInOut", delay },
            }
          : { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {inner}
    </motion.div>
  );
}

export function Star(props: StickerProps) {
  const i = (props.i ?? 0) % STARS.length;
  return <Sticker {...props} src={STARS[i]} alt="" />;
}

export function Lily(props: StickerProps) {
  const i = (props.i ?? 0) % LILIES.length;
  return <Sticker {...props} src={LILIES[i]} alt="" />;
}

/* ─────────────────────────────────────────────
   Lluvia de estrellitas de fondo
   ───────────────────────────────────────────── */

type Speck = { left: number; top: number; size: number; i: number; dur: number; delay: number };

export function StarField({ count = 14, opacity = 0.5 }: { count?: number; opacity?: number }) {
  const [specks, setSpecks] = useState<Speck[]>([]);

  /* se generan en el cliente para que el HTML del servidor y el del navegador
     coincidan (si no, hydration mismatch por los aleatorios). */
  useEffect(() => {
    setSpecks(
      Array.from({ length: count }, (_, k) => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 14 + Math.random() * 46,
        i: k % STARS.length,
        dur: 4 + Math.random() * 5,
        delay: Math.random() * 3,
      })),
    );
  }, [count]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {specks.map((s, k) => (
        <motion.div
          key={k}
          className="absolute"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, opacity, opacity * 0.45, opacity], scale: 1, y: [0, -14, 0] }}
          transition={{
            opacity: { duration: s.dur, repeat: Infinity, delay: s.delay },
            scale: { duration: 1, delay: s.delay },
            y: { duration: s.dur + 2, repeat: Infinity, ease: "easeInOut", delay: s.delay },
          }}
        >
          <Image src={STARS[s.i]} alt="" width={80} height={80} className="h-full w-full object-contain" />
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Guirnaldas: filas de lirios o estrellas al pie / a los lados
   ───────────────────────────────────────────── */

/** Franja de lirios al pie de una sección, como la de la referencia. */
export function LilyBand({
  className = "",
  height = 190,
  opacity = 1,
  flip = false,
}: {
  className?: string;
  height?: number;
  opacity?: number;
  flip?: boolean;
}) {
  const items = [
    { i: 2, size: 1.0, x: "2%", y: 0.18, rot: -8 },
    { i: 0, size: 0.72, x: "20%", y: 0.34, rot: 12 },
    { i: 4, size: 0.55, x: "36%", y: 0.1, rot: -14 },
    { i: 1, size: 0.9, x: "52%", y: 0.3, rot: 6 },
    { i: 3, size: 0.66, x: "72%", y: 0.12, rot: -6 },
    { i: 2, size: 0.82, x: "86%", y: 0.32, rot: 16 },
  ];
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 overflow-hidden ${className}`}
      style={{ height, opacity, transform: flip ? "scaleY(-1)" : undefined }}
    >
      {items.map((it, k) => (
        <motion.div
          key={k}
          className="absolute"
          style={{ left: it.x, top: `${it.y * 100}%`, width: height * it.size, height: height * it.size }}
          initial={{ opacity: 0, y: 26, rotate: it.rot - 10 }}
          whileInView={{ opacity: 1, y: 0, rotate: it.rot }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: k * 0.09, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image src={LILIES[it.i]} alt="" width={400} height={400} className="h-full w-full object-contain" />
        </motion.div>
      ))}
    </div>
  );
}

/** Ramillete de esquina con dos lirios y una estrella. */
export function CornerCluster({
  className = "",
  size = 170,
  mirror = false,
  delay = 0,
}: {
  className?: string;
  size?: number;
  mirror?: boolean;
  delay?: number;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      style={{ width: size, height: size, transform: mirror ? "scaleX(-1)" : undefined }}
    >
      <Lily i={0} size={size * 0.62} className="absolute left-0 top-0" rotate={-12} delay={delay} />
      <Lily i={3} size={size * 0.46} className="absolute" style={{ left: size * 0.44, top: size * 0.3 }} rotate={14} delay={delay + 0.15} />
      <Star i={3} size={size * 0.2} className="absolute" style={{ left: size * 0.3, top: size * 0.66 }} rotate={-8} delay={delay + 0.3} float />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Portada con foto
   ───────────────────────────────────────────── */

/**
 * Portada a pantalla completa: la foto se queda fija (parallax) y la invitación
 * sube por encima al hacer scroll — la estructura que pidió la familia.
 *
 * Con `src = null` cae a un degradado rosa con marco de muestra, para maquetar
 * portadas que todavía no tienen foto.
 */
export function PhotoHero({
  children,
  src = quince.heroPhoto,
  /* el velo cumple dos cosas: da contraste al nombre (banda oscura a media
     altura) y funde la foto con el fondo de la invitación (rosa al final). */
  overlay = "linear-gradient(to bottom, rgba(95,45,65,0.28) 0%, rgba(130,60,85,0.04) 28%, rgba(110,45,70,0.30) 62%, rgba(150,70,100,0.42) 82%, rgba(255,178,197,0.6) 93%, var(--q-bg) 100%)",
  className = "",
  contentClassName = "pb-32 sm:pb-36",
  decoration,
}: {
  children: ReactNode;
  src?: string | null;
  overlay?: string;
  className?: string;
  /** separación del bloque de título respecto al pie (para dejar sitio a la deco) */
  contentClassName?: string;
  decoration?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} className={`relative flex min-h-dvh flex-col justify-end overflow-hidden ${className}`}>
      {/* foto (o marco de muestra) */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        {src ? (
          <Image src={src} alt={`${quince.name} — XV años`} fill priority className="object-cover object-top" />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background:
                "linear-gradient(165deg, #fae8ed 0%, #ffc2d1 42%, #ffa2b9 72%, #f8b6c6 100%)",
            }}
          >
            <div className="text-center opacity-45">
              <p className="text-7xl">📷</p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.35em]" style={{ fontFamily: "var(--q-deco)", color: "#7d3d52" }}>
                Aquí va la foto de la sesión
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* velo que funde la foto con el fondo de la invitación */}
      <div className="absolute inset-0" style={{ background: overlay }} />

      {decoration}

      {/* título */}
      <motion.div className={`relative z-10 px-6 text-center ${contentClassName}`} style={{ opacity: fade }}>
        {children}
      </motion.div>

      {/* crédito al pie — sólo si la foto lo exige (hoy ya no) */}
      {src && quince.heroPhotoCredit && (
        <p className="absolute bottom-1 right-2 z-10 text-[7px] uppercase tracking-[0.15em] text-white/45">
          {quince.heroPhotoCredit}
        </p>
      )}

      {/* indicador de scroll */}
      <motion.div
        className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-1.5"
        style={{ opacity: fade }}
        animate={{ y: [0, 7, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
      >
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/85" style={{ fontFamily: "var(--q-deco)" }}>
          Desliza
        </span>
        <span className="text-white/85">↓</span>
      </motion.div>
    </section>
  );
}
