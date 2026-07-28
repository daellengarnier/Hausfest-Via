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
  { zahl: "10", was: "Jahre Spinnerei", blase: "blase_klein_01" },
  { zahl: "33", was: "Jahre Via Felsenau", blase: "blase_klein_07" },
] as const;

export type Sparte = "Band" | "Theater" | "DJ";

export type Act = {
  name: string;
  herkunft?: string;
  /** Weglassen, solange die Sparte nicht feststeht — die Karte zeigt dann
   *  nur den Namen, statt eine falsche Zuordnung zu behaupten. */
  sparte?: Sparte;
  /** Ein Eintrag je Absatz. Wer einen Text hat, dessen Karte lässt sich
   *  auf der Seite aufklappen. */
  beschrieb?: string[];
  /** Wer mitspielt, je Zeile „Name — Instrument“. */
  besetzung?: string[];
};

/** Bereits bestätigt. Zeiten und weitere Acts kommen laufend dazu. */
export const ACTS: Act[] = [
  {
    name: "Ashinoa",
    herkunft: "FR",
    sparte: "Band",
    beschrieb: [
      "Mit ihrer Gründung 2015 hat die Band Ashinoa aus Lyon sich rasch einen Namen in der alternativen Musikszene gemacht. Ihre Vision: Ein musikalisches Universum, das von Krautrock und Elektronik regiert wird, durchsetzt mit rhythmischen und psychedelischen Elementen.",
      "Ihr Engagement und ihre kreative Dynamik haben sie von lokalen Bühnen zu internationalen Auftritten und Kollaborationen mit renommierten Künstler:innen geführt. Auf ihrer musikalischen Expedition lassen sie das Bekannte hinter sich.",
    ],
  },
  {
    name: "Reverend Deadeye & Nicotine Sue",
    sparte: "Band",
    beschrieb: [
      "Reverend Deadeye ist der Sohn eines Reverends, der wiederum der Sohn eines Reverends war. Seine Jugend verbrachte er mit Schlangen in den Händen und mit Auftritten bei Zelt-Erweckungen, an der Seite seiner Pfingstler-Familie in einem Navajo-Reservat in Arizona. Dieses geistliche Erbe klingt in seinen Auftritten nach.",
      "Erwarte aber keinen Gottesdienst am Sonntagmorgen — eher eine Feuertaufe am Samstagabend, eine heilige Erweckung.",
      "Neu mit dem Schlagzeug der Schweizer Legende Nicotine Sue. Zu zweit entfesseln die beiden wuchtige Fassungen von Lo-Fi-Blues-Hymnen mit Gospel-Einschlag, die das Publikum in eine fast mystische Erweckung treiben.",
    ],
  },
  {
    name: "Treibend",
    herkunft: "BE",
    sparte: "Band",
    beschrieb: [
      "Das Kollektiv aus Bern und Biel spielt elektro-akustische Live-Sets, die sich im ständigen Fluss befinden – immer im Moment, immer im Wandel. Mit Piano, Synthesizer, Trompete und Gesang entstehen bewegende Melodien und treibende Beats.",
      "Treibend schafft ein Klangbild, das zugleich antreibt und träumen lässt – tanzbar, meditativ, vielschichtig.",
    ],
    besetzung: [
      "Bara Bačova — Trompete, Gesang",
      "Nicolas Engel — Keys",
      "Florian Mühlemann — Synths, Drum Machine",
    ],
  },
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
