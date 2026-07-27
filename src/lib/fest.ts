// Zentrale Fest-Daten. Das Programm wächst laufend — neue Acts hier
// eintragen, dann landen sie automatisch auf der Seite.

/** Ticket-Shop bei Petzi. Leer lassen, solange der Link noch nicht steht —
 *  die Seite zeigt dann statt des Buttons einen Hinweis. */
export const TICKET_URL =
  "https://www.petzi.ch/en/organiser/236127/x2nv44btSyy-vzACtazc3A/";

/** Der Shop ist passwortgeschützt. Leer lassen, wenn kein Passwort nötig ist. */
export const TICKET_PASSWORT = "viaspinnerei";

export const FEST = {
  titel: "Hausfest Via1",
  datum: "Samstag, 5. September",
  zeit: "ab 16 Uhr",
  ort: "Via Felsenau",
  adresse: "Spinnereiweg 17, 3004 Bern",

  // Für den Kalender-Eintrag. Bern liegt im September auf UTC+2, 16 Uhr
  // lokal sind also 14:00 UTC. Ende auf 4 Uhr früh gesetzt —
  // „bis in die frühen Morgenstunden“.
  startUtc: "20260905T140000Z",
  endeUtc: "20260906T020000Z",
} as const;

/** Die zwei Jubiläen — auf der Seite als grosse Zahlen statt als Satz. */
export const JUBILAEEN = [
  { zahl: "10", was: "Jahre Spinnerei" },
  { zahl: "33", was: "Jahre Via Felsenau" },
] as const;

export type Sparte = "Band" | "Theater" | "DJ";

export type Act = {
  name: string;
  herkunft?: string;
  /** Weglassen, solange die Sparte nicht feststeht — die Karte zeigt dann
   *  nur den Namen, statt eine falsche Zuordnung zu behaupten. */
  sparte?: Sparte;
};

/** Bereits bestätigt. Zeiten und weitere Acts kommen laufend dazu. */
export const ACTS: Act[] = [
  { name: "Ashinoa", herkunft: "FR", sparte: "Band" },
  { name: "Reverend Deadeye & Nicotin Sue", sparte: "Band" },
  { name: "Treibend", herkunft: "BE", sparte: "Band" },
  { name: "FULU", sparte: "Theater" },
  { name: "DJ Pantichrist", sparte: "DJ" },
  { name: "Yotah", sparte: "DJ" },
  { name: "Morchel", sparte: "DJ" },
  { name: "Tino Kaufholz", sparte: "DJ" },
];

export type NavItem = { id: string; label: string };

// Reihenfolge = Leserichtung der Seite.
export const NAV: NavItem[] = [
  { id: "willkommen", label: "Willkommen" },
  { id: "tickets", label: "Tickets" },
  { id: "programm", label: "Programm" },
  { id: "miteinander", label: "Miteinander" },
];
