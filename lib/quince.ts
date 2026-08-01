/**
 * Datos de la invitación de XV años.
 *
 * Mismo rol que `lib/wedding.ts` en la boda: una sola fuente de verdad que todas
 * las opciones de tema consumen, para que cambiar un nombre o una hora no
 * implique tocar N páginas.
 *
 * CONFIRMADO — la invitación impresa (nombre, fecha, hora, salón, ubicación,
 * vestimenta, mensaje y versículo), más el itinerario, la lluvia de sobres y la
 * sesión de fotos que mandó la familia después.
 * PENDIENTE — marcado con `pending: true` o comentario: padres, padrinos,
 * corte, el vals y la canción de la invitación.
 */
export const quince = {
  /* ── la festejada ── */
  name: "Yesenia",
  fullName: "Yesenia", // pendiente: apellidos
  initials: "XV",
  monogram: "Y",

  /* ── la fecha ── */
  // sábado 5 de septiembre de 2026, 7:00 PM
  date: new Date("2026-09-05T19:00:00"),
  iso: "2026-09-05T19:00:00",
  dateLabel: "Cinco de Septiembre",
  dateLong: "Sábado 5 de septiembre de 2026",
  dateShort: "05.09.2026",
  weekday: "Sábado",
  day: "05",
  month: "Septiembre",
  year: "2026",
  time: "7:00 PM",
  city: "El Cedro, Tabasco",

  /* ── los eventos ── */
  /** Lo confirmado: una sola recepción a las 7:00 PM. */
  events: [
    {
      title: "La fiesta",
      time: "7:00 PM",
      place: "Salón de Eventos Aranlú",
      address: "Callejón Los Montejo, Calle El Camarón, El Cedro, 86247",
      mapsQuery: "Salón de Eventos Aranlú El Cedro Tabasco",
      icon: "🥂",
    },
  ],
  /** Sin misa confirmada todavía; se deja el hueco para no inventar. */
  mass: {
    title: "Misa",
    time: "—",
    place: "Por confirmar",
    address: "",
    mapsQuery: "",
    pending: true,
  },
  party: {
    title: "La fiesta",
    time: "7:00 PM",
    place: "Salón de Eventos Aranlú",
    address: "Callejón Los Montejo, Calle El Camarón, El Cedro, 86247",
    mapsQuery: "Salón de Eventos Aranlú El Cedro Tabasco",
  },

  /* ── quiénes la acompañan — PENDIENTE ── */
  peoplePending: true,
  parents: [
    { role: "Papá", name: "Por confirmar" },
    { role: "Mamá", name: "Por confirmar" },
  ],
  godparents: [
    { role: "Padrinos de honor", names: "Por confirmar" },
    { role: "Padrinos de vals", names: "Por confirmar" },
  ],
  chambelanes: [] as readonly string[],

  /* ── el día, hora por hora — CONFIRMADO ──
     Ojo: la recepción abre 6:45 PM, quince minutos antes de la hora que trae la
     invitación impresa, para que la entrada de Yesenia caiga en punto. */
  itinerary: [
    { time: "6:45 PM", title: "Recepción", desc: "Bienvenida en el salón", icon: "🥂" },
    { time: "7:00 PM", title: "Entrada y vals", desc: "La presentación de Yesenia", icon: "💃" },
    { time: "8:00 PM", title: "Brindis", desc: "Unas palabras", icon: "🥂" },
    { time: "8:30 PM", title: "Cena", desc: "Servicio a la mesa", icon: "🍽️" },
    { time: "9:30 PM", title: "Show de la quinceañera", desc: "El número de Yesenia", icon: "✨" },
  ],

  /* ── etiqueta ── */
  dressCode: "Formal",
  dressCodeNotes: {
    ellas: "Vestido largo o midi · evitar rosa (reservado para la festejada)",
    ellos: "Traje o guayabera formal · corbata opcional",
  },
  /** La paleta que eligió la festejada. */
  palette: [
    { name: "Amaranth", hex: "#ffa2b9" },
    { name: "Cherry blossom", hex: "#ffb2c5" },
    { name: "Pink", hex: "#ffc2d1" },
    { name: "Mimi pink", hex: "#fdd5df" },
    { name: "Lavender blush", hex: "#fae8ed" },
  ],

  /* ── regalo ──
     `gift` va en las píldoras, donde el texto tiene que caber en una línea;
     `gifts` es la versión de tarjeta, con la frase completa. */
  gift: {
    icon: "💌",
    title: "Lluvia de sobres",
    desc: "Un sobre con tu cariño",
  },
  gifts: [
    {
      icon: "💌",
      title: "Lluvia de sobres",
      desc: "Si quieres tener un detalle conmigo, un sobre es más que suficiente.",
    },
  ],

  /* ── textos de la invitación impresa ── */
  inviteLine: "Te invito a celebrar mis quince años rodeada de gente que amo.",
  message:
    "Hace 15 años Dios me puso aquí para brillar, hoy soy la estrella de mi propia historia, y quiero que ustedes, mi familia y mis amigos, me acompañen a celebrar mi fiesta de XV años.",
  verse: {
    text: "Engañosa es la gracia, y vana la hermosura; la mujer que teme a Jehová, esa será alabada.",
    ref: "Proverbios 31:30",
  },

  /* ── detalles ── */
  waltz: { title: "Por confirmar", artist: "" },
  /** La canción que eligió Yesenia. `start` salta el silencio del principio
   *  (1.73 s medidos con `ffmpeg silencedetect`). */
  music: {
    title: "Forever Star",
    artist: "Yihao Zhang",
    src: "/quince/cancion.mp3",
    start: 1.73,
  },
  rsvpDeadline: "22 de agosto de 2026",
  hashtag: "#YeseniaXV",

  /* ── decoraciones recortadas (fondo removido) ── */
  deco: {
    stars: [
      "/quince/deco/estrella-1.png",
      "/quince/deco/estrella-2.png",
      "/quince/deco/estrella-3.png",
      "/quince/deco/estrella-4.png",
      "/quince/deco/estrella-5.png",
    ],
    lilies: [
      "/quince/deco/lirio-1.png",
      "/quince/deco/lirio-2.png",
      "/quince/deco/lirio-3.png",
      "/quince/deco/lirio-4.png",
      "/quince/deco/lirio-5.png",
    ],
  },

  /* ── sesión de fotos ──
     Originales en `public/quince/Fotos yesi/` (no se sirven: pesan 6–8 MB cada
     una). Lo que usa el sitio son las versiones webp de `public/quince/fotos/`,
     lado largo 1600 px (2000 px la portada). Para regenerarlas ver
     `public/quince/CREDITOS.md`. */
  heroPhoto: "/quince/fotos/portada.webp" as string | null,
  /** Ya no hay foto de muestra que acreditar. */
  heroPhotoCredit: null as string | null,

  /** Bloque de vestido rosa: la sesión formal de XV. */
  photosVestido: [
    { src: "/quince/fotos/vestido-01.webp", v: true, alt: "Yesenia con el ramo bajo la pérgola" },
    { src: "/quince/fotos/vestido-02.webp", v: true, alt: "Retrato con la corona y el ramo" },
    { src: "/quince/fotos/vestido-03.webp", v: true, alt: "Yesenia bajando las escaleras" },
    { src: "/quince/fotos/vestido-04.webp", v: false, alt: "Frente al espejo del tocador" },
    { src: "/quince/fotos/vestido-05.webp", v: true, alt: "El vestido extendido en el jardín" },
    { src: "/quince/fotos/vestido-06.webp", v: false, alt: "Entre los dos caballos" },
    { src: "/quince/fotos/vestido-07.webp", v: false, alt: "Bajo la pérgola con los caballos" },
    { src: "/quince/fotos/vestido-08.webp", v: true, alt: "Yesenia junto al caballo" },
  ],

  /** Bloque casual: chamarra de piel y el Challenger. */
  photosCasual: [
    { src: "/quince/fotos/casual-01.webp", v: false, alt: "Yesenia junto al auto" },
    { src: "/quince/fotos/casual-02.webp", v: false, alt: "De perfil frente al auto" },
    { src: "/quince/fotos/casual-03.webp", v: true, alt: "Recargada en el auto" },
    { src: "/quince/fotos/casual-04.webp", v: false, alt: "Frente al auto en la entrada" },
    { src: "/quince/fotos/casual-05.webp", v: true, alt: "Sentada en el cofre" },
    { src: "/quince/fotos/casual-06.webp", v: false, alt: "El auto y la casa al atardecer" },
  ],

  /**
   * Lo que se muestra en la galería. `v` marca las verticales (van en celda
   * 3:4); las horizontales ocupan la fila completa en 3:2, porque forzarlas al
   * recorte vertical se come la escena. `pos` es el `object-position` cuando el
   * encuadre por defecto (centro-alto) deja mal el recorte.
   */
  gallery: [
    { src: "/quince/fotos/vestido-02.webp", v: true, pos: "center 22%", alt: "Retrato con la corona y el ramo" },
    { src: "/quince/fotos/vestido-05.webp", v: true, pos: "center 45%", alt: "El vestido extendido en el jardín" },
    { src: "/quince/fotos/vestido-06.webp", v: false, pos: "center 40%", alt: "Entre los dos caballos" },
    { src: "/quince/fotos/vestido-08.webp", v: true, pos: "center 35%", alt: "Yesenia junto al caballo" },
    { src: "/quince/fotos/vestido-03.webp", v: true, pos: "center 45%", alt: "Yesenia bajando las escaleras" },
    { src: "/quince/fotos/vestido-04.webp", v: false, pos: "center 45%", alt: "Frente al espejo del tocador" },
    { src: "/quince/fotos/casual-03.webp", v: true, pos: "center 30%", alt: "Recargada en el auto" },
    { src: "/quince/fotos/casual-05.webp", v: true, pos: "center 30%", alt: "Sentada en el cofre" },
    { src: "/quince/fotos/casual-06.webp", v: false, pos: "center 50%", alt: "El auto y la casa al atardecer" },
  ],
} as const;

export type Quince = typeof quince;

/** Enlace a Google Maps a partir de una consulta de texto. */
export function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Enlace para agregar el evento al calendario de Google. */
export function calendarUrl() {
  const start = "20260905T190000";
  const end = "20260906T020000";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `XV años de ${quince.name}`,
    dates: `${start}/${end}`,
    details: `${quince.inviteLine}\n${quince.party.time} · ${quince.party.place}`,
    location: `${quince.party.place}, ${quince.party.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
