"use client";

/**
 * La invitación de XV de Yesenia — tema «Jardín de lirios».
 *
 * Un solo componente para los dos usos:
 * - `/` la vista de muestra (sin invitado, el RSVP no guarda);
 * - `/i/[slug]` la invitación real, con el nombre del invitado, sus lugares y
 *   el RSVP conectado a la base.
 */

import { motion } from "motion/react";
import { BlurFade } from "@/components/magic";
import { PhotoHero, Lily, LilyBand, CornerCluster, Star, StarField } from "@/components/quince-deco";
import {
  ThemeScope,
  ScrollProgress,
  Section,
  SectionTitle,
  Divider,
  Countdown,
  BigDate,
  Verse,
  DetailPills,
  Venue,
  Itinerary,
  GalleryGrid,
  PhotoFrame,
  MusicToggle,
  RSVP,
  Footer,
  LetterReveal,
  type Theme,
} from "@/components/quince-kit";
import { quince } from "@/lib/quince";

const theme: Theme = {
  bg: "#fffbfc",
  paper: "#ffffff",
  paper2: "#fae8ed",
  ink: "#4b2b34",
  mid: "#8d6270",
  faint: "#c9a0ad",
  line: "#f6e0e7",
  accent: "#ffb2c5",
  accentDeep: "#b95571",
  display: "var(--font-dm-serif)",
  script: "var(--font-great-vibes)",
  body: "var(--font-serif)",
  deco: "var(--font-marcellus)",
};

const CONFETTI = ["#ffa2b9", "#ffb2c5", "#ffc2d1", "#b95571", "#ffffff"];

export default function Invitation({
  guestName,
  slug,
  seats = 4,
  initialConfirmed = null,
}: {
  guestName?: string;
  slug?: string;
  seats?: number;
  initialConfirmed?: 1 | 0 | null;
}) {
  return (
    <ThemeScope theme={theme}>
      <ScrollProgress />
      <MusicToggle />

      {/* ── Portada ── */}
      <PhotoHero
        overlay="linear-gradient(to bottom, rgba(95,45,65,0.26) 0%, rgba(130,60,85,0.04) 28%, rgba(110,45,70,0.28) 60%, rgba(150,70,100,0.4) 80%, rgba(255,194,209,0.65) 92%, var(--q-bg) 100%)"
        contentClassName="pb-56 sm:pb-60"
        decoration={
          <>
            {/* estrellas discretas: aquí los lirios de abajo son los
                protagonistas y no deben competir. */}
            <StarField count={10} opacity={0.4} />
            <Star i={0} size={112} className="absolute left-3 top-14 z-10" rotate={-14} opacity={0.85} float delay={0.4} />
            <Star i={2} size={74} className="absolute right-5 top-24 z-10" rotate={12} opacity={0.8} float delay={0.7} />
            <Star i={3} size={30} className="absolute left-1/3 top-9 z-10" rotate={-6} float delay={0.9} />
            <Star i={4} size={24} className="absolute right-1/4 top-48 z-10" rotate={18} float delay={1.1} />
            <LilyBand className="-bottom-2 z-10" height={185} />
          </>
        }
      >
        <BlurFade>
          <p className="text-[11px] uppercase tracking-[0.5em] text-white/90 drop-shadow" style={{ fontFamily: theme.deco }}>
            Mis XV años
          </p>
        </BlurFade>

        <h1
          className="mt-3 text-[21vw] leading-[0.9] text-white sm:text-8xl md:text-9xl"
          style={{ fontFamily: theme.script, textShadow: "0 6px 26px rgba(90,35,55,0.35)" }}
        >
          <LetterReveal text={quince.name} delay={0.35} />
        </h1>

        <BlurFade delay={1.1}>
          <div className="mx-auto mt-5 flex max-w-xs items-center gap-3">
            <span className="h-px flex-1 bg-white/60" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-white/90" style={{ fontFamily: theme.deco }}>
              {quince.dateShort}
            </span>
            <span className="h-px flex-1 bg-white/60" />
          </div>
        </BlurFade>
      </PhotoHero>

      {/* ── Invitación ── */}
      <Section className="relative overflow-hidden pb-32">
        <CornerCluster className="-left-10 -top-6 opacity-50" size={150} />
        <CornerCluster className="-right-10 -top-6 opacity-50" size={150} mirror delay={0.2} />

        {/* saludo personalizado: sólo en la invitación de un invitado */}
        {guestName && (
          <motion.p
            className="mb-7 text-center text-[11px] uppercase tracking-[0.35em]"
            style={{ fontFamily: theme.deco, color: theme.accentDeep }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            Para {guestName}
          </motion.p>
        )}

        <motion.p
          className="mx-auto mt-6 max-w-md text-center text-[18px] leading-relaxed"
          style={{ fontFamily: theme.display, color: theme.ink }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {quince.inviteLine}
        </motion.p>
        <Divider className="my-10" />
        <BigDate />
        <LilyBand className="-bottom-4 opacity-90" height={150} />
      </Section>

      {/* ── Cuenta regresiva ── */}
      <Section alt>
        <p className="mb-8 text-center text-[10px] uppercase tracking-[0.4em]" style={{ fontFamily: theme.deco, color: theme.accentDeep }}>
          Faltan
        </p>
        <Countdown />
      </Section>

      {/* ── Mensaje ── */}
      <Section className="relative overflow-hidden">
        <Lily i={4} size={110} className="absolute -right-4 top-4 opacity-60" rotate={12} float />
        <div className="flex flex-col items-center gap-9 sm:flex-row sm:items-start sm:gap-10">
          <PhotoFrame
            src={quince.photosVestido[1].src}
            alt={quince.photosVestido[1].alt}
            shape="arch"
            sizes="208px"
            className="h-72 w-52 shrink-0"
          />
          <div>
            <SectionTitle kicker="Unas palabras" align="left">
              Hoy cumplo quince
            </SectionTitle>
            <p className="text-[15px] leading-relaxed" style={{ color: theme.mid }}>
              {quince.message}
            </p>
            <p className="mt-6 text-4xl" style={{ fontFamily: theme.script, color: theme.accentDeep }}>
              {quince.name}
            </p>
          </div>
        </div>
      </Section>

      {/* ── Versículo ── */}
      <Section alt className="relative overflow-hidden">
        <Star i={2} size={54} className="absolute left-8 top-8 opacity-50" rotate={-10} float />
        <Verse />
      </Section>

      {/* ── Dónde ── */}
      <Section className="relative overflow-hidden pb-32">
        <SectionTitle kicker="Te espero">La fiesta</SectionTitle>
        <Venue />
        <LilyBand className="-bottom-6 opacity-85" height={140} />
      </Section>

      {/* ── Vestimenta y regalo ── */}
      <Section alt>
        <SectionTitle kicker="Dos detalles">Para ese día</SectionTitle>
        <DetailPills />
      </Section>

      {/* ── Itinerario ── */}
      <Section>
        <SectionTitle kicker="Programa del día">Itinerario</SectionTitle>
        <Itinerary />
      </Section>

      {/* ── Galería ── */}
      <Section alt>
        <SectionTitle kicker="Mis recuerdos">Galería</SectionTitle>
        <GalleryGrid shape="arch" />
      </Section>

      {/* ── RSVP ── */}
      <Section className="relative overflow-hidden pb-36">
        <SectionTitle kicker="Confirma tu lugar">¿Me acompañas?</SectionTitle>
        <RSVP slug={slug} seats={seats} initialConfirmed={initialConfirmed} confettiColors={CONFETTI} />
        <LilyBand className="-bottom-8" height={160} />
      </Section>

      <Footer />
    </ThemeScope>
  );
}
