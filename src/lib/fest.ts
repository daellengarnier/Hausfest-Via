// Zentrale Fest-Daten. Das Programm wächst laufend — neue Acts hier
// eintragen, dann landen sie automatisch auf der Seite.

/** Ticket-Shop bei Petzi. Leer lassen, solange der Link noch nicht steht —
 *  die Seite zeigt dann statt des Buttons einen Hinweis. */
export const TICKET_URL =
  "https://www.petzi.ch/en/organiser/236127/x2nv44btSyy-vzACtazc3A/";

export const FEST = {
  datum: "Samstag, 5. September",
  zeit: "ab 16 Uhr",
  ort: "Via Felsenau",
  anlass: "10 Jahre Spinnerei · 33 Jahre Via Felsenau",
} as const;

export type Floor = {
  name: string;
  beschrieb: string;
};

export const FLOORS: Floor[] = [
  { name: "Garten", beschrieb: "Draussen, für alle. Essen, Sonne, Kinderprogramm." },
  { name: "Glaspyramide", beschrieb: "Unser Wahrzeichen — Bands und Theater darunter." },
  { name: "Wohnungen", beschrieb: "Offene Türen, kleine Bühnen, kurze Wege." },
  { name: "Club im Keller", beschrieb: "DJs bis in die frühen Morgenstunden." },
];

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

export const NAV: NavItem[] = [
  { id: "willkommen", label: "Willkommen" },
  { id: "programm", label: "Programm" },
  { id: "tickets", label: "Tickets" },
  { id: "haus", label: "Das Haus" },
];
