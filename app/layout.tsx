import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Serif_Display, Marcellus, Great_Vibes, Inter } from "next/font/google";
import "./globals.css";
import { quince } from "@/lib/quince";

/* Sólo las cuatro fuentes del tema «Jardín de lirios» (la invitación) más Inter
   para el panel. Cada una se expone como CSS var y el tema las consume. */
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-dm-serif", display: "swap" });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-great-vibes", display: "swap" });
const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-marcellus", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const fontVars = [dmSerif.variable, greatVibes.variable, marcellus.variable, cormorant.variable, inter.variable].join(" ");

/* URL base para que las previews de WhatsApp reciban la imagen en absoluto. */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const title = `${quince.name} · Mis XV años`;
const description = `${quince.inviteLine} ${quince.dateLong}, ${quince.time} · ${quince.party.place}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "es_MX",
    siteName: title,
    images: [{ url: quince.heroPhoto ?? "/quince/fotos/portada.webp", width: 1333, height: 2000, alt: title }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [quince.heroPhoto ?? "/quince/fotos/portada.webp"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${fontVars} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
