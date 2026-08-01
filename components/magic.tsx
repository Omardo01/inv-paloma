"use client";

/**
 * Las dos utilidades de animación que usa la invitación. Vienen del kit grande
 * del proyecto de la boda; aquí sólo se conserva lo que se ocupa.
 */

import { motion } from "motion/react";
import { useEffect, useState, type ReactNode, type CSSProperties } from "react";

/** Aparición con desenfoque, al entrar en pantalla. */
export function BlurFade({
  children,
  delay = 0,
  className = "",
  y = 20,
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/** Cuenta regresiva a una fecha ISO; se actualiza cada segundo. */
export function useCountdown(target: string) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const u = () => {
      const s = Math.max(0, Math.floor((new Date(target).getTime() - Date.now()) / 1000));
      setT({ d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 });
    };
    u();
    const id = setInterval(u, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}
