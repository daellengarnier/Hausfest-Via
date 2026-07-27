// Zentrale Fest-Daten. Das Programm wächst laufend — neue Acts hier
// eintragen, dann landen sie automatisch auf der Seite.

/** Ticket-Shop bei Petzi. Leer lassen, solange der Link noch nicht steht —
 *  die Seite zeigt dann statt des Buttons einen Hinweis. */
export const TICKET_URL =
  "https://www.petzi.ch/en/organiser/236127/x2nv44btSyy-vzACtazc3A/";

/** Der Shop ist passwortgeschützt. Leer lassen, wenn kein Passwort nötig ist. */
export const TICKET_PASSWORT = "viaspinnerei";

export const FEST = {
  datum: "Samstag, 5. September",
  zeit: "ab 16 Uhr",
  ort: "Via Felsenau",
  anlass: "10 Jahre Spinnerei · 33 Jahre Via Felsenau",
} as const;

export type FloorIconArt = "garten" | "pyramide" | "wohnung" | "club";

export type Floor = {
  name: string;
  beschrieb: string;
  icon: FloorIconArt;
};

export const FLOORS: Floor[] = [
  {
    name: "Garten",
    beschrieb: "Essen, Sonne, Kinderprogramm.",
    icon: "garten",
  },
  {
    name: "Glaspyramide",
    beschrieb: "Bands und Theater darunter.",
    icon: "pyramide",
  },
  {
    name: "Wohnungen",
    beschrieb: "Kleine Bühnen, kurze Wege.",
    icon: "wohnung",
  },
  {
    name: "Club im Keller",
    beschrieb: "DJs bis in die frühen Morgenstunden.",
    icon: "club",
  },
];

/** Die zwei Jubiläen — auf der Seite als grosse Zahlen statt als Satz. */
export const JUBILAEEN = [
  { zahl: "10", was: "Jahre Spinnerei" },
  { zahl: "33", was: "Jahre Via Felsenau" },
] as const;

export type Act = {
  name: string;
  herkunft?: string;
  sparte: "Band" | "Theater";
};

/** Bereits bestätigt. Zeiten und weitere Acts kommen laufend dazu. */
export const ACTS: Act[] = [
  { name: "Ashinoa", herkunft: "FR", sparte: "Band" },
  { name: "Reverend Deadeye & Nicotin Sue", sparte: "Band" },
  { name: "Treibend", herkunft: "BE", sparte: "Band" },
  { name: "theater FULU", sparte: "Theater" },
];

export type NavItem = { id: string; label: string };

// Reihenfolge = Wichtigkeit: zuerst das Ticket, dann was läuft, dann das Haus.
export const NAV: NavItem[] = [
  { id: "tickets", label: "Tickets" },
  { id: "fest", label: "Das Fest" },
  { id: "lineup", label: "Line-up" },
  { id: "haus", label: "Haus" },
];
