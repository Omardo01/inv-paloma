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
import { PhotoHero, Lily, LilyBand, CornerCluster, Star, StarField, StarRain } from "@/components/quince-deco";
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
  ReservedColors,
  RSVP,
  Footer,
  LetterReveal,
  type Theme,
} from "@/components/quince-kit";
import { quince, messagePhoto } from "@/lib/quince";

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
      {/* estrellitas cayendo sobre toda la invitación */}
      <StarRain count={16} />

      {/* ── Portada ── */}
      <PhotoHero
        overlay="linear-gradient(to bottom, rgba(95,45,65,0.26) 0%, rgba(130,60,85,0.04) 28%, rgba(110,45,70,0.28) 60%, rgba(150,70,100,0.4) 80%, rgba(255,194,209,0.65) 92%, var(--q-bg) 100%)"
        contentClassName="pb-56 sm:pb-60"
        /* la portada va limpia: sólo la foto y los lirios */
        decoration={<LilyBand className="-bottom-2 z-10" height={185} />}
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
            src={messagePhoto.src}
            alt={messagePhoto.alt}
            shape="arch"
            sizes="208px"
            className="h-72 w-52 shrink-0"
          />
          <div>
            {/* sin título: el mensaje de Yesenia es el que habla */}
            <p className="text-xl leading-relaxed sm:text-2xl" style={{ fontFamily: theme.body, color: theme.ink }}>
              {quince.message}
            </p>
            {/* la firma va centrada aunque el bloque de texto sea de bandera */}
            <p className="mt-6 text-center text-4xl" style={{ fontFamily: theme.script, color: theme.accentDeep }}>
              {quince.name}
            </p>
            <motion.p
              className="mx-auto mt-5 max-w-sm text-center text-lg leading-relaxed sm:text-xl"
              style={{ fontFamily: theme.body, color: theme.ink }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              {quince.parentsLine}
            </motion.p>
          </div>
        </div>
      </Section>

      {/* ── Versículo ──
          Las estrellas rodean el texto sin taparlo: las grandes van a las
          esquinas y las chicas se cuelan entre los renglones. */}
      <Section alt className="relative overflow-hidden">
        <StarField count={8} opacity={0.28} />
        <Star i={2} size={96} className="absolute -left-4 top-6 opacity-70" rotate={-12} float />
        <Star i={0} size={72} className="absolute -right-3 top-16 opacity-60" rotate={14} float delay={0.3} />
        <Star i={3} size={40} className="absolute left-10 bottom-10 opacity-65" rotate={8} float delay={0.6} />
        <Star i={4} size={34} className="absolute right-12 bottom-6 opacity-60" rotate={-16} float delay={0.9} />
        <Star i={1} size={26} className="absolute left-1/2 top-2 opacity-55" rotate={20} float delay={1.2} />
        <Verse className="relative z-10" />
      </Section>

      {/* ── Dónde ── */}
      <Section className="relative overflow-hidden pb-32">
        <SectionTitle kicker="Te espero en">Mi fiesta</SectionTitle>
        <Venue />
        <LilyBand className="-bottom-6 opacity-85" height={140} />
      </Section>

      {/* ── Vestimenta, regalo y colores reservados ── */}
      <Section alt>
        <SectionTitle kicker="Toma nota">Para ese día</SectionTitle>
        <DetailPills />
        <div className="mt-12">
          <ReservedColors />
        </div>
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
