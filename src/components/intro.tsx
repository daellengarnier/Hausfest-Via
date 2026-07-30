"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import type { Sprache } from "@/lib/fest";

/**
 * Der dunkle Empfang: Beim Öffnen der Seite ist alles schwarz, nur ein
 * Laternenfisch hängt im Dunkeln — Laterne aus. Erst wer ihn antippt,
 * zündet sie: Sie flackert auf, ihr Licht blüht über den Bildschirm, der
 * schwarze Vorhang hebt sich — und der Fisch bleibt: Mit brennender
 * Laterne schwimmt er sichtbar über die Seite davon, hinein in die
 * Bildwelt, zu der er gehört.
 *
 * Kommt einmal pro Sitzung: Wer die Laterne gezündet hat, bekommt beim
 * nächsten Laden im selben Tab direkt die Seite (auch beim Wechsel
 * zwischen Deutsch und Englisch).
 */
const MERKER = "via-intro-gezuendet";

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
  const [an, setAn] = useState(false); // Laterne gezündet
  const [frei, setFrei] = useState(false); // Vorhang hebt sich, Fisch geht
  const [weg, setWeg] = useState(false); // alles vorbei, raus aus dem DOM

  // Einmal pro Sitzung: Wurde schon gezündet, gleich überspringen.
  // Layout-Effekt statt Effekt, damit es vor dem ersten Malen passiert —
  // sonst blitzte der schwarze Vorhang kurz auf.
  useLayoutEffect(() => {
    // Absichtlich synchron: Der Zustand muss VOR dem ersten Malen stehen,
    // sonst blitzt der Vorhang bei Wiederkehrenden kurz auf.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (window.sessionStorage.getItem(MERKER)) setWeg(true);
  }, []);

  // Solange es dunkel ist, gibt es nichts zu scrollen. Sobald der Vorhang
  // sich hebt, gehört die Seite wieder den Leuten — der Fisch schwimmt
  // dann über ihr davon.
  useEffect(() => {
    if (weg || frei) return;
    const alt = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = alt;
    };
  }, [weg, frei]);

  if (weg) return null;

  const zuenden = () => {
    if (an) return;
    setAn(true);
    window.sessionStorage.setItem(MERKER, "1");
    // Erst flackert die Laterne und das Licht blüht, dann hebt sich der
    // Vorhang und der Fisch schwimmt davon; weg ist er erst, wenn er
    // draussen ist.
    window.setTimeout(() => setFrei(true), 1500);
    window.setTimeout(() => setWeg(true), 1500 + 3600);
  };

  return (
    <div
      className={`intro ${an ? "intro-hell" : ""} ${frei ? "intro-frei" : ""}`}
    >
      {/* Der schwarze Vorhang als eigene Ebene HINTER dem Fisch: Er kann
          ausblenden, ohne den Fisch mitzunehmen. Das grosse Licht wohnt in
          ihm und geht mit ihm. */}
      <span aria-hidden="true" className="intro-vorhang">
        <span className="intro-glut" />
      </span>

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

      <p className="intro-hinweis">{TEXT.hinweis[sprache]}</p>
    </div>
  );
}
