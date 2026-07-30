"use client";

import { useEffect, useRef, useState } from "react";
import { FischStill } from "@/components/blubber";

/**
 * Vier Laternenfische, die zum Ticket-Knopf schwimmen, sobald man zu ihm
 * scrollt — zwei von links, zwei von rechts. Sie schiessen sehr schnell
 * heran, bremsen vor dem Knopf ab und warten dort: wippend, umherschauend,
 * mit pulsierender Laterne. Scrollt man weg, flitzen sie davon und kommen
 * beim nächsten Mal wieder.
 *
 * Umgesetzt als Transition auf `transform`: Im Ruhezustand stehen sie weit
 * ausserhalb der Spalte (dort unsichtbar, die Spalte schneidet ab), beim
 * Eintreffen des Abschnitts fällt der Versatz weg. Die Staffelung der
 * Verzögerungen lässt sie als Schwarm ankommen, nicht als Formation.
 */
// Posten bewusst unsymmetrisch: verschieden hoch, verschieden weit vom
// Knopf weg, verschieden gross — ein Schwarm, keine Ehrengarde.
// Die unteren zwei sind die grössten — sie stehen zuvorderst, die kleineren
// oben wirken dadurch weiter weg.
const FISCHE = [
  { art: 0, vonLinks: true, stil: { left: "-1.9rem", top: "-3.4rem", width: "5.2rem" }, warte: 0.15, dauer: 0.95 },
  { art: 1, vonLinks: true, stil: { left: "-2.4rem", top: "3.9rem", width: "6.4rem" }, warte: 0.6, dauer: 1.2 },
  { art: 1, vonLinks: false, stil: { right: "-2.2rem", top: "-1.6rem", width: "4.6rem" }, warte: 0.35, dauer: 1.05 },
  { art: 0, vonLinks: false, stil: { right: "-2.0rem", top: "3.8rem", width: "5.9rem" }, warte: 0.8, dauer: 1.3 },
] as const;

export default function TicketFische() {
  const huelle = useRef<HTMLDivElement>(null);
  const [da, setDa] = useState(false);

  useEffect(() => {
    const el = huelle.current;
    if (!el) return;
    // Zwei Wächter mit unterschiedlichen Schwellen: Losschwimmen erst,
    // wenn der Knopf im mittleren Drittel des Bildschirms angekommen ist —
    // wer dort ist, schaut auch hin. Wegflitzen aber erst, wenn der Knopf
    // ganz aus dem Bild ist, sonst verscheucht schon kleines Weiterscrollen
    // die Fische.
    const kommen = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setDa(true); },
      { rootMargin: "-38% 0px -38% 0px" },
    );
    const gehen = new IntersectionObserver(
      ([e]) => { if (!e.isIntersecting) setDa(false); },
    );
    kommen.observe(el);
    gehen.observe(el);
    return () => { kommen.disconnect(); gehen.disconnect(); };
  }, []);

  return (
    <div ref={huelle} aria-hidden="true" className="ticket-fische">
      {FISCHE.map((f, i) => (
        <span
          key={i}
          className={`tf ${da ? "tf-da" : f.vonLinks ? "tf-links" : "tf-rechts"}`}
          style={{
            ...f.stil,
            // Gestaffelt ankommen, aber gemeinsam abhauen: Die Verzögerung
            // gilt nur für den Weg hin.
            transitionDelay: da ? `${f.warte}s` : "0s",
            transitionDuration: `${f.dauer}s`,
          }}
        >
          {/* Die Fische schauen zum Knopf: von links kommend nach rechts
              (ungespiegelt), von rechts kommend gespiegelt. */}
          <FischStill art={f.art} gespiegelt={!f.vonLinks} className="tf-fisch" />
        </span>
      ))}
    </div>
  );
}
