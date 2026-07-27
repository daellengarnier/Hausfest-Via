import SiteNav from "@/components/site-nav";
import {
  Achtung,
  Bubble,
  Coral,
  CoralRule,
  FloorIcon,
  Haken,
  SparteIcon,
} from "@/components/doodles";
import {
  ACTS,
  FEST,
  FLOORS,
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
      <header className="relative px-6 pb-12 pt-10 text-center sm:pb-16 sm:pt-16">
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

          {/* Wann, wo und warum in einem Block — auf eigener dunkler Fläche,
              sonst gehen die Zahlen in der Zeichnung unter. */}
          <div className="mt-8 inline-flex flex-col items-center rounded-3xl border border-white/25 bg-night-900/75 px-7 py-5 backdrop-blur-md">
            <p className="font-display text-xl font-bold text-foam sm:text-2xl">
              {FEST.datum}
            </p>
            <p className="text-foam-dim">
              {FEST.zeit} · {FEST.ort}
            </p>

            <div className="ink-rule mt-4 w-full" />

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
            {/* Zuoberst das Ticket: erst der Grund, dann die zwei Wege
                hinein, dann der Knopf. */}
            <Abschnitt id="tickets" titel="Tickets" form={0}>
              <p>
                Wir kochen und kaufen für alle ein, die kommen. Darum brauchen
                wir eine Ahnung, mit wie vielen wir rechnen dürfen.
              </p>

              <div className="not-prose mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-mint/40 bg-mint/10 p-4">
                  <p className="flex items-center gap-2 font-display font-bold text-mint">
                    <Haken className="h-5 w-5 shrink-0" />
                    Mit Ticket
                  </p>
                  <p className="mt-1.5 text-sm text-foam-dim">
                    Du bist sicher dabei. Und wir wissen, für wie viele wir
                    einkaufen.
                  </p>
                </div>
                <div className="rounded-2xl border border-sun/40 bg-sun/10 p-4">
                  <p className="flex items-center gap-2 font-display font-bold text-sun">
                    <Achtung className="h-5 w-5 shrink-0" />
                    Abendkasse
                  </p>
                  <p className="mt-1.5 text-sm text-foam-dim">
                    Gibt es auch — aber ab einer bestimmten Anzahl Leute
                    stoppen wir den Einlass.
                  </p>
                </div>
              </div>

              <div className="not-prose mt-7 flex flex-col items-center gap-4">
                <TicketButton />
                <TicketPasswort />
              </div>
            </Abschnitt>

            {/* Der Absatz über die offenen Türen bleibt unangetastet — die
                Floors darunter fächern ihn nur visuell auf. */}
            <Abschnitt id="fest" titel="Das Fest" form={1}>
              <p>
                Der Grund? Wir feiern einfach gern. Und dieses Jahr gleich
                doppelt.
              </p>
              {/* Wortlaut unverändert, nur in zwei Absätze geteilt — als ein
                  Block war es am Handy eine Wand. */}
              <p>
                Am 5. September ab 16 Uhr öffnen wir die Türen zu unserem Haus
                — und zwar gleich alle. Gefeiert wird auf mehreren Floors: im
                Garten, unter unserer grossen Glaspyramide, in den Wohnungen
                und im Club im Keller.
              </p>
              <p>
                Es erwarten dich Kinderprogramm, Essen, Bands, Theater und DJs
                — und das bis in die frühen Morgenstunden. Das Programm mit
                allen Acts und Zeiten schalten wir laufend auf — es lohnt sich
                also, immer wieder vorbeizuschauen.
              </p>

              <ul className="not-prose mt-7 grid gap-3 sm:grid-cols-2">
                {FLOORS.map((floor) => (
                  <li
                    key={floor.name}
                    className="flex items-start gap-3 rounded-2xl border border-white/15 bg-white/5 p-4"
                  >
                    <FloorIcon
                      art={floor.icon}
                      className="mt-0.5 h-6 w-6 shrink-0 text-sky"
                    />
                    <div className="min-w-0">
                      <p className="font-display font-bold text-foam">
                        {floor.name}
                      </p>
                      <p className="mt-0.5 text-sm text-foam-dim">
                        {floor.beschrieb}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Abschnitt>

            <Abschnitt id="lineup" titel="Line-up" form={2}>
              <p>Diese Acts sind bestätigt — weitere kommen laufend dazu.</p>

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
                      <p className="text-sm text-foam-dim">{act.sparte}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Abschnitt>

            <Abschnitt id="haus" titel="Das Haus" form={0}>
              <p>
                Die Via Felsenau ist kein Veranstaltungslokal, sondern unser
                Zuhause. Wir laden dich in unsere eigenen vier Wände ein — sei
                mit der Einladung also so umsichtig, wie du es bei dir selbst
                wärst. Lieber den Menschen erzählen, die wirklich zu uns
                passen, als der ganzen Timeline.
              </p>

              <div className="not-prose mt-7 rounded-2xl border border-white/15 bg-white/5 p-5">
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
          Wir sehen uns am 5. September!
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

/** Das Shop-Passwort — gross genug, um es im Laden abzutippen. */
function TicketPasswort() {
  if (!TICKET_URL || !TICKET_PASSWORT) return null;
  return (
    <p className="text-center text-sm text-foam-dim">
      Der Shop ist geschützt. Passwort:{" "}
      <span className="ml-1 inline-block rounded-lg border border-white/20 bg-white/10 px-2.5 py-1 font-display font-bold tracking-wide text-foam">
        {TICKET_PASSWORT}
      </span>
    </p>
  );
}
