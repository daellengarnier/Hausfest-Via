"use client";

import { useEffect, useState } from "react";
import { NAV } from "@/lib/fest";

/**
 * Klebende Navigation als Blasenreihe. Der aktive Abschnitt wird beim
 * Scrollen hervorgehoben; auf schmalen Displays ist die Reihe horizontal
 * scrollbar statt umgebrochen.
 */
export default function SiteNav() {
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

  return (
    <nav
      aria-label="Abschnitte"
      // Kein durchgehender Balken: Der würde den oberen Bildrand zudecken,
      // wo die Flosse des Molchs sitzt. Die einzelnen Knöpfe bringen ihren
      // eigenen Hintergrund mit und bleiben so trotzdem lesbar.
      className="sticky top-0 z-50"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <ul className="mx-auto flex max-w-3xl items-center justify-center gap-1.5 px-2 py-2.5 sm:gap-2 sm:px-4 sm:py-3">
        {NAV.map((n) => {
          const ist = aktiv === n.id;
          return (
            <li key={n.id} className="shrink-0">
              <a
                href={`#${n.id}`}
                aria-current={ist ? "true" : undefined}
                className={`block rounded-full border px-3 py-1.5 text-[0.8125rem] whitespace-nowrap backdrop-blur-md transition-colors sm:px-4 sm:text-sm ${
                  ist
                    ? "border-sky/70 bg-sky/35 text-foam"
                    : "border-white/25 bg-night-900/45 text-foam hover:border-white/50"
                }`}
              >
                {n.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
