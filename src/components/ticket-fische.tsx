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
const FISCHE = [
  { art: 0, vonLinks: true, stil: { left: "-0.7rem", top: "-1.2rem" }, warte: 0 },
  { art: 1, vonLinks: true, stil: { left: "0.2rem", top: "3.2rem" }, warte: 0.14 },
  { art: 1, vonLinks: false, stil: { right: "-0.7rem", top: "-1rem" }, warte: 0.07 },
  { art: 0, vonLinks: false, stil: { right: "0.1rem", top: "3.4rem" }, warte: 0.2 },
] as const;

export default function TicketFische() {
  const huelle = useRef<HTMLDivElement>(null);
  const [da, setDa] = useState(false);

  useEffect(() => {
    const el = huelle.current;
    if (!el) return;
    const beobachter = new IntersectionObserver(
      ([eintrag]) => setDa(eintrag.isIntersecting),
      // Erst wenn der Knopf wirklich im Bild ist — nicht schon, wenn sein
      // oberster Rand hereinlugt. Sonst schwimmen sie los, bevor man es
      // sehen kann.
      { threshold: 0.4 },
    );
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, []);

  return (
    <div ref={huelle} aria-hidden="true" className="ticket-fische">
      {FISCHE.map((f, i) => (
        <span
          key={i}
          className={`tf ${da ? "tf-da" : f.vonLinks ? "tf-links" : "tf-rechts"}`}
          style={{ ...f.stil, transitionDelay: `${f.warte}s` }}
        >
          {/* Die Fische schauen zum Knopf: von links kommend nach rechts
              (ungespiegelt), von rechts kommend gespiegelt. */}
          <FischStill art={f.art} gespiegelt={!f.vonLinks} className="tf-fisch" />
        </span>
      ))}
    </div>
  );
}
