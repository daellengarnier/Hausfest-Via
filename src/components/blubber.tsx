"use client";

/**
 * Blasen, Quallen und Laternenfische, die im Wasser der Seite treiben.
 *
 * Wichtig: Sie gehören zur SEITE, nicht zum Bildschirm. Ihre Ebenen sind
 * absolut über das ganze Dokument gespannt, nicht am Viewport festgemacht —
 * beim Scrollen wandern sie also mit nach oben, so wie ein Gegenstand, der
 * in einer bestimmten Tiefe hängt. Zusätzlich bewegt sich jedes Objekt noch
 * ein Stück für sich: Blasen steigen und pendeln, Quallen wiegen sich,
 * Fische ziehen waagrecht durch.
 *
 * Die Werte sind von Hand gesetzt statt zufällig: So sieht die Seite bei
 * jedem Aufruf gleich aus, Server und Browser rendern dasselbe, und die
 * Objekte lassen sich gezielt über die ganze Länge verteilen.
 *
 * Negative Verzögerungen starten die Bewegung mitten im Lauf — sonst stünde
 * beim Öffnen alles still am Anfangspunkt.
 *
 * Client-Komponente, weil die Fische auf Antippen reagieren: Sie flitzen dann
 * kurz davon.
 */

import { useCallback } from "react";

type Treiber = {
  datei: string;
  /** Breite in px */
  groesse: number;
  /** Position im Dokument: von links in %, von oben in % */
  links: number;
  oben: number;
  /** Dauer einer Hin- und Herbewegung in s */
  dauer: number;
  verzoegerung: number;
  deckkraft: number;
  /** Kräftigere Verzerrung — für die Blasen, die über den Titel ziehen. */
  stark?: boolean;
};

/** Blasen hinter dem Inhalt, über die ganze Seitenhöhe verteilt. */
const BLASEN: Treiber[] = [
  {
    datei: "blase_01",
    groesse: 128,
    links: 4,
    oben: 3,
    dauer: 17,
    verzoegerung: -2,
    deckkraft: 0.5,
  },
  {
    datei: "blase_klein_02",
    groesse: 52,
    links: 78,
    oben: 7,
    dauer: 11,
    verzoegerung: -6,
    deckkraft: 0.45,
  },
  {
    datei: "blase_03",
    groesse: 92,
    links: 66,
    oben: 14,
    dauer: 21,
    verzoegerung: -13,
    deckkraft: 0.4,
  },
  {
    datei: "blase_klein_05",
    groesse: 44,
    links: 12,
    oben: 19,
    dauer: 9,
    verzoegerung: -4,
    deckkraft: 0.5,
  },
  {
    datei: "blase_06",
    groesse: 104,
    links: 84,
    oben: 25,
    dauer: 19,
    verzoegerung: -11,
    deckkraft: 0.4,
  },
  {
    datei: "blase_klein_07",
    groesse: 40,
    links: 30,
    oben: 31,
    dauer: 13,
    verzoegerung: -8,
    deckkraft: 0.45,
  },
  {
    datei: "blase_02",
    groesse: 116,
    links: 6,
    oben: 37,
    dauer: 23,
    verzoegerung: -17,
    deckkraft: 0.45,
  },
  {
    datei: "blase_klein_01",
    groesse: 56,
    links: 88,
    oben: 43,
    dauer: 12,
    verzoegerung: -3,
    deckkraft: 0.5,
  },
  {
    datei: "blase_04",
    groesse: 78,
    links: 20,
    oben: 49,
    dauer: 16,
    verzoegerung: -9,
    deckkraft: 0.4,
  },
  {
    datei: "blase_klein_03",
    groesse: 48,
    links: 72,
    oben: 55,
    dauer: 10,
    verzoegerung: -5,
    deckkraft: 0.45,
  },
  {
    datei: "blase_01",
    groesse: 96,
    links: 82,
    oben: 62,
    dauer: 20,
    verzoegerung: -14,
    deckkraft: 0.4,
  },
  {
    datei: "blase_klein_02",
    groesse: 46,
    links: 10,
    oben: 68,
    dauer: 11,
    verzoegerung: -7,
    deckkraft: 0.5,
  },
  {
    datei: "blase_03",
    groesse: 84,
    links: 34,
    oben: 74,
    dauer: 18,
    verzoegerung: -12,
    deckkraft: 0.4,
  },
  {
    datei: "blase_klein_05",
    groesse: 42,
    links: 90,
    oben: 80,
    dauer: 9,
    verzoegerung: -2,
    deckkraft: 0.45,
  },
  {
    datei: "blase_06",
    groesse: 110,
    links: 8,
    oben: 86,
    dauer: 22,
    verzoegerung: -16,
    deckkraft: 0.4,
  },
  {
    datei: "blase_klein_07",
    groesse: 50,
    links: 60,
    oben: 92,
    dauer: 12,
    verzoegerung: -6,
    deckkraft: 0.45,
  },
  {
    datei: "blase_02",
    groesse: 88,
    links: 26,
    oben: 96,
    dauer: 17,
    verzoegerung: -10,
    deckkraft: 0.4,
  },
];

/** Diese ziehen VOR dem Inhalt vorbei und verziehen dabei, was hinter ihnen
 *  liegt — man schaut durch die Seifenhaut. Bewusst wenige: Der Effekt
 *  kostet Rechenzeit, und zu viele nähmen die Ruhe raus. */
const BLASEN_VORN: Treiber[] = [
  // Drei direkt über dem Titel — sie ziehen über die Schrift und verziehen
  // sie dabei kräftig.
  {
    datei: "blase_01",
    groesse: 150,
    links: 2,
    oben: 1.1,
    dauer: 13,
    verzoegerung: -2,
    deckkraft: 0.6,
    stark: true,
  },
  {
    datei: "blase_02",
    groesse: 128,
    links: 58,
    oben: 0.7,
    dauer: 17,
    verzoegerung: -9,
    deckkraft: 0.55,
    stark: true,
  },
  {
    datei: "blase_03",
    groesse: 104,
    links: 32,
    oben: 2.1,
    dauer: 11,
    verzoegerung: -5,
    deckkraft: 0.5,
    stark: true,
  },
  {
    datei: "blase_02",
    groesse: 118,
    links: 62,
    oben: 4,
    dauer: 15,
    verzoegerung: -3,
    deckkraft: 0.55,
  },
  {
    datei: "blase_klein_03",
    groesse: 58,
    links: 16,
    oben: 41,
    dauer: 11,
    verzoegerung: -7,
    deckkraft: 0.5,
  },
  {
    datei: "blase_04",
    groesse: 86,
    links: 76,
    oben: 78,
    dauer: 18,
    verzoegerung: -12,
    deckkraft: 0.45,
  },
];

/** Quallen wiegen sich ruhiger und weiter als die Blasen. */
const QUALLEN: Treiber[] = [
  {
    datei: "qualle_01",
    groesse: 104,
    links: 14,
    oben: 11,
    dauer: 26,
    verzoegerung: -6,
    deckkraft: 0.6,
  },
  {
    datei: "qualle_02",
    groesse: 86,
    links: 74,
    oben: 34,
    dauer: 31,
    verzoegerung: -19,
    deckkraft: 0.5,
  },
  {
    datei: "qualle_03",
    groesse: 118,
    links: 22,
    oben: 58,
    dauer: 35,
    verzoegerung: -27,
    deckkraft: 0.45,
  },
  {
    datei: "qualle_01",
    groesse: 92,
    links: 68,
    oben: 88,
    dauer: 29,
    verzoegerung: -11,
    deckkraft: 0.5,
  },
];

/** Die Fische schwimmen voll deckend — nur Blasen und Quallen sind
 *  durchscheinend, so wie sich Seifenblasen und Quallen eben verhalten. */
type Fisch = {
  datei: string;
  groesse: number;
  /** Position im Dokument, von oben in % */
  oben: number;
  dauer: number;
  verzoegerung: number;
  /** true = schwimmt nach links */
  gespiegelt?: boolean;
  /** Wo der Leuchtkörper im Bild sitzt (Anteil von Breite und Höhe), wie weit
   *  das Leuchten reicht (% der Fischbreite) und wie schnell es pulst (s).
   *  Je Fisch ein anderer Takt, sonst blinken sie im Gleichschritt. */
  laterne: { x: number; y: number; weite: number; takt: number };
  /** Das Auge: Mittelpunkt (Anteil von Breite und Höhe), Durchmesser der Iris
   *  in % der Fischbreite und wie lange ein Blickwechsel dauert. Darüber legt
   *  sich eine bewegliche Pupille, damit der Fisch sich umschaut. */
  auge: { x: number; y: number; iris: number; takt: number };
  /** Einer im Schwarm ist ein Disco-Fisch: Seine Laterne blinkt farbig durch,
   *  statt ruhig weiss zu pulsen. */
  disco?: boolean;
};

const FISCHE: Fisch[] = [
  {
    datei: "anglerfisch_02",
    groesse: 150,
    oben: 8,
    dauer: 44,
    verzoegerung: -18,
    laterne: { x: 0.87, y: 0.17, weite: 52, takt: 2.4 },
    auge: { x: 0.637, y: 0.436, iris: 9.6, takt: 5.5 },
  },
  {
    datei: "anglerfisch_04",
    groesse: 108,
    oben: 46,
    dauer: 61,
    verzoegerung: -54,
    gespiegelt: true,
    laterne: { x: 0.83, y: 0.155, weite: 48, takt: 3.3 },
    auge: { x: 0.63, y: 0.417, iris: 11.3, takt: 7.1 },
  },
  {
    datei: "anglerfisch_02",
    groesse: 124,
    oben: 83,
    dauer: 53,
    verzoegerung: -31,
    gespiegelt: true,
    laterne: { x: 0.87, y: 0.17, weite: 52, takt: 2.9 },
    auge: { x: 0.637, y: 0.436, iris: 9.6, takt: 6.3 },
  },
  // Der Disco-Fisch. Schwimmt selten und weit unten durch, damit es eine
  // Entdeckung bleibt und kein Dauerlicht.
  {
    datei: "anglerfisch_04",
    groesse: 132,
    oben: 64,
    dauer: 57,
    verzoegerung: -6,
    laterne: { x: 0.83, y: 0.155, weite: 58, takt: 1.1 },
    auge: { x: 0.63, y: 0.417, iris: 11.3, takt: 4.4 },
    disco: true,
  },
];

function stil(t: Treiber): React.CSSProperties {
  return {
    left: `${t.links}%`,
    top: `${t.oben}%`,
    width: t.groesse,
    opacity: t.deckkraft,
    "--dauer": `${t.dauer}s`,
    "--verzoegerung": `${t.verzoegerung}s`,
  } as React.CSSProperties;
}

export default function Blubber() {
  return (
    <>
      <div className="blubber" aria-hidden="true">
        {QUALLEN.map((q, i) => (
          <span key={`q${i}`} className="treiber qualle" style={stil(q)}>
            <span className="qualle-wiege">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/art/sprites/${q.datei}.webp`} alt="" loading="lazy" />
            </span>
          </span>
        ))}

        {BLASEN.map((b, i) => (
          <span key={`b${i}`} className="treiber blase" style={stil(b)}>
            <span className="blase-pendel">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/art/sprites/${b.datei}.webp`} alt="" loading="lazy" />
            </span>
          </span>
        ))}
      </div>

      {/* Eigene Ebene vor dem Inhalt: Fische ziehen über Text und Karten
          hinweg, und ein paar Blasen verziehen, was hinter ihnen liegt. */}
      <div className="blubber-vorn" aria-hidden="true">
        {BLASEN_VORN.map((b, i) => (
          <span key={`v${i}`} className="treiber blase" style={stil(b)}>
            <span className="blase-pendel relative block">
              <span
                className={`blase-glas ${b.stark ? "blase-glas-stark" : ""}`}
              />
              {b.stark ? <span className="blase-glas-kern" /> : null}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/art/sprites/${b.datei}.webp`}
                alt=""
                loading="lazy"
                className="relative"
              />
            </span>
          </span>
        ))}

        {FISCHE.map((f, i) => (
          <FischBild key={`f${i}`} f={f} />
        ))}
      </div>
    </>
  );
}

/** Ein Laternenfisch. Beim Antippen beschleunigt er kurz und flitzt davon.
 *
 *  Umgesetzt über die Animations-API statt über eine kürzere CSS-Dauer: Wird
 *  `animation-duration` mitten im Lauf getauscht, springt der Fisch an eine
 *  andere Stelle. `updatePlaybackRate` ändert nur das Tempo, die Position
 *  bleibt — es sieht aus wie ein echter Schreck. */
function FischBild({ f }: { f: Fisch }) {
  const flitzen = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const lauf = el.getAnimations().find((a) => a.playState === "running");
    if (!lauf) return;
    lauf.updatePlaybackRate(9);
    // Sanft wieder herunter, sonst bremst er wie gegen eine Wand.
    window.setTimeout(() => lauf.updatePlaybackRate(3), 1400);
    window.setTimeout(() => lauf.updatePlaybackRate(1), 2600);
  }, []);

  return (
    <span
      className={`fisch ${f.gespiegelt ? "fisch-links" : ""}`}
      onPointerDown={flitzen}
      style={
        {
          top: `${f.oben}%`,
          width: f.groesse,
          "--dauer": `${f.dauer}s`,
          "--verzoegerung": `${f.verzoegerung}s`,
        } as React.CSSProperties
      }
    >
      <span className="fisch-wippe">
        {/* Die Spiegelung sitzt am Bild, nicht am Wipp-Element: dessen
                  transform gehört der Animation, sie würde sie überschreiben. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/art/sprites/${f.datei}.webp`}
          alt=""
          loading="lazy"
          style={f.gespiegelt ? { transform: "scaleX(-1)" } : undefined}
        />
        {/* Das Auge: Über die gemalte Iris legt sich eine eigene, in
                  der eine Pupille hin und her wandert — der Fisch schaut sich
                  um. Beim gespiegelten Fisch sitzt das Auge spiegelbildlich. */}
        <span
          className="fisch-auge"
          style={
            {
              left: `${(f.gespiegelt ? 1 - f.auge.x : f.auge.x) * 100}%`,
              top: `${f.auge.y * 100}%`,
              width: `${f.auge.iris}%`,
              "--takt": `${f.auge.takt}s`,
            } as React.CSSProperties
          }
        >
          <span className="fisch-pupille" />
        </span>

        {/* Das Leuchten der Laterne. Beim gespiegelten Fisch wandert
                  auch der Leuchtkörper auf die andere Seite. */}
        <span
          className={`laterne ${f.disco ? "laterne-disco" : ""}`}
          style={
            {
              left: `${(f.gespiegelt ? 1 - f.laterne.x : f.laterne.x) * 100}%`,
              top: `${f.laterne.y * 100}%`,
              width: `${f.laterne.weite}%`,
              "--takt": `${f.laterne.takt}s`,
            } as React.CSSProperties
          }
        />
      </span>
    </span>
  );
}
