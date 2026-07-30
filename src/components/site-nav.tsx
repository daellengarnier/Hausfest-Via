"use client";

import { useEffect, useState } from "react";
import type { Sprache } from "@/lib/fest";
import { NAV } from "@/lib/fest";

/**
 * Klebende Navigation als Blasenreihe. Der aktive Abschnitt wird beim
 * Scrollen hervorgehoben; auf schmalen Displays ist die Reihe horizontal
 * schiebbar statt umgebrochen.
 *
 * Ganz rechts der Sprachwechsel: ein Knopf, der zur jeweils anderen
 * Fassung führt (/ ↔ /en). Ein Link statt eines Umschalters im Zustand —
 * so hat jede Sprache ihre eigene Adresse, die sich teilen und
 * verlinken lässt, und der Wechsel funktioniert ohne JavaScript.
 */
export default function SiteNav({ sprache }: { sprache: Sprache }) {
  const [aktiv, setAktiv] = useState<string>(NAV[0].id);

  useEffect(() => {
    const abschnitte = NAV.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (abschnitte.length === 0) return;

    const beobachter = new IntersectionObserver(
      (eintraege) => {
        // Der oberste gerade sichtbare Abschnitt gewinnt.
        const sichtbar = eintraege
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (sichtbar[0]) setAktiv(sichtbar[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    abschnitte.forEach((el) => beobachter.observe(el));
    return () => beobachter.disconnect();
  }, []);

  // Etwas engere Polster als früher: Mit dem Sprachknopf daneben zählt
  // jeder Millimeter, damit die vier Abschnitte auf dem Handy ohne
  // Schieben sichtbar bleiben.
  const knopf = (ist: boolean) =>
    `block rounded-full border px-2 py-1.5 text-[0.78rem] whitespace-nowrap backdrop-blur-md transition-colors ${
      ist
        ? "border-sky/70 bg-sky/35 text-foam"
        : "border-white/25 bg-night-900/45 text-foam hover:border-white/50"
    }`;

  return (
    <nav
      aria-label="Abschnitte"
      // Kein durchgehender Balken: Der würde den oberen Bildrand zudecken,
      // wo die Flosse des Molchs sitzt. Die einzelnen Knöpfe bringen ihren
      // eigenen Hintergrund mit und bleiben so trotzdem lesbar.
      className="sticky top-0 z-50"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex items-center gap-1 px-2 py-2.5">
        {/* Auf schmalen Displays passen die Knöpfe nicht nebeneinander.
            Dann lässt sich die Reihe seitlich schieben, statt dass der
            letzte abgeschnitten wird — `safe center` hält sie mittig,
            solange sie Platz hat, und rückt sie erst beim Überlaufen nach
            links. */}
        <ul className="nav-reihe flex flex-1 items-center justify-[safe_center] gap-1 overflow-x-auto">
          {NAV.map((n) => {
            const ist = aktiv === n.id;
            return (
              <li key={n.id} className="shrink-0">
                <a
                  href={`#${n.id}`}
                  aria-current={ist ? "true" : undefined}
                  className={knopf(ist)}
                >
                  {n.label[sprache]}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Der Sprachwechsel steht NEBEN der schiebbaren Reihe, nicht darin:
            Er muss auf jeder Breite sichtbar sein — in der Reihe war er auf
            dem Handy hinter dem Rand versteckt. */}
        <a
          href={sprache === "de" ? "/en" : "/"}
          // hreflang sagt Browsern und Suchmaschinen, wohin der Link führt.
          hrefLang={sprache === "de" ? "en" : "de"}
          aria-label={
            sprache === "de" ? "Switch to English" : "Zur deutschen Seite"
          }
          className={`${knopf(false)} shrink-0 font-bold`}
        >
          {sprache === "de" ? "EN" : "DE"}
        </a>
      </div>
    </nav>
  );
}
