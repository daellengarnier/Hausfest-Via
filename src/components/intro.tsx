"use client";

import { useEffect, useState } from "react";
import type { Sprache } from "@/lib/fest";

/**
 * Der dunkle Empfang: Beim Öffnen der Seite ist alles schwarz, nur ein
 * Laternenfisch hängt im Dunkeln — Laterne aus. Erst wer ihn antippt,
 * zündet sie: Sie flackert auf, ihr Licht blüht über den Bildschirm, und
 * dahinter kommt die Seite zum Vorschein.
 *
 * Das Overlay liegt fest über allem und sperrt solange das Scrollen.
 * Nach dem Aufleuchten blendet es aus und verschwindet ganz aus dem DOM.
 */
const TEXT = {
  hinweis: {
    de: "Hier unten ist es dunkel. Tippe den Fisch an.",
    en: "It's dark down here. Tap the fish.",
  },
  knopf: {
    de: "Licht anzünden",
    en: "Light the lantern",
  },
} as const;

export default function Intro({ sprache }: { sprache: Sprache }) {
  const [an, setAn] = useState(false);
  const [weg, setWeg] = useState(false);

  // Solange es dunkel ist, gibt es nichts zu scrollen.
  useEffect(() => {
    if (weg) return;
    const alt = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = alt;
    };
  }, [weg]);

  if (weg) return null;

  const zuenden = () => {
    if (an) return;
    setAn(true);
    // Erst flackert die Laterne, dann blüht das Licht, dann hebt sich der
    // Vorhang — das Overlay geht, wenn nichts mehr von ihm zu sehen ist.
    window.setTimeout(() => setWeg(true), 2100);
  };

  return (
    <div className={`intro ${an ? "intro-hell" : ""}`}>
      <button
        type="button"
        className="intro-fisch"
        onClick={zuenden}
        aria-label={TEXT.knopf[sprache]}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/art/sprites/anglerfisch_02.webp" alt="" />
        {/* Das Auge wandert schon im Dunkeln — er ist wach, nur das Licht
            fehlt. Gleiche Bausteine wie bei allen Fischen. */}
        <span
          className="fisch-auge"
          style={
            {
              left: "63.7%",
              top: "43.6%",
              width: "9.6%",
              "--takt": "5.5s",
            } as React.CSSProperties
          }
        >
          <span className="fisch-pupille" />
        </span>
        {/* Im Sprite ist die Birne hell GEMALT — dieser dunkle Deckel
            löscht sie, bis gezündet wird. */}
        <span className="intro-aus" />
        {/* Die Laterne: aus, bis gezündet wird. Sitzt an derselben Stelle
            wie bei den schwimmenden Fischen. */}
        <span className="intro-laterne" />
      </button>

      {/* Das grosse Licht, das nach dem Zünden vom Laternenpunkt her über
          den Bildschirm blüht. */}
      <span aria-hidden="true" className="intro-glut" />

      <p className="intro-hinweis">{TEXT.hinweis[sprache]}</p>
    </div>
  );
}
