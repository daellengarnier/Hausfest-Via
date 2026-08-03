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
        </div>,
        document.body,
      ) : null}
    </>
  );
}
