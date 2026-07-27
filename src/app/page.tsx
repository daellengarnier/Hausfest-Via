import SiteNav from "@/components/site-nav";
import { Bubble, Coral, CoralRule } from "@/components/doodles";
import { ACTS, FEST, FLOORS, TICKET_URL } from "@/lib/fest";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div aria-hidden="true" className="fest-canvas" />
      <SiteNav />

      {/* Titel — die Illustration trägt den Kopf der Seite. Der Verlauf
          dunkelt nur so weit ab, dass die Schrift trägt, ohne die Zeichnung
          zuzudecken; die Schatten am Text erledigen den Rest. */}
      <header className="relative px-6 pb-14 pt-10 text-center sm:pb-20 sm:pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-night-900/60 via-night-900/35 to-night-900/70"
        />
        <div className="relative mx-auto max-w-2xl [text-shadow:0_2px_14px_rgba(7,21,64,0.95)]">
          <p className="font-hand text-2xl text-blossom sm:text-3xl">
            Wir möchten feiern.
          </p>
          <h1 className="mt-1 font-display text-6xl font-extrabold tracking-tight text-foam sm:text-8xl">
            Hausfest
          </h1>
          <p className="mt-2 font-hand text-2xl text-sun sm:text-3xl">
            Und zwar mit dir!
          </p>

          <div className="mt-8 inline-flex flex-col items-center gap-1 rounded-3xl border border-white/25 bg-night-900/70 px-7 py-5 backdrop-blur-md">
            <p className="font-display text-xl font-bold text-foam sm:text-2xl">
              {FEST.datum}
            </p>
            <p className="text-foam-dim">
              {FEST.zeit} · {FEST.ort}
            </p>
            <p className="mt-2 text-sm text-mint">{FEST.anlass}</p>
          </div>

          <div className="mt-7">
            <TicketButton />
          </div>
        </div>
      </header>

      <main className="relative px-3 pb-12 sm:px-6">
        {/* Die Texte sitzen auf einer eigenen Fläche, damit sie ruhig lesbar
            bleiben — die Zeichnung läuft aussen herum weiter. */}
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-night-900/88 backdrop-blur-md">
          <div className="px-6 py-12 sm:px-10 sm:py-16">
            <Abschnitt id="willkommen" titel="Willkommen" form={0}>
              <p>
                Der Grund? Wir feiern einfach gern. Aber es gibt noch einen: Die
                Spinnerei wird 10 Jahre alt — und unser Haus, die Via Felsenau,
                sogar 33. Das lassen wir sicher nicht ungefeiert.
              </p>
              <p>
                Am 5. September ab 16 Uhr öffnen wir die Türen zu unserem Haus —
                und zwar gleich alle. Gefeiert wird auf mehreren Floors: im
                Garten, unter unserer grossen Glaspyramide, in den Wohnungen und
                im Club im Keller. Es erwarten dich Kinderprogramm, Essen, Bands,
                Theater und DJs — und das bis in die frühen Morgenstunden. Das
                Programm mit allen Acts und Zeiten schalten wir laufend auf — es
                lohnt sich also, immer wieder vorbeizuschauen.
              </p>
              <p>
                Damit wir wissen, mit wie vielen Leuten wir rechnen dürfen
                (Stichwort Essen und Getränke), bitten wir dich, vorher ein
                Ticket zu kaufen. Eine Abendkasse gibt es auch — aber ab einer
                bestimmten Anzahl Leute stoppen wir den Einlass. Mit Ticket bist
                du auf der sicheren Seite.
              </p>
              <p>
                Und noch etwas: Wir laden dich in unsere eigenen vier Wände ein.
                Darum bitten wir dich, die Info bedacht weiterzugeben — so, wie
                du es auch tun würdest, wenn du bei dir zuhause ein Fest
                schmeisst. Lieber den Menschen erzählen, die wirklich zu uns
                passen, als der ganzen Timeline.
              </p>
              <p className="font-hand text-2xl text-sun">
                Wir sehen uns am 5. September!
              </p>
            </Abschnitt>

            <Abschnitt id="programm" titel="Programm" form={1}>
              <p>
                Vier Floors, ein Haus. Das Line-up wächst laufend — hier stehen
                die Acts, die schon bestätigt sind.
              </p>

              <ul className="not-prose mt-8 grid gap-3 sm:grid-cols-2">
                {FLOORS.map((floor) => (
                  <li
                    key={floor.name}
                    className="rounded-2xl border border-white/15 bg-white/5 p-4"
                  >
                    <p className="font-display font-bold text-sky">
                      {floor.name}
                    </p>
                    <p className="mt-1 text-sm text-foam-dim">
                      {floor.beschrieb}
                    </p>
                  </li>
                ))}
              </ul>

              <h3 className="not-prose mt-12 flex items-center gap-3 font-display text-xl font-bold text-foam">
                <Coral form={2} className="h-6 w-6 text-coral" />
                Bereits bestätigt
              </h3>

              <ul className="not-prose mt-4 space-y-3">
                {ACTS.map((act) => (
                  <li
                    key={act.name}
                    className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/5 p-4"
                  >
                    <Bubble className="h-11 w-11 shrink-0">
                      <Coral
                        form={act.sparte === "Theater" ? 1 : 0}
                        className="h-6 w-6 text-night-700"
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
                      <p className="text-sm text-foam-dim">{act.sparte}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm text-foam-dim">
                Weitere Bands, DJs und die Zeiten schalten wir laufend auf.
                Schau also ruhig wieder vorbei.
              </p>
            </Abschnitt>

            <Abschnitt id="tickets" titel="Tickets" form={2}>
              <p>
                Damit wir wissen, für wie viele Leute wir kochen und einkaufen:
                Hol dir dein Ticket am besten vorher. Eine Abendkasse gibt es —
                aber ab einer bestimmten Anzahl Leute stoppen wir den Einlass.
                Mit Ticket bist du auf der sicheren Seite.
              </p>
              <div className="not-prose mt-8">
                <TicketButton />
              </div>
            </Abschnitt>

            <Abschnitt id="haus" titel="Das Haus" form={0}>
              <p>
                Die Via Felsenau ist kein Veranstaltungslokal, sondern unser
                Zuhause. Am 5. September stehen alle Türen offen — vom Garten
                über die Glaspyramide und die Wohnungen bis in den Club im
                Keller.
              </p>
              <p>
                Sei mit der Einladung einfach so umsichtig, wie du es bei dir
                selbst wärst.
              </p>
              <div className="not-prose mt-8 rounded-2xl border border-white/15 bg-white/5 p-5">
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
            </Abschnitt>
          </div>
        </div>
      </main>

      <footer className="relative bg-night-900/80 px-6 py-10 text-center backdrop-blur-md">
        <Coral form={1} className="mx-auto h-8 w-8 text-blossom/60" />
        <p className="mt-3 font-hand text-xl text-foam">
          Bis zum 5. September!
        </p>
        <p className="mt-1 text-sm text-foam-dim">
          {FEST.ort} · {FEST.anlass}
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
    <section id={id} className="scroll-mt-24 py-10 first:pt-0">
      <CoralRule form={form} />
      <h2 className="mt-8 font-display text-3xl font-extrabold text-foam sm:text-4xl">
        {titel}
      </h2>
      <div className="mt-6 space-y-5 text-[1.0625rem] leading-relaxed text-foam/90">
        {children}
      </div>
    </section>
  );
}

/** Ticket-Aufruf. Solange kein Shop-Link gesetzt ist, wird ehrlich ein
 *  Hinweis gezeigt statt eines Buttons, der ins Leere führt. */
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
      className="inline-block rounded-full bg-gradient-to-br from-coral to-blossom px-8 py-3.5 font-display text-lg font-bold text-night-900 shadow-lg shadow-coral/25 transition-transform hover:scale-[1.03] active:scale-100"
    >
      Ticket sichern
    </a>
  );
}
