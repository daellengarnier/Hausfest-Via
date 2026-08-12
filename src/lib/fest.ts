// Zentrale Fest-Daten. Das Programm wächst laufend — neue Acts hier
// eintragen, dann landen sie automatisch auf der Seite.
//
// Die Seite gibt es auf Deutsch und Englisch. Alles, was Sprache trägt,
// liegt hier als Paar `{ de, en }` — die Seite greift dann mit ihrer
// Sprache hinein. So kann keine Übersetzung vergessen gehen: Fehlt eine,
// meckert TypeScript.

export type Sprache = "de" | "en";

/** Ticket-Shop bei Petzi. Leer lassen, solange der Link noch nicht steht —
 *  die Seite zeigt dann statt des Buttons einen Hinweis. */
export const TICKET_URL =
  "https://www.petzi.ch/en/organiser/236127/x2nv44btSyy-vzACtazc3A/";

/** Der Shop ist passwortgeschützt. Leer lassen, wenn kein Passwort nötig ist. */
export const TICKET_PASSWORT = "viaspinnerei";

/** Für Fragen rund ums Fest. */
export const KONTAKT_MAIL = "info@kulturspinnerei.ch";

export const FEST = {
  titel: "Hausfest Via 1",
  datum: { de: "Samstag, 5. September", en: "Saturday, 5 September" },
  zeit: { de: "ab 16 Uhr", en: "from 4 pm" },
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
  {
    zahl: "10",
    was: { de: "Jahre Spinnerei", en: "years of Spinnerei" },
    blase: "blase_klein_01",
  },
  {
    zahl: "33",
    was: { de: "Jahre Via", en: "years of Via" },
    blase: "blase_klein_07",
  },
] as const;

export type Sparte = "Band" | "Theater" | "DJ" | "Feuershow";

export type Act = {
  name: string;
  herkunft?: string;
  /** Weglassen, solange die Sparte nicht feststeht — die Karte zeigt dann
   *  nur den Namen, statt eine falsche Zuordnung zu behaupten. */
  sparte?: Sparte;
  /** Ein Eintrag je Absatz, je Sprache. Wer einen Text hat, dessen Karte
   *  lässt sich auf der Seite aufklappen. */
  beschrieb?: Record<Sprache, string[]>;
  /** SoundCloud-Profil — erscheint als kleines Icon hinter dem Namen.
   *  Die offiziellen Teilen-Links (on.soundcloud.com) funktionieren gut. */
  soundcloud?: string;
};

/** Bereits bestätigt. Zeiten und weitere Acts kommen laufend dazu. */
export const ACTS: Act[] = [
  {
    name: "Ashinoa",
    herkunft: "FR",
    sparte: "Band",
    beschrieb: {
      de: [
        "Ashinoa ist eine französische Band, Ende 2015 in Lyon gegründet. Seit ihrer Gründung steht das Trio an vorderster Front der alternativen Szene ihrer Heimatstadt. Beeinflusst von Krautrock und elektronischer Musik erschaffen sie ein weites Universum aus psychedelischen Synthesizern und Gitarren, perkussiven Kraut-Rhythmen und galaktischen Visuals.",
      ],
      en: [
        "Ashinoa is a French band born in Lyon in the closing stages of 2015. Since forming, the French three-piece has been at the forefront of the alternative scene in their home city of Lyon. Influenced by krautrock and electronic music, they create a vast universe centred around psychedelic synthesisers and guitars, percussive and kraut rhythms, and galactic visuals.",
      ],
    },
  },
  {
    name: "Reverend Deadeye & Nicotine Sue",
    sparte: "Band",
    beschrieb: {
      de: [
        "Reverend Deadeye ist der Sohn eines Reverends, der wiederum der Sohn eines Reverends war. Seine Jugend verbrachte er mit Schlangen in den Händen und mit Auftritten bei Zelt-Erweckungen, an der Seite seiner Pfingstler-Familie in einem Navajo-Reservat in Arizona. Dieses geistliche Erbe klingt in seinen Auftritten nach.",
        "Erwarte aber keinen Gottesdienst am Sonntagmorgen — eher eine Feuertaufe am Samstagabend, eine heilige Erweckung.",
        "Neu mit dem Schlagzeug der Schweizer Legende Nicotine Sue. Zu zweit entfesseln die beiden wuchtige Fassungen von Lo-Fi-Blues-Hymnen mit Gospel-Einschlag, die das Publikum in eine fast mystische Erweckung treiben.",
      ],
      en: [
        "Reverend Deadeye is the son of a reverend who was himself the son of a reverend. He spent his youth with snakes in his hands, performing at tent revivals alongside his Pentecostal family on a Navajo reservation in Arizona. That spiritual heritage still echoes through his shows.",
        "Don't expect a Sunday-morning service, though — this is more of a Saturday-night baptism by fire, a holy awakening.",
        "Now joined on drums by Swiss legend Nicotine Sue. Together they unleash mighty renditions of lo-fi blues hymns with a gospel edge, driving the crowd into an almost mystical revival.",
      ],
    },
  },
  {
    name: "Treibend",
    herkunft: "BE",
    sparte: "Band",
    beschrieb: {
      de: [
        "Das Kollektiv aus Bern und Biel spielt elektro-akustische Live-Sets, die sich im ständigen Fluss befinden – immer im Moment, immer im Wandel. Mit Piano, Synthesizer, Trompete und Gesang entstehen bewegende Melodien und treibende Beats.",
        "Treibend schafft ein Klangbild, das zugleich antreibt und träumen lässt – tanzbar, meditativ, vielschichtig.",
      ],
      en: [
        "The collective from Bern and Biel plays electro-acoustic live sets in constant flux — always in the moment, always shifting. Piano, synthesiser, trumpet and vocals weave into moving melodies and driving beats.",
        "Treibend creates a sound that propels you forward and lets you dream at the same time — danceable, meditative, layered.",
      ],
    },
  },
  { name: "FULU", sparte: "Feuershow" },
  { name: "DJ Pantichrist", sparte: "DJ" },
  {
    name: "Yotah",
    sparte: "DJ",
    soundcloud: "https://on.soundcloud.com/qsJPPnOlfHzvy407mB",
  },
  {
    name: "Morchel",
    sparte: "DJ",
    soundcloud: "https://on.soundcloud.com/antaON5k18dENc0OGh",
  },
  {
    name: "Tino Kaufholz",
    sparte: "DJ",
    soundcloud: "https://on.soundcloud.com/xS4YrPHYCeWeIwCceX",
  },
  {
    name: "Jola",
    herkunft: "BE",
    sparte: "DJ",
    soundcloud: "https://on.soundcloud.com/6ncio68TrvYkpfi9IS",
  },
  {
    name: "Orbflux",
    sparte: "DJ",
    soundcloud: "https://on.soundcloud.com/gNswEbsj2IHjEBFeqF",
  },
];

/** Die Sparte, wie sie auf der Karte steht — nur „Theater“ schreibt sich
 *  auf Englisch anders. */
export const SPARTE_LABEL: Record<Sparte, Record<Sprache, string>> = {
  Band: { de: "Band", en: "Band" },
  Theater: { de: "Theater", en: "Theatre" },
  DJ: { de: "DJ", en: "DJ" },
  Feuershow: { de: "Feuershow", en: "Fire show" },
};

export type NavItem = { id: string; label: Record<Sprache, string> };

// Reihenfolge = Leserichtung der Seite.
export const NAV: NavItem[] = [
  { id: "willkommen", label: { de: "Willkommen", en: "Welcome" } },
  { id: "tickets", label: { de: "Tickets", en: "Tickets" } },
  { id: "programm", label: { de: "Programm", en: "Programme" } },
  { id: "miteinander", label: { de: "Miteinander", en: "Together" } },
];
