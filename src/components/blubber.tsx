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
  /** Dauer eines Aufstiegs in s */
  dauer: number;
  verzoegerung: number;
  deckkraft: number;
  /** Seitlicher Versatz auf dem Weg nach oben, in cqw. Negativ = nach links.
   *  Damit steigt jede Blase in ihrem eigenen Winkel, statt dass alle
   *  senkrecht hochziehen. */
  drift: number;
  /** Wie weit sie steigt, in vh. */
  hoehe: number;
};

/** Blasen hinter dem Inhalt, über die ganze Seitenhöhe verteilt.
 *  Jede steigt in ihrem eigenen Winkel auf — mal schräg nach links, mal
 *  nach rechts, aber immer nach oben. Die Werte sind einmal gewürfelt und
 *  dann festgeschrieben, damit Server und Browser dasselbe rendern. */
const BLASEN: Treiber[] = [
  {
    datei: "blase_klein_01",
    groesse: 49,
    links: 70,
    oben: 1.9,
    dauer: 27,
    verzoegerung: -8,
    deckkraft: 0.4,
    drift: 5.4,
    hoehe: -82,
  },
  {
    datei: "blase_01",
    groesse: 105,
    links: 52,
    oben: 6.3,
    dauer: 32,
    verzoegerung: -36,
    deckkraft: 0.44,
    drift: -12.5,
    hoehe: -78,
  },
  {
    datei: "blase_klein_07",
    groesse: 52,
    links: 17,
    oben: 12.8,
    dauer: 28,
    verzoegerung: -35,
    deckkraft: 0.34,
    drift: -14.0,
    hoehe: -85,
  },
  {
    datei: "blase_03",
    groesse: 74,
    links: 40,
    oben: 15.7,
    dauer: 33,
    verzoegerung: -40,
    deckkraft: 0.48,
    drift: 10.0,
    hoehe: -62,
  },
  {
    datei: "blase_klein_05",
    groesse: 51,
    links: 80,
    oben: 22.5,
    dauer: 44,
    verzoegerung: -35,
    deckkraft: 0.43,
    drift: 14.8,
    hoehe: -67,
  },
  {
    datei: "blase_klein_05",
    groesse: 41,
    links: 13,
    oben: 26.4,
    dauer: 34,
    verzoegerung: -8,
    deckkraft: 0.43,
    drift: 8.5,
    hoehe: -46,
  },
  {
    datei: "blase_02",
    groesse: 78,
    links: 13,
    oben: 30.3,
    dauer: 56,
    verzoegerung: -29,
    deckkraft: 0.47,
    drift: -8.1,
    hoehe: -68,
  },
  {
    datei: "blase_klein_07",
    groesse: 51,
    links: 81,
    oben: 36.3,
    dauer: 31,
    verzoegerung: -7,
    deckkraft: 0.47,
    drift: 8.1,
    hoehe: -89,
  },
  {
    datei: "blase_klein_01",
    groesse: 50,
    links: 47,
    oben: 39.9,
    dauer: 45,
    verzoegerung: -7,
    deckkraft: 0.4,
    drift: 9.3,
    hoehe: -55,
  },
  {
    datei: "blase_03",
    groesse: 128,
    links: 33,
    oben: 46.4,
    dauer: 45,
    verzoegerung: -33,
    deckkraft: 0.42,
    drift: -8.9,
    hoehe: -86,
  },
  {
    datei: "blase_04",
    groesse: 87,
    links: 68,
    oben: 50.6,
    dauer: 47,
    verzoegerung: -38,
    deckkraft: 0.5,
    drift: -12.5,
    hoehe: -75,
  },
  {
    datei: "blase_01",
    groesse: 131,
    links: 28,
    oben: 54.0,
    dauer: 46,
    verzoegerung: -6,
    deckkraft: 0.42,
    drift: -5.3,
    hoehe: -84,
  },
  {
    datei: "blase_01",
    groesse: 99,
    links: 44,
    oben: 58.6,
    dauer: 55,
    verzoegerung: -46,
    deckkraft: 0.46,
    drift: -8.2,
    hoehe: -61,
  },
  {
    datei: "blase_02",
    groesse: 102,
    links: 17,
    oben: 64.0,
    dauer: 38,
    verzoegerung: -3,
    deckkraft: 0.38,
    drift: -12.7,
    hoehe: -91,
  },
  {
    datei: "blase_04",
    groesse: 107,
    links: 70,
    oben: 67.8,
    dauer: 48,
    verzoegerung: -37,
    deckkraft: 0.52,
    drift: -15.3,
    hoehe: -88,
  },
  {
    datei: "blase_klein_02",
    groesse: 42,
    links: 62,
    oben: 73.3,
    dauer: 56,
    verzoegerung: -24,
    deckkraft: 0.38,
    drift: 7.8,
    hoehe: -82,
  },
  {
    datei: "blase_01",
    groesse: 129,
    links: 70,
    oben: 78.1,
    dauer: 45,
    verzoegerung: -30,
    deckkraft: 0.34,
    drift: 2.1,
    hoehe: -90,
  },
  {
    datei: "blase_klein_03",
    groesse: 58,
    links: 8,
    oben: 84.2,
    dauer: 36,
    verzoegerung: -42,
    deckkraft: 0.43,
    drift: -9.0,
    hoehe: -47,
  },
  {
    datei: "blase_klein_05",
    groesse: 56,
    links: 29,
    oben: 87.0,
    dauer: 45,
    verzoegerung: -27,
    deckkraft: 0.47,
    drift: 16.0,
    hoehe: -75,
  },
  {
    datei: "blase_klein_03",
    groesse: 57,
    links: 23,
    oben: 93.8,
    dauer: 46,
    verzoegerung: -46,
    deckkraft: 0.35,
    drift: -8.2,
    hoehe: -53,
  },
];

/** Diese ziehen VOR dem Inhalt vorbei und verziehen dabei, was hinter ihnen
 *  liegt — man schaut durch die Seifenhaut. Bewusst wenige: Der Effekt
 *  kostet Rechenzeit, und zu viele nähmen die Ruhe raus. */
const BLASEN_VORN: Treiber[] = [
  {
    datei: "blase_03",
    groesse: 99,
    links: 40,
    oben: 22,
    dauer: 39,
    verzoegerung: -29,
    deckkraft: 0.52,
    drift: 10.8,
    hoehe: -70,
  },
  {
    datei: "blase_06",
    groesse: 107,
    links: 53,
    oben: 52,
    dauer: 40,
    verzoegerung: -15,
    deckkraft: 0.43,
    drift: 3.2,
    hoehe: -52,
  },
  {
    datei: "blase_01",
    groesse: 106,
    links: 75,
    oben: 80,
    dauer: 42,
    verzoegerung: -2,
    deckkraft: 0.53,
    drift: -11.3,
    hoehe: -63,
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
    deckkraft: 0.85,
    drift: 4,
    hoehe: -30,
  },
  {
    datei: "qualle_02",
    groesse: 86,
    links: 74,
    oben: 34,
    dauer: 31,
    verzoegerung: -19,
    deckkraft: 0.78,
    drift: -6,
    hoehe: -26,
  },
  {
    datei: "qualle_03",
    groesse: 118,
    links: 22,
    oben: 58,
    dauer: 35,
    verzoegerung: -27,
    deckkraft: 0.72,
    drift: 5,
    hoehe: -34,
  },
  {
    datei: "qualle_01",
    groesse: 92,
    links: 68,
    oben: 88,
    dauer: 29,
    verzoegerung: -11,
    deckkraft: 0.8,
    drift: -4,
    hoehe: -28,
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
    oben: 24,
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

/** Ein Molch, der durchs Bild zieht.
 *
 *  Der Molch ist das Wappentier des Fests — er steckt gross im
 *  Hintergrundbild. Hier schwimmt er noch einmal als eigenes Tier vorbei,
 *  aber weit hinten und ruhig: Er soll auffallen, wenn man hinschaut, und
 *  nicht stören, wenn man liest. Darum liegt er auf der hinteren Ebene und
 *  ist halb durchsichtig, wie etwas, das eine Wasserschicht weiter weg ist.
 */
type Molch = {
  datei: string;
  /** Breite in cqw — anteilig zur Spalte, wie alles am Bild. */
  breite: number;
  oben: number;
  dauer: number;
  verzoegerung: number;
  deckkraft: number;
  /** true = schwimmt nach links, das Bild wird gespiegelt */
  gespiegelt?: boolean;
  /** Mittelpunkt des gemalten Auges (Anteil von Breite und Höhe), Grösse der
   *  Iris in % der Molchbreite bzw. -höhe und der Takt eines Blickwechsels. */
  auge: { x: number; y: number; w: number; h: number; takt: number };
};

/* Die beiden schwimmen dort durch, wo zwischen den Textblasen offenes
   Wasser bleibt — sonst zögen sie hinter einer Blase vorbei und niemand
   sähe sie. */
const MOLCHE: Molch[] = [
  {
    datei: "molch_01",
    breite: 34,
    oben: 33,
    dauer: 96,
    verzoegerung: -22,
    deckkraft: 0.74,
    auge: { x: 0.9128, y: 0.8604, w: 3.4, h: 4.5, takt: 8.2 },
  },
  {
    datei: "molch_02",
    breite: 30,
    oben: 75.5,
    dauer: 118,
    verzoegerung: -74,
    deckkraft: 0.66,
    gespiegelt: true,
    auge: { x: 0.9317, y: 0.5744, w: 3.1, h: 5.1, takt: 9.6 },
  },
];

/** Der zusammengerollte Molch, der auf einer Kachel sitzt statt zu schwimmen.
 *  Wird von der Seite aus gesetzt, darum als eigene Komponente. */
const MOLCH_SITZT: Molch = {
  datei: "molch_03",
  breite: 0,
  oben: 0,
  dauer: 0,
  verzoegerung: 0,
  deckkraft: 1,
  auge: { x: 0.0889, y: 0.5532, w: 4.4, h: 5.4, takt: 7.8 },
};

function MolchKoerper({ m }: { m: Molch }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/art/sprites/${m.datei}.webp`}
        alt=""
        loading="lazy"
        style={m.gespiegelt ? { transform: "scaleX(-1)" } : undefined}
      />
      {/* Auch der Molch schaut sich um — dieselbe wandernde Pupille wie bei
          den Fischen, nur flacher, weil sein Auge ein Oval ist. */}
      <span
        className="molch-blick"
        style={
          {
            left: `${(m.gespiegelt ? 1 - m.auge.x : m.auge.x) * 100}%`,
            top: `${m.auge.y * 100}%`,
            width: `${m.auge.w}%`,
            height: `${m.auge.h}%`,
            "--takt": `${m.auge.takt}s`,
          } as React.CSSProperties
        }
      >
        <span className="molch-pupille" />
      </span>
    </>
  );
}

/** Der sitzende Molch für eine Kachel. Er schwimmt nicht, er schaut nur. */
export function MolchSitzt({ className = "" }: { className?: string }) {
  return (
    <span className={`molch-sitzt ${className}`} aria-hidden="true">
      <MolchKoerper m={MOLCH_SITZT} />
    </span>
  );
}

function stil(t: Treiber): React.CSSProperties {
  return {
    left: `${t.links}%`,
    top: `${t.oben}%`,
    width: t.groesse,
    "--dauer": `${t.dauer}s`,
    "--verzoegerung": `${t.verzoegerung}s`,
    "--drift": `${t.drift}cqw`,
    "--hoehe": `${t.hoehe}vh`,
    // Die Deckkraft steckt in der Animation: Am Anfang und Ende der Bahn
    // blendet die Blase weg, sonst würde sie am Schluss sichtbar springen.
    "--deck": t.deckkraft,
  } as React.CSSProperties;
}

export default function Blubber() {
  return (
    <>
      <div className="blubber" aria-hidden="true">
        {/* Die Molche ganz hinten, hinter Quallen und Blasen. */}
        {MOLCHE.map((m, i) => (
          <span
            key={`m${i}`}
            className={`molch ${m.gespiegelt ? "molch-links" : ""}`}
            style={
              {
                top: `${m.oben}%`,
                width: `${m.breite}cqw`,
                opacity: m.deckkraft,
                "--dauer": `${m.dauer}s`,
                "--verzoegerung": `${m.verzoegerung}s`,
              } as React.CSSProperties
            }
          >
            <span className="molch-wiege">
              <MolchKoerper m={m} />
            </span>
          </span>
        ))}

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
              <span className="blase-glas" />
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
/** Der Fisch selbst: Körper, wippende Bewegung, wanderndes Auge und die
 *  pulsende Laterne. Geteilt zwischen dem durchziehenden und dem stehenden
 *  Fisch, damit beide gleich lebendig sind. */
function FischKoerper({ f }: { f: Fisch }) {
  return (
    <span className="fisch-wippe">
      {/* Die Spiegelung sitzt am Bild, nicht am Wipp-Element: dessen transform
          gehört der Animation, sie würde sie überschreiben. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/art/sprites/${f.datei}.webp`}
        alt=""
        loading="lazy"
        style={f.gespiegelt ? { transform: "scaleX(-1)" } : undefined}
      />
      {/* Über die gemalte Iris legt sich eine eigene, in der eine Pupille hin
          und her wandert — der Fisch schaut sich um. Beim gespiegelten Fisch
          sitzt das Auge spiegelbildlich. */}
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
  );
}

/** Ein durchziehender Fisch. Beim Antippen beschleunigt er kurz und flitzt
 *  davon — über die Animations-API statt über eine kürzere CSS-Dauer, sonst
 *  würde er an eine andere Stelle springen. */
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
      <FischKoerper f={f} />
    </span>
  );
}

/** Zwei Fische, die an Ort bleiben und dort abhängen: Sie wippen, schauen
 *  sich um und ihre Laterne pulst — sie ziehen nur nicht durchs Bild. Für die
 *  Deko an den Textblasen. */
const STILL: Fisch[] = [
  {
    datei: "anglerfisch_02",
    groesse: 120,
    oben: 0,
    dauer: 26,
    verzoegerung: 0,
    laterne: { x: 0.87, y: 0.17, weite: 52, takt: 2.6 },
    auge: { x: 0.637, y: 0.436, iris: 9.6, takt: 5.9 },
  },
  {
    datei: "anglerfisch_04",
    groesse: 120,
    oben: 0,
    dauer: 31,
    verzoegerung: 0,
    laterne: { x: 0.83, y: 0.155, weite: 48, takt: 3.6 },
    auge: { x: 0.63, y: 0.417, iris: 11.3, takt: 7.6 },
  },
];

export function FischStill({
  art = 0,
  gespiegelt = false,
  className = "",
}: {
  art?: 0 | 1;
  gespiegelt?: boolean;
  className?: string;
}) {
  const f = STILL[art];
  return (
    <span
      className={`fisch-still ${className}`}
      style={{ "--dauer": `${f.dauer}s` } as React.CSSProperties}
    >
      <FischKoerper f={{ ...f, gespiegelt }} />
    </span>
  );
}

