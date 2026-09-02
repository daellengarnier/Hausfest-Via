import Blubber, { HoehlenFisch, MolchSitzt, Vampir } from "@/components/blubber";
import Intro from "@/components/intro";
import Plakat from "@/components/plakat";
import SiteNav from "@/components/site-nav";
import TicketFische from "@/components/ticket-fische";
import {
  Bubble,
  Kalender,
  Pfeil,
  Seegras,
  SoundCloudIcon,
  SparteIcon,
} from "@/components/doodles";
import type { Act, Floor, Sprache } from "@/lib/fest";
import {
  ACTS,
  FEST,
  FLOOR_LABEL,
  JUBILAEEN,
  KONTAKT_MAIL,
  NAV,
  SPARTE_LABEL,
  TICKET_PASSWORT,
  TICKET_URL,
} from "@/lib/fest";

/** Alle Oberflächentexte der Seite, Deutsch und Englisch nebeneinander.
 *  Was inhaltlich zum Fest gehört (Acts, Daten, Navigation), liegt dagegen
 *  in `src/lib/fest.ts` — hier steht nur, was die Seite selbst sagt. */
const TEXTE = {
  kalenderKnopf: { de: "Im Kalender speichern", en: "Add to calendar" },
  jubilaeenLabel: { de: "Was wir feiern", en: "What we're celebrating" },

  willkommenGruss: {
    de: "Schön, hast du hierhin gefunden!",
    en: "Lovely that you've found your way here!",
  },
  willkommen1: {
    de: "Am 5. September ab 16 Uhr öffnen wir die Türen zu unserem Haus — und zwar gleich alle. Gefeiert wird auf mehreren Floors: im Garten, in unserer Glaspyramide, in den Wohnungen und im Club im Keller.",
    en: "On 5 September from 4 pm we're opening the doors to our house — all of them at once. The party spreads across several floors: the garden, our glass pyramid, the flats and the club in the basement.",
  },
  willkommen2: {
    de: "Es erwarten dich ein wunderschöner Ort in Aarenähe (nimm also deine Badesachen mit), Essen, Bands, Theater und DJs — und das bis in die frühen Morgenstunden.",
    en: "Expect a beautiful place close to the river Aare (so bring your swimming gear), food, bands, theatre and DJs — well into the early hours.",
  },

  tickets1: {
    de: "Wir bitten dich ganz fest, ein Ticket zu kaufen. So können wir abschätzen, wie viele Personen kommen — und wissen, wie viel wir einkaufen müssen.",
    en: "We warmly ask you to buy a ticket. It lets us estimate how many people are coming — and how much we need to buy.",
  },
  tickets2: {
    de: "Eine Abendkasse gibt es auch, aber ab einer bestimmten Anzahl Leute stoppen wir den Einlass. Mit Ticket bist du auf der sicheren Seite.",
    en: "There will be a box office too, but once a certain number of people is reached, we'll stop letting anyone in. With a ticket you're on the safe side.",
  },
  ticketKnopf: { de: "Ticket sichern", en: "Get your ticket" },
  ticketPasswort: { de: "Passwort", en: "Password" },
  ticketBald: {
    de: "Ticketverkauf startet in Kürze",
    en: "Ticket sale starts soon",
  },

  programm1: {
    de: "Gefeiert wird auf vier Floors — hier steht, wer wann wo spielt. Kleine Änderungen sind bis zuletzt möglich, ein Blick kurz vor dem Fest lohnt sich.",
    en: "The party spreads across four floors — here's who plays when and where. Small changes are possible until the very end, so it's worth a look shortly before the party.",
  },
  programm2: {
    de: "Tippe auf einen Act, um mehr zu erfahren.",
    en: "Tap an act to find out more.",
  },

  miteinander1: {
    de: "Ein respektvoller und achtsamer Umgang miteinander ist die Grundlage für ein sicheres Miteinander. Diskriminierung, Rassismus, Sexismus und grenzüberschreitendes Verhalten haben bei uns keinen Platz. Achte auf deine eigenen und die Grenzen anderer, handle nur mit gegenseitiger Zustimmung und unterstütze Menschen, die sich unwohl fühlen oder Hilfe benötigen.",
    en: "Treating each other with respect and care is the foundation of a safe time together. Discrimination, racism, sexism and boundary-crossing behaviour have no place here. Mind your own boundaries and those of others, act only with mutual consent, and support people who feel uncomfortable or need help.",
  },
  miteinander2: {
    de: "Unser Haus ist leider nicht vollständig barrierefrei. Wir sind jedoch motiviert, gemeinsam individuelle Lösungen zu finden. Melde dich gerne bei uns, damit wir besprechen können, was du für deinen Besuch benötigst.",
    en: "Unfortunately, our house is not fully accessible. But we're motivated to find individual solutions together — do get in touch so we can talk about what you need for your visit.",
  },
  miteinander3: {
    de: "Wir laden dich in unsere privaten vier Wände ein. Darum bitten wir dich, die Info bedacht weiterzugeben.",
    en: "We're inviting you into our own four walls — so please pass this info on thoughtfully.",
  },

  gruss: {
    de: "Wir sehen uns am 5. September. Wir freuen uns!",
    en: "See you on 5 September. We can't wait!",
  },
  kontaktFrage: {
    de: "Fragen? Melde dich bei uns:",
    en: "Questions? Get in touch:",
  },

  appTitel: { de: "Als App installieren", en: "Install as an app" },
  app1: {
    de: "So hast du Programm und Infos immer griffbereit — auch ohne Empfang im Keller.",
    en: "That way the programme and info are always at hand — even without reception in the basement.",
  },
  app2iphone: {
    de: "iPhone: Teilen-Symbol → „Zum Home-Bildschirm“",
    en: "iPhone: Share icon → “Add to Home Screen”",
  },
  app2android: {
    de: "Android: Menü → „App installieren“",
    en: "Android: Menu → “Install app”",
  },
} as const;

export default function FestSeite({ sprache }: { sprache: Sprache }) {
  const t = <K extends keyof typeof TEXTE>(k: K) => TEXTE[k][sprache];

  return (
    // `lang` am Wurzelelement der Seite: Das Root-Layout ist für beide
    // Sprachen dasselbe und bleibt auf `de` — Screenreader und Übersetzer
    // lesen die Sprache darum hier ab.
    <div lang={sprache} className="relative min-h-screen">
      {/* Der dunkle Empfang: alles schwarz, bis jemand die Laterne des
          Fischs zündet. */}
      <Intro sprache={sprache} />
      <div aria-hidden="true" className="fest-canvas" />
      {/* Über der Bildoberkante wächst das Riff weiter, statt dass dort ein
          leerer blauer Balken steht. Der Streifen endet genau da, wo das
          Bild beginnt — an den Positionen darunter ändert sich nichts. */}
      <div aria-hidden="true" className="riff-oben">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/riff_oben.webp" alt="" />
      </div>
      {/* Der Molch schaut sich um — seine Pupille liegt als eigene kleine
          Scheibe über dem gemalten Auge im Hintergrundbild. */}
      <span aria-hidden="true" className="molch-auge">
        <span className="molch-pupille" />
      </span>
      {/* In der gemalten Höhle weiter unten hingen zwei starre Fische. Die
          sind aus dem Bild raus; stattdessen hängt hier einer ab, der sich
          umschaut und dessen Laterne pulst. Er sitzt — wie das Molchauge —
          in cqw am Bild fest, damit er in jeder Spaltenbreite in der Höhle
          bleibt. */}
      <HoehlenFisch />
      <Blubber />
      <SiteNav sprache={sprache} />

      {/* Titel — die Illustration trägt den Kopf der Seite ohne jede
          Abdunklung; die Schatten an der Schrift erledigen die Lesbarkeit. */}
      <header className="relative px-6 pb-12 pt-12 text-center">
        <div className="relative mx-auto max-w-2xl">
          <TitelText />

          {/* Die zwei Jubiläen schweben als Blasen um den Molch, statt in der
              Datumsbox zu sitzen — dort war der Kopf sonst überladen. */}
          <ul aria-label={t("jubilaeenLabel")} className="tief">
            {JUBILAEEN.map((j, i) => (
              <li
                key={j.zahl}
                className={
                  i === 0
                    ? "absolute left-0 top-[8.5rem] flex w-[7.5rem] flex-col items-center"
                    : "absolute right-0 top-[14.5rem] flex w-[7.5rem] flex-col items-center"
                }
              >
                {/* Ein Knopf ohne Aktion, nur fürs Anfassen: Beim Antippen
                    ploppt die Blase kurz auf (`:active` in der CSS) — auf
                    einem Button reagiert iOS zuverlässig darauf. */}
                <button type="button" className="jahr-knopf">
                  <Bubble
                    sprite={j.blase}
                    className="jahresblase h-[7.5rem] w-[7.5rem]"
                    style={{ "--takt": i === 0 ? "9s" : "12s" } as React.CSSProperties}
                  >
                    <span className="flex flex-col items-center leading-none">
                      <span className="font-display text-4xl font-extrabold text-foam">
                        {j.zahl}
                      </span>
                      {/* Gleiche Schrift wie die Zahl, eine Stufe kleiner —
                          und mit fester Breite, damit die Zeile in der
                          runden Blase zweizeilig umbricht statt seitlich
                          hinauszuragen. */}
                      <span className="font-display mt-1 w-[4.8rem] text-center text-[0.72rem] font-semibold leading-tight text-foam">
                        {j.was[sprache]}
                      </span>
                    </span>
                  </Bubble>
                </button>
              </li>
            ))}
          </ul>

          {/* Wann, wo und warum in einem Block — gläsern, damit das Bild
              durchscheint und die Angaben trotzdem zusammenbleiben. */}
          <div className="blasenfeld blasenfeld-rund tief mt-[19rem] inline-flex flex-col items-center">
            <p className="font-display text-xl font-bold text-foam">
              {FEST.datum[sprache]}
            </p>
            <p className="text-foam-dim">{FEST.zeit[sprache]}</p>
            <p className="mt-2 text-foam">{FEST.ort}</p>
            <p className="text-sm text-foam-dim">{FEST.adresse}</p>

            <a
              href="/kalender"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-sky/50 bg-sky/15 px-4 py-2 text-sm text-foam transition-colors hover:bg-sky/25"
            >
              <Kalender className="h-4 w-4" />
              {t("kalenderKnopf")}
            </a>

          </div>
        </div>
      </header>

      <main className="relative px-5 pb-12">
        {/* Kein Kasten mehr hinter dem Text: Die Schrift liegt direkt auf der
            Illustration, getragen von ihrem Schatten. */}
        <div className="tief mx-auto max-w-2xl">
          <div className="py-4">
            <Abschnitt
              id="willkommen"
              titel={NAV_TITEL("willkommen", sprache)}
              takt="13s"
              gras={{ art: 3, className: "-bottom-14 -left-5 w-24" }}
            >
              <p className="font-display text-xl font-bold text-foam">
                {t("willkommenGruss")}
              </p>
              <p>{t("willkommen1")}</p>
              <p>{t("willkommen2")}</p>
            </Abschnitt>

            {/* Bewusst leer: Hier liegt eine der schönsten Stellen der
                Illustration, die soll frei bleiben. */}
            <div aria-hidden="true" className="h-[16vh]" />

            <Abschnitt
              id="tickets"
              titel={NAV_TITEL("tickets", sprache)}
              blase="blasenfeld-rund"
              takt="16s"
              gras={{ art: 2, gespiegelt: true, className: "-bottom-16 -right-6 w-28" }}
            >
              <p>{t("tickets1")}</p>
              <p>{t("tickets2")}</p>
              <div className="not-prose relative mt-7 flex justify-center">
                {/* Vier Fische schiessen herbei, wenn man hier ankommt, und
                    warten neben dem Knopf — zwei je Seite. */}
                <TicketFische />
                <TicketButton sprache={sprache} />
              </div>
            </Abschnitt>

            <Abschnitt
              id="programm"
              titel={NAV_TITEL("programm", sprache)}
              takt="19s"
              gras={{ art: 1, className: "-bottom-10 -left-4 w-24" }}
            >
              <p>{t("programm1")}</p>
              <p className="text-sm text-foam-dim">{t("programm2")}</p>

              <div className="not-prose mt-5">
                {programmGruppen().map(({ floor, acts }, i) => (
                  <div key={floor ?? `frei-${i}`}>
                    {floor ? (
                      <h3 className="mb-2 mt-6 font-display text-lg font-bold text-foam">
                        {FLOOR_LABEL[floor][sprache]}
                      </h3>
                    ) : null}
                    <ul className="space-y-1">
                      {acts.map((act) => (
                        <li key={act.name}>
                          <ActKarte act={act} sprache={sprache} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Das gezeichnete Plakat — klein angepinnt, gross beim
                  Antippen. Inhaltlich gehört es hierher: Es zeigt Bands,
                  Floors und Zeiten. */}
              <Plakat sprache={sprache} />
            </Abschnitt>

            <Abschnitt
              id="miteinander"
              titel={NAV_TITEL("miteinander", sprache)}
              blase="blasenfeld-rund"
              takt="15s"
              gras={{ art: 3, gespiegelt: true, className: "-bottom-14 -right-5 w-24" }}
            >
              <p>{t("miteinander1")}</p>
              <p>{t("miteinander2")}</p>
              <p>{t("miteinander3")}</p>
            </Abschnitt>

            {/* Der Gruss zum Schluss steht über der Installations-Kachel:
                Er schliesst den Text ab, die Kachel ist nur noch ein
                technischer Hinweis und soll nicht das letzte Wort haben.
                Direkt darunter der Kontakt — wer bis hier gelesen hat und
                noch eine Frage hat, soll nicht suchen müssen. */}
            <div className="mt-14 px-1 text-center">
              {/* Der Vampirtintenfisch schaut aus dem Dunkeln heraus — das
                  letzte Tier auf dem Weg nach unten, kurz vor dem Gruss. */}
              <Vampir className="mx-auto w-52" />
              <p className="mt-4 font-display text-2xl font-bold text-foam">
                {t("gruss")}
              </p>

              <p className="mt-6 text-sm text-foam-dim">{t("kontaktFrage")}</p>
              <a
                href={`mailto:${KONTAKT_MAIL}`}
                className="mt-2 inline-flex items-center gap-2 rounded-full border border-sky/50 bg-sky/15 px-4 py-2 text-sm text-foam transition-colors hover:bg-sky/25"
              >
                <BriefIcon className="h-4 w-4" />
                {KONTAKT_MAIL}
              </a>
            </div>

            <div
              className="blasenfeld blasenfeld-flach relative mt-12"
              style={{ "--treiben": "17s" } as React.CSSProperties}
            >
              {/* Ein Molch hat es sich auf der Kachel bequem gemacht — er
                  schaut sich um, sitzt aber still. */}
              <MolchSitzt className="-top-10 right-1 w-24" />
              <Seegras art={1} gespiegelt className="-bottom-8 -left-3 w-20" />
              <p className="font-display font-bold text-foam">
                {t("appTitel")}
              </p>
              <p className="mt-2 text-sm text-foam-dim">{t("app1")}</p>
              <p className="mt-3 text-sm text-foam-dim">
                {t("app2iphone")}
                <br />
                {t("app2android")}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/** Abschnittstitel = Navigationsbeschriftung, damit beides zusammenpasst. */
function NAV_TITEL(id: string, sprache: Sprache): string {
  const eintrag = NAV.find((n) => n.id === id);
  return eintrag ? eintrag.label[sprache] : id;
}

/** Der Titel. Bleibt in beiden Sprachen gleich — er ist ein Name. */
function TitelText() {
  return (
    <h1 className="titel-leuchten font-display font-extrabold leading-[0.88] tracking-tight text-foam">
      <span className="block text-[3.4rem]">Hausfest</span>
      <span className="mt-1 block text-[3.9rem] text-mint">
        Via 1
      </span>
    </h1>
  );
}

/** Briefumschlag für den Kontakt-Knopf, im Strichstil der anderen Symbole. */
function BriefIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

/** Abschnitt mit Titel und Textblase. */
function Abschnitt({
  id,
  titel,
  blase = "",
  gras,
  takt = "13s",
  children,
}: {
  id: string;
  titel: string;
  /** Welche gemalte Blase den Text rahmt. */
  blase?: string;
  /** Das Büschel, das über den Rand der Blase wächst. */
  gras: React.ComponentProps<typeof Seegras>;
  /** Wie lange die Kachel für eine Drift braucht — je Kachel anders, sonst
   *  schaukeln alle im Gleichtakt. */
  takt?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-24 py-9 first:pt-0">
      <h2 className="font-display text-3xl font-extrabold text-foam">
        {titel}
      </h2>
      {/* Der Text sitzt in einer Blase: Auf der bunten Illustration war er
          sonst mühsam zu lesen, und ein dunkler Kasten würde das Bild
          zudecken. Die Blase gehört zur Bildwelt und trägt die Schrift. */}
      <div
        className={`blasenfeld ${blase} relative mt-5 space-y-4 text-[1.0625rem] leading-relaxed text-foam`}
        style={{ "--treiben": takt } as React.CSSProperties}
      >
        {children}
        <Seegras {...gras} />
      </div>
    </section>
  );
}

/** Kopfzeile einer Act-Karte: Blase mit Sparten-Symbol, Name, Herkunft. */
function ActKopf({ act, sprache }: { act: Act; sprache: Sprache }) {
  return (
    <>
      <Bubble sprite="blase_klein_05" className="h-10 w-10 shrink-0">
        <SparteIcon art={act.sparte} className="h-4 w-4 text-foam" />
      </Bubble>
      <div className="min-w-0 flex-1 text-left">
        <p className="font-display font-bold text-foam">
          {act.name}
          {act.herkunft ? (
            <span className="ml-2 text-sm font-normal text-foam-dim">
              ({act.herkunft})
            </span>
          ) : null}
          {act.soundcloud ? (
            // Ein Link im <summary>: Der Klick folgt dem Link, statt die
            // Karte aufzuklappen — Anker gewinnen gegen das Details-Toggle.
            // Neuer Tab, damit die installierte PWA nicht in SoundCloud
            // stecken bleibt.
            <a
              href={act.soundcloud}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                sprache === "de"
                  ? `${act.name} auf SoundCloud anhören`
                  : `Listen to ${act.name} on SoundCloud`
              }
              className="-m-1.5 ml-0.5 inline-flex p-1.5 align-[-0.3em] text-foam-dim transition-colors hover:text-sky"
            >
              <SoundCloudIcon className="h-[1.05em] w-[1.05em]" />
            </a>
          ) : null}
        </p>
        <ActInfos act={act} sprache={sprache} />
      </div>
    </>
  );
}

/** Die graue Zeile unter dem Namen: Sparte und Spielzeit — der Floor
 *  steht schon als Überschrift über der Gruppe. */
function ActInfos({ act, sprache }: { act: Act; sprache: Sprache }) {
  const teile = [
    act.sparte ? SPARTE_LABEL[act.sparte][sprache] : null,
    act.zeit ?? null,
  ].filter(Boolean);
  if (teile.length === 0) return null;
  return <p className="text-sm text-foam-dim">{teile.join(" · ")}</p>;
}

/** Das Programm als Gruppen: zuerst das Floor-lose Vorab (Nachtessen),
 *  dann je Floor eine Gruppe mit Überschrift — Garten, Spinnerei,
 *  Ambient, Alternativ —, innerhalb chronologisch. Acts ganz ohne
 *  Zuteilung hängen zum Schluss wieder ohne Überschrift an. */
const FLOOR_FOLGE: Floor[] = ["Garten", "Club", "Ambient", "Alternativ"];

function programmGruppen(): { floor: Floor | null; acts: Act[] }[] {
  // Startzeit in Minuten; Stunden vor 16 Uhr gehören zum Morgen danach.
  const start = (a: Act) => {
    if (!a.zeit) return Number.MAX_SAFE_INTEGER;
    const [h, m] = a.zeit.split("–")[0].split(":").map(Number);
    return (h < 16 ? h + 24 : h) * 60 + m;
  };
  const zeitlich = (liste: Act[]) => [...liste].sort((a, b) => start(a) - start(b));

  const gruppen: { floor: Floor | null; acts: Act[] }[] = [
    { floor: null, acts: zeitlich(ACTS.filter((a) => !a.floor && a.zeit)) },
    ...FLOOR_FOLGE.map((floor) => ({
      floor,
      acts: zeitlich(ACTS.filter((a) => a.floor === floor)),
    })),
    { floor: null, acts: ACTS.filter((a) => !a.floor && !a.zeit) },
  ];
  return gruppen.filter((g) => g.acts.length > 0);
}

/** Ein Act. Wer einen Beschrieb hat, dessen Karte lässt sich aufklappen —
 *  gebaut mit <details>, damit es ohne JavaScript funktioniert und für
 *  Tastatur und Screenreader von Haus aus stimmt. */
function ActKarte({ act, sprache }: { act: Act; sprache: Sprache }) {
  const rahmen = "blasenfeld blasenfeld-act";

  if (!act.beschrieb) {
    return (
      <div className={`flex items-center gap-3 ${rahmen}`}>
        <ActKopf act={act} sprache={sprache} />
      </div>
    );
  }

  return (
    <details className={`group ${rahmen}`}>
      <summary className="flex cursor-pointer list-none items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky [&::-webkit-details-marker]:hidden">
        <ActKopf act={act} sprache={sprache} />
        <Pfeil className="h-5 w-5 shrink-0 text-foam-dim transition-transform group-open:rotate-180" />
      </summary>

      <div className="mt-3 space-y-3 border-t border-white/15 pt-3 text-[0.9375rem] leading-relaxed text-foam/90">
        {act.beschrieb[sprache].map((absatz) => (
          <p key={absatz}>{absatz}</p>
        ))}
      </div>
    </details>
  );
}

/** Ticket-Aufruf. Das Shop-Passwort steht im Knopf selbst — so sieht man es
 *  im selben Moment, in dem man ihn antippt, und muss nicht zurückblättern.
 *  Solange kein Shop-Link gesetzt ist, wird ehrlich ein Hinweis gezeigt
 *  statt eines Knopfs, der ins Leere führt. */
function TicketButton({ sprache }: { sprache: Sprache }) {
  if (!TICKET_URL) {
    return (
      <p className="inline-block rounded-full border border-dashed border-white/30 bg-night-900/60 px-6 py-3 text-sm text-foam-dim backdrop-blur-sm">
        {TEXTE.ticketBald[sprache]}
      </p>
    );
  }
  return (
    // Die Hülle schwebt, der Knopf darin pulst — zwei Elemente, weil beide
    // Bewegungen auf `transform` liegen und sich sonst überschrieben.
    <span className="ticket-schwebe">
      {/* Neuer Tab: in der installierten PWA bliebe die App sonst im
          Ticketshop stecken — ohne Zurück-Knopf ein Sackgassen-Erlebnis. */}
      <a
        href={TICKET_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="blasenfeld blasenfeld-ticket ticket-puls inline-flex flex-col items-center text-center"
      >
        <span className="font-display text-lg font-bold text-foam">
          {TEXTE.ticketKnopf[sprache]}
        </span>
        {TICKET_PASSWORT ? (
          <span className="mt-0.5 text-sm text-foam/85">
            {TEXTE.ticketPasswort[sprache]}:{" "}
            <strong className="font-bold text-foam">{TICKET_PASSWORT}</strong>
          </span>
        ) : null}
      </a>
    </span>
  );
}
