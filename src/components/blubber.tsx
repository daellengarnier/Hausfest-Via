/**
 * Blasen und Laternenfische, die durchs Bild treiben: Die Blasen steigen
 * hinter dem Inhalt auf, die Fische ziehen davor durch.
 *
 * Die Werte sind bewusst von Hand gesetzt statt zufällig: So sieht die Seite
 * bei jedem Aufruf gleich aus, Server und Browser rendern dasselbe, und die
 * Bahnen lassen sich gezielt entzerren, damit nicht alles im Gleichschritt
 * aufsteigt.
 *
 * Negative Verzögerungen starten die Animation mitten im Lauf — sonst wäre
 * beim Öffnen der Seite erst einmal nichts zu sehen.
 */

type Blase = {
  datei: string;
  /** Breite in px */
  groesse: number;
  /** Abstand von links in % */
  links: number;
  /** Dauer eines Aufstiegs in s */
  dauer: number;
  verzoegerung: number;
  /** seitlicher Ausschlag in px */
  drift: number;
  deckkraft: number;
};

const BLASEN: Blase[] = [
  { datei: "blase_01", groesse: 132, links: 6, dauer: 52, verzoegerung: -8, drift: 26, deckkraft: 0.5 },
  { datei: "blase_klein_02", groesse: 54, links: 22, dauer: 34, verzoegerung: -21, drift: 16, deckkraft: 0.45 },
  { datei: "blase_03", groesse: 96, links: 38, dauer: 61, verzoegerung: -37, drift: 32, deckkraft: 0.4 },
  { datei: "blase_klein_05", groesse: 46, links: 52, dauer: 29, verzoegerung: -12, drift: 14, deckkraft: 0.5 },
  { datei: "blase_02", groesse: 118, links: 66, dauer: 47, verzoegerung: -29, drift: 24, deckkraft: 0.45 },
  { datei: "blase_klein_01", groesse: 58, links: 80, dauer: 38, verzoegerung: -4, drift: 18, deckkraft: 0.5 },
  { datei: "blase_06", groesse: 104, links: 88, dauer: 56, verzoegerung: -44, drift: 28, deckkraft: 0.4 },
  { datei: "blase_klein_07", groesse: 42, links: 14, dauer: 26, verzoegerung: -17, drift: 12, deckkraft: 0.45 },
  { datei: "blase_klein_03", groesse: 50, links: 72, dauer: 33, verzoegerung: -25, drift: 15, deckkraft: 0.4 },
  { datei: "blase_04", groesse: 78, links: 46, dauer: 43, verzoegerung: -33, drift: 20, deckkraft: 0.35 },
];

/** Die Fische schwimmen voll deckend — nur die Blasen sind durchscheinend,
 *  so wie sich Seifenblasen eben verhalten. */
type Fisch = {
  datei: string;
  groesse: number;
  /** Abstand von oben in % */
  oben: number;
  dauer: number;
  verzoegerung: number;
  /** true = schwimmt nach links */
  gespiegelt?: boolean;
  /** Wo der Leuchtkörper im Bild sitzt (Anteil von Breite und Höhe),
   *  wie weit das Leuchten reicht (% der Fischbreite) und wie langsam es
   *  atmet (s). Je Fisch ein anderer Takt, sonst blinken sie im Gleichschritt. */
  laterne: { x: number; y: number; weite: number; takt: number };
};

const FISCHE: Fisch[] = [
  {
    datei: "anglerfisch_02",
    groesse: 150,
    oben: 26,
    dauer: 115,
    verzoegerung: -18,
    laterne: { x: 0.87, y: 0.17, weite: 52, takt: 4.5 },
  },
  {
    datei: "anglerfisch_04",
    groesse: 108,
    oben: 68,
    dauer: 148,
    verzoegerung: -84,
    gespiegelt: true,
    laterne: { x: 0.83, y: 0.155, weite: 48, takt: 6.2 },
  },
];

export default function Blubber() {
  return (
    <>
      <div className="blubber" aria-hidden="true">
        {BLASEN.map((b) => (
          <span
            key={b.datei}
            className="blase"
            style={
              {
                left: `${b.links}%`,
                width: b.groesse,
                opacity: b.deckkraft,
                "--dauer": `${b.dauer}s`,
                "--verzoegerung": `${b.verzoegerung}s`,
                "--drift": `${b.drift}px`,
              } as React.CSSProperties
            }
          >
            <span className="blase-pendel">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/art/sprites/${b.datei}.webp`} alt="" loading="lazy" />
            </span>
          </span>
        ))}
      </div>

      {/* Eigene Ebene vor dem Inhalt: Die Fische ziehen über Text und Karten
          hinweg. */}
      <div className="blubber-vorn" aria-hidden="true">
        {FISCHE.map((f) => (
          <span
            key={f.datei}
            className="fisch"
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
              {/* Das Leuchten der Laterne. Beim gespiegelten Fisch wandert
                  auch der Leuchtkörper auf die andere Seite. */}
              <span
                className="laterne"
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
        ))}
      </div>
    </>
  );
}
