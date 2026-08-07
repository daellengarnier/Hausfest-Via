"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Sprache } from "@/lib/fest";
import { Seegras } from "@/components/doodles";

/**
 * Das gezeichnete Fest-Plakat: klein zeigen, gross öffnen.
 *
 * Das Wimmelbild ist hell und bunt — voll eingebettet bräche es die
 * dunkle Bildwelt der Seite. Darum hängt es nur als kleine, schief
 * angepinnte Vorschau am Ende des Programms; wer es antippt, bekommt es
 * als Vollbild auf dunklem Grund. Das grosse Bild lädt erst in dem
 * Moment.
 */
const TEXT = {
  zeile: {
    de: "Das ganze Fest auf einen Blick —",
    en: "The whole party at a glance —",
  },
  zeile2: {
    de: "tippe aufs gezeichnete Plakat.",
    en: "tap the hand-drawn poster.",
  },
  offen: { de: "Plakat gross anzeigen", en: "Show poster full size" },
  zu: { de: "Schliessen", en: "Close" },
  laden: { de: "Plakat herunterladen", en: "Download poster" },
  alt: {
    de: "Das gezeichnete Fest-Plakat: das Haus mit allen Floors, Bands und Zeiten als Wimmelbild",
    en: "The hand-drawn festival poster: the house with all floors, bands and times",
  },
} as const;

export default function Plakat({ sprache }: { sprache: Sprache }) {
  const [offen, setOffen] = useState(false);

  // Solange das Plakat offen ist, scrollt die Seite dahinter nicht.
  useEffect(() => {
    if (!offen) return;
    const alt = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const zu = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOffen(false);
    };
    window.addEventListener("keydown", zu);
    return () => {
      document.body.style.overflow = alt;
      window.removeEventListener("keydown", zu);
    };
  }, [offen]);

  return (
    <>
      <div className="not-prose mt-7 flex items-center gap-4">
        <button
          type="button"
          onClick={() => setOffen(true)}
          aria-label={TEXT.offen[sprache]}
          className="plakat-knopf shrink-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/art/plakat_vorschau.webp"
            alt={TEXT.alt[sprache]}
            loading="lazy"
            width={480}
            height={679}
          />
          <Seegras art={2} className="-bottom-3 -right-3 w-14" />
        </button>
        <p className="text-[0.9375rem] leading-snug text-foam-dim">
          {TEXT.zeile[sprache]}
          <br />
          {TEXT.zeile2[sprache]}
        </p>
      </div>

      {/* Das Vollbild als Portal an den Body: Die Kacheln tragen eine
          transform-Animation, und innerhalb einer Transform-Ebene meint
          `position: fixed` nicht mehr den Bildschirm. */}
      {offen ? createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={TEXT.alt[sprache]}
          className="plakat-vollbild"
          onClick={() => setOffen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/art/plakat_gross.webp" alt={TEXT.alt[sprache]} />
          <button
            type="button"
            aria-label={TEXT.zu[sprache]}
            className="plakat-zu"
            onClick={() => setOffen(false)}
          >
            ×
          </button>
          {/* Zum Mitnehmen: dieselbe Grafik in Druckqualität. Der Klick
              darf das Vollbild nicht schliessen — der Backdrop-Handler
              liegt auf dem Container. */}
          <a
            href="/art/plakat_download.jpg"
            download="Hausfest-Via-Plakat.jpg"
            className="absolute bottom-[max(1.4rem,env(safe-area-inset-bottom))] left-1/2 inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-sky/50 bg-night-900/80 px-4 py-2 text-sm text-foam backdrop-blur-sm transition-colors hover:bg-sky/25"
            onClick={(e) => e.stopPropagation()}
          >
            <LadenIcon className="h-4 w-4" />
            {TEXT.laden[sprache]}
          </a>
        </div>,
        document.body,
      ) : null}
    </>
  );
}

/** Pfeil in die Ablage — gleicher Strich wie die übrigen Icons. */
function LadenIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4v10" />
      <path d="m8 10.5 4 4 4-4" />
      <path d="M4.5 16.5v2.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-2.5" />
    </svg>
  );
}
