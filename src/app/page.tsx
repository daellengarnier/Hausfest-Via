import SiteNav from "@/components/site-nav";
import {
  Bubble,
  Coral,
  CoralRule,
  Kalender,
  SparteIcon,
} from "@/components/doodles";
import {
  ACTS,
  FEST,
  JUBILAEEN,
  TICKET_PASSWORT,
  TICKET_URL,
} from "@/lib/fest";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div aria-hidden="true" className="fest-canvas" />
      <SiteNav />

      {/* Titel — die Illustration trägt den Kopf der Seite. Der Verlauf
          dunkelt nur so weit ab, dass die Schrift trägt, ohne die Zeichnung
          zuzudecken; die Schatten am Text erledigen den Rest. */}
      <header className="relative px-6 pb-12 pt-12 text-center sm:pb-16 sm:pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night-900/60 via-night-900/35 to-night-900/70"
        />
        <div className="relative mx-auto max-w-2xl [text-shadow:0_2px_14px_rgba(7,21,64,0.95)]">
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-foam sm:text-7xl">
            Hausfest
            <br className="sm:hidden" />
            <span className="sm:ml-4">Via1</span>
          </h1>

          {/* Wann, wo und warum in einem Block — auf eigener dunkler Fläche,
              sonst gehen die Zahlen in der Zeichnung unter. */}
          <div className="mt-8 inline-flex flex-col items-center rounded-3xl border border-white/25 bg-night-900/75 px-6 py-5 backdrop-blur-md sm:px-8">
            <p className="font-display text-xl font-bold text-foam sm:text-2xl">
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

            <div className="ink-rule mt-5 w-full" />

            {/* Die zwei Jubiläen als Zahlen — spart einen ganzen Satz. */}
            <ul className="mt-4 flex items-start justify-center gap-7 sm:gap-10">
              {JUBILAEEN.map((j) => (
                <li key={j.zahl} className="flex w-24 flex-col items-center">
                  <Bubble className="h-14 w-14 sm:h-16 sm:w-16">
                    <span className="font-display text-2xl font-extrabold text-foam sm:text-3xl">
                      {j.zahl}
                    </span>
                  </Bubble>
                  <span className="mt-2 text-center text-xs leading-tight text-foam-dim sm:text-sm">
                    {j.was}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <main className="relative px-3 pb-12 sm:px-6">
        {/* Die Texte sitzen auf einer eigenen Fläche, damit sie ruhig lesbar
            bleiben — die Zeichnung läuft aussen herum weiter. */}
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-night-900/88 backdrop-blur-md">
          <div className="px-5 py-10 sm:px-10 sm:py-14">
            <Abschnitt id="willkommen" titel="Willkommen" form={0}>
              <p className="font-hand text-2xl text-sun">
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
              <p>
                Wir laden dich in unsere privaten vier Wände ein. Darum bitten
                wir dich, die Info bedacht weiterzugeben.
              </p>
            </Abschnitt>

            <Abschnitt id="tickets" titel="Tickets" form={1}>
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

              <ul className="not-prose mt-6 space-y-3">
                {ACTS.map((act) => (
                  <li
                    key={act.name}
                    className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/5 p-4"
                  >
                    <Bubble className="h-11 w-11 shrink-0">
                      <SparteIcon
                        art={act.sparte}
                        className="h-5 w-5 text-foam"
                      />
                    </Bubble>
                    <div className="min-w-0">
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
                  </li>
                ))}
              </ul>
            </Abschnitt>

            <Abschnitt id="miteinander" titel="Miteinander" form={0}>
              <p>Wir wollen ein Fest, an dem sich alle wohlfühlen.</p>
              <p>
                Diskriminierung, Rassismus, Sexismus und grenzüberschreitendes
                Verhalten haben bei uns keinen Platz. Achtet aufeinander,
                fragt im Zweifel nach, und akzeptiert ein Nein als Nein.
              </p>
            </Abschnitt>

            <div className="mt-10 rounded-2xl border border-white/15 bg-white/5 p-5">
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

      <footer className="relative bg-night-900/80 px-6 py-10 text-center backdrop-blur-md">
        <Coral form={1} className="mx-auto h-8 w-8 text-blossom/60" />
        <p className="mt-3 font-hand text-2xl text-foam">
          Bis zum 5. September!
        </p>
      </footer>
    </div>
  );
}

/** Abschnitt mit gezeichneter Trennlinie und Titel. */
function Abschnitt({
  id,
  titel,
  form,
  children,
}: {
  id: string;
  titel: string;
  form: 0 | 1 | 2;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-9 first:pt-0">
      <CoralRule form={form} />
      <h2 className="mt-7 font-display text-3xl font-extrabold text-foam sm:text-4xl">
        {titel}
      </h2>
      <div className="mt-5 space-y-4 text-[1.0625rem] leading-relaxed text-foam/90">
        {children}
      </div>
    </section>
  );
}

/** Ticket-Aufruf. Das Shop-Passwort steht im Knopf selbst — so sieht man es
 *  im selben Moment, in dem man ihn antippt, und muss nicht zurückblättern.
 *  Solange kein Shop-Link gesetzt ist, wird ehrlich ein Hinweis gezeigt
 *  statt eines Knopfs, der ins Leere führt. */
function TicketButton() {
  if (!TICKET_URL) {
    return (
      <p className="inline-block rounded-full border border-dashed border-white/30 bg-night-900/60 px-6 py-3 text-sm text-foam-dim">
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
      className="inline-flex flex-col items-center rounded-3xl bg-gradient-to-br from-coral to-blossom px-8 py-4 text-night-900 shadow-lg shadow-coral/25 transition-transform hover:scale-[1.03] active:scale-100"
    >
      <span className="font-display text-lg font-bold">Ticket sichern</span>
      {TICKET_PASSWORT ? (
        <span className="mt-0.5 text-sm text-night-900/80">
          Passwort: <strong className="font-bold">{TICKET_PASSWORT}</strong>
        </span>
      ) : null}
    </a>
  );
}
