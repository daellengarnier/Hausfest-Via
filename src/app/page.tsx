import Blubber, { FischStill, MolchSitzt } from "@/components/blubber";
import SiteNav from "@/components/site-nav";
import {
  Bubble,
  Coral,
  CoralRule,
  Kalender,
  Pfeil,
  SparteIcon,
} from "@/components/doodles";
import type { Act } from "@/lib/fest";
import {
  ACTS,
  FEST,
  JUBILAEEN,
  TICKET_PASSWORT,
  TICKET_URL,
} from "@/lib/fest";

export default function Home() {
  return (
    <div className="relative min-h-screen">
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
      <FischStill art={0} gespiegelt className="hoehlen-fisch" />
      <Blubber />
      <SiteNav />

      {/* Titel — die Illustration trägt den Kopf der Seite ohne jede
          Abdunklung; die Schatten an der Schrift erledigen die Lesbarkeit. */}
      <header className="relative px-6 pb-12 pt-12 text-center">
        <div className="relative mx-auto max-w-2xl">
          <TitelText />

          {/* Die zwei Jubiläen schweben als Blasen um den Molch, statt in der
              Datumsbox zu sitzen — dort war der Kopf sonst überladen. */}
          <ul aria-label="Was wir feiern" className="tief">
            {JUBILAEEN.map((j, i) => (
              <li
                key={j.zahl}
                className={
                  i === 0
                    ? "absolute left-0 top-[8.5rem] flex w-[6.2rem] flex-col items-center"
                    : "absolute right-0 top-[14.5rem] flex w-[6.2rem] flex-col items-center"
                }
              >
                <Bubble
                  sprite={j.blase}
                  className="jahresblase h-[6.2rem] w-[6.2rem]"
                  style={{ "--takt": i === 0 ? "9s" : "12s" } as React.CSSProperties}
                >
                  <span className="flex flex-col items-center leading-none">
                    <span className="font-display text-2xl font-extrabold text-foam">
                      {j.zahl}
                    </span>
                    <span className="mt-0.5 text-[0.62rem] text-foam">
                      {j.was}
                    </span>
                  </span>
                </Bubble>
              </li>
            ))}
          </ul>

          {/* Wann, wo und warum in einem Block — gläsern, damit das Bild
              durchscheint und die Angaben trotzdem zusammenbleiben. */}
          <div className="blasenfeld blasenfeld-rund tief mt-[19rem] inline-flex flex-col items-center">
            <p className="font-display text-xl font-bold text-foam">
              {FEST.datum}
            </p>
            <p className="text-foam-dim">{FEST.zeit}</p>
            <p className="mt-2 text-foam">{FEST.ort}</p>
            <p className="text-sm text-foam-dim">{FEST.adresse}</p>

            <a
              href="/kalender"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-sky/50 bg-sky/15 px-4 py-2 text-sm text-foam transition-colors hover:bg-sky/25"
            >
              <Kalender className="h-4 w-4" />
              Im Kalender speichern
            </a>

          </div>
        </div>
      </header>

      <main className="relative px-5 pb-12">
        {/* Kein Kasten mehr hinter dem Text: Die Schrift liegt direkt auf der
            Illustration, getragen von ihrem Schatten. */}
        <div className="tief mx-auto max-w-2xl">
          <div className="py-4">
            <Abschnitt id="willkommen" titel="Willkommen" form={0}>
              <p className="font-display text-xl font-bold text-foam">
                Schön, hast du hierhin gefunden!
              </p>
              <p>
                Am 5. September ab 16 Uhr öffnen wir die Türen zu unserem Haus
                — und zwar gleich alle. Gefeiert wird auf mehreren Floors: im
                Garten, in unserer Glaspyramide, in den Wohnungen und im Club
                im Keller.
              </p>
              <p>
                Es erwarten dich Kinderprogramm, Essen, Bands, Theater und DJs
                — und das bis in die frühen Morgenstunden.
              </p>
            </Abschnitt>

            {/* Bewusst leer: Hier liegt eine der schönsten Stellen der
                Illustration, die soll frei bleiben. */}
            <div aria-hidden="true" className="h-[16vh]" />

            <Abschnitt id="tickets" titel="Tickets" form={1} blase="blasenfeld-rund">
              <p>
                Wir bitten dich ganz fest, ein Ticket zu kaufen. Wir kochen und
                kaufen für alle ein, die kommen — mit deinem Ticket wissen wir,
                mit wie vielen wir rechnen dürfen.
              </p>
              <p>
                Eine Abendkasse gibt es auch, aber ab einer bestimmten Anzahl
                Leute stoppen wir den Einlass. Mit Ticket bist du auf der
                sicheren Seite.
              </p>
              <div className="not-prose mt-7 flex justify-center">
                <TicketButton />
              </div>
            </Abschnitt>

            <Abschnitt id="programm" titel="Programm" form={2}>
              <p>
                Diese Acts sind bestätigt. Das Line-up wächst laufend, und die
                Zeiten schalten wir auf, sobald sie stehen — es lohnt sich
                also, immer wieder vorbeizuschauen.
              </p>
              <p className="text-sm text-foam-dim">
                Tippe auf einen Act, um mehr zu erfahren.
              </p>

              <ul className="not-prose mt-5 space-y-1">
                {ACTS.map((act) => (
                  <li key={act.name}>
                    <ActKarte act={act} />
                  </li>
                ))}
              </ul>
            </Abschnitt>

            <Abschnitt id="miteinander" titel="Miteinander" form={0} blase="blasenfeld-rund">
              <p>Wir wollen ein Fest, an dem sich alle wohlfühlen.</p>
              <p>
                Diskriminierung, Rassismus, Sexismus und grenzüberschreitendes
                Verhalten haben bei uns keinen Platz. Achtet aufeinander,
                fragt im Zweifel nach, und akzeptiert ein Nein als Nein.
              </p>
              <p>
                Wir laden dich in unsere privaten vier Wände ein. Darum bitten
                wir dich, die Info bedacht weiterzugeben.
              </p>
            </Abschnitt>

            {/* Der Gruss zum Schluss steht über der Installations-Kachel:
                Er schliesst den Text ab, die Kachel ist nur noch ein
                technischer Hinweis und soll nicht das letzte Wort haben. */}
            <div className="mt-12 px-1 text-center">
              <Coral form={1} className="mx-auto h-8 w-8 text-blossom/60" />
              <p className="mt-3 font-display text-2xl font-bold text-foam">
                Bis zum 5. September!
              </p>
            </div>

            <div className="blasenfeld blasenfeld-flach relative mt-10">
              {/* Ein Molch hat es sich auf der Kachel bequem gemacht — er
                  schaut sich um, sitzt aber still. */}
              <MolchSitzt className="-top-10 right-1 w-24" />
              <p className="font-display font-bold text-foam">
                Als App installieren
              </p>
              <p className="mt-2 text-sm text-foam-dim">
                So hast du Programm und Infos immer griffbereit — auch ohne
                Empfang im Keller.
              </p>
              <p className="mt-3 text-sm text-foam-dim">
                iPhone: Teilen-Symbol → „Zum Home-Bildschirm“
                <br />
                Android: Menü → „App installieren“
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/** Der Titel. Eigene Komponente, weil die Linsen eine identische Kopie
 *  brauchen — sonst läge die Spiegelung nicht deckungsgleich. */
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

/** Abschnitt mit gezeichneter Trennlinie und Titel. */
function Abschnitt({
  id,
  titel,
  form,
  blase = "",
  children,
}: {
  id: string;
  titel: string;
  form: 0 | 1 | 2;
  /** Welche gemalte Blase den Text rahmt. */
  blase?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-24 py-9 first:pt-0">
      <CoralRule form={form} />
      <h2 className="mt-7 font-display text-3xl font-extrabold text-foam">
        {titel}
      </h2>
      {/* Der Text sitzt in einer Blase: Auf der bunten Illustration war er
          sonst mühsam zu lesen, und ein dunkler Kasten würde das Bild
          zudecken. Die Blase gehört zur Bildwelt und trägt die Schrift. */}
      <div
        className={`blasenfeld ${blase} mt-5 space-y-4 text-[1.0625rem] leading-relaxed text-foam`}
      >
        {children}
      </div>
    </section>
  );
}

/** Kopfzeile einer Act-Karte: Blase mit Sparten-Symbol, Name, Herkunft. */
function ActKopf({ act }: { act: Act }) {
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
        </p>
        {act.sparte ? (
          <p className="text-sm text-foam-dim">{act.sparte}</p>
        ) : null}
      </div>
    </>
  );
}

/** Ein Act. Wer einen Beschrieb hat, dessen Karte lässt sich aufklappen —
 *  gebaut mit <details>, damit es ohne JavaScript funktioniert und für
 *  Tastatur und Screenreader von Haus aus stimmt. */
function ActKarte({ act }: { act: Act }) {
  const rahmen = "blasenfeld blasenfeld-act";

  if (!act.beschrieb) {
    return (
      <div className={`flex items-center gap-3 ${rahmen}`}>
        <ActKopf act={act} />
      </div>
    );
  }

  return (
    <details className={`group ${rahmen}`}>
      <summary className="flex cursor-pointer list-none items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky [&::-webkit-details-marker]:hidden">
        <ActKopf act={act} />
        <Pfeil className="h-5 w-5 shrink-0 text-foam-dim transition-transform group-open:rotate-180" />
      </summary>

      <div className="mt-3 space-y-3 border-t border-white/15 pt-3 text-[0.9375rem] leading-relaxed text-foam/90">
        {act.beschrieb.map((absatz) => (
          <p key={absatz}>{absatz}</p>
        ))}
        {act.besetzung ? (
          <ul className="pt-1 text-sm text-foam-dim">
            {act.besetzung.map((zeile) => (
              <li key={zeile}>{zeile}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </details>
  );
}

/** Ticket-Aufruf. Das Shop-Passwort steht im Knopf selbst — so sieht man es
 *  im selben Moment, in dem man ihn antippt, und muss nicht zurückblättern.
 *  Solange kein Shop-Link gesetzt ist, wird ehrlich ein Hinweis gezeigt
 *  statt eines Knopfs, der ins Leere führt. */
function TicketButton() {
  if (!TICKET_URL) {
    return (
      <p className="inline-block rounded-full border border-dashed border-white/30 bg-night-900/60 px-6 py-3 text-sm text-foam-dim backdrop-blur-sm">
        Ticketverkauf startet in Kürze
      </p>
    );
  }
  return (
    // Neuer Tab: in der installierten PWA bliebe die App sonst im Ticketshop
    // stecken — ohne Zurück-Knopf ein Sackgassen-Erlebnis.
    <a
      href={TICKET_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="blasenfeld blasenfeld-ticket ticket-puls inline-flex flex-col items-center text-center"
    >
      <span className="font-display text-lg font-bold text-foam">
        Ticket sichern
      </span>
      {TICKET_PASSWORT ? (
        <span className="mt-0.5 text-sm text-foam/85">
          Passwort: <strong className="font-bold text-foam">{TICKET_PASSWORT}</strong>
        </span>
      ) : null}
    </a>
  );
}
