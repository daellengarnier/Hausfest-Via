"""QR-Code für das gezeichnete A3-Plakat — im Stil des Laser-Anhängers.

Das Plakat bringt ein weisses Quadrat mit (unter dem «TICKETS»-Schild);
dieses Skript erzeugt den passenden QR und setzt ihn dort hinein:

  * plakat/qr_seite.svg        — der QR allein, quadratisch, in mm
  * plakat/ViaFest_A3_mit_QR.pdf — das Plakat mit eingesetztem QR (Vektor)

Er zeigt wie der Anhänger auf die Hausfest-Seite: Der Petzi-Shop ist
passwortgeschützt, und das Passwort steht nur dort — beim Ticket-Knopf.
Ein QR direkt in den Shop liesse die Leute vor einem Passwortfeld
stehen. Gleicher Code wie auf dem Anhänger (33×33), nur ohne Scheibe
und Schrift.

    python3 scripts/art/gen_qr_plakat.py <pfad-zum-plakat.pdf>
"""

import math
import pathlib
import random
import sys

import segno

import gen_qr

# Der QR zeigt auf die Hausfest-Seite, nicht direkt auf Petzi: Der Shop
# ist passwortgeschützt, und das Passwort steht nur auf der Seite — beim
# Ticket-Knopf. Wer am Plakat scannt, bekommt so beides zusammen.
URL = gen_qr.URL

# Das weisse Quadrat im Plakat, in pt gemessen (72 pt = 1 Zoll).
FELD = (339.0, 769.5, 78.5, 78.0)

# Über diesen Rand hinaus darf der Farbfleck ins Bild hineinlasieren.
RAND_PT = 10.0


def fleck_pfad(hb: float, hh: float, ausbuchtung: float,
               samen: int = 7) -> str:
    """Ein wackliger, geschlossener Umriss um das Feld — wie der Rand
    eines Wasserfarbflecks.

    Er beginnt auf dem Feldrand (`hb`/`hh` = halbe Feldmasse) und buchtet
    nur nach AUSSEN aus: Nach innen dürfte er nicht, dort liegt das
    weisse Quadrat der Vorlage, das ganz zugedeckt werden muss. Fester
    Seed, damit jedes Erzeugen denselben Fleck malt.
    """
    rng = random.Random(samen)
    ecken = 3.0                     # mm Eckrundung des Grundrechtecks
    # Punkte gleichmässig dem Umfang entlang, je mit Auswärts-Versatz.
    punkte = []
    n = 30
    umfang = 4 * (hb + hh - 2 * ecken) + 2 * math.pi * ecken
    lauf = rng.uniform(0, umfang)
    for i in range(n):
        s = (i / n) * umfang
        # Position auf dem gerundeten Rechteck bei Bogenlänge s
        seiten = [
            (2 * (hb - ecken), lambda u: (-hb + ecken + u, -hh), (0, -1)),
            (math.pi / 2 * ecken, None, None),                       # Ecke or
            (2 * (hh - ecken), lambda u: (hb, -hh + ecken + u), (1, 0)),
            (math.pi / 2 * ecken, None, None),                       # Ecke ur
            (2 * (hb - ecken), lambda u: (hb - ecken - u, hh), (0, 1)),
            (math.pi / 2 * ecken, None, None),                       # Ecke ul
            (2 * (hh - ecken), lambda u: (-hb, hh - ecken - u), (-1, 0)),
            (math.pi / 2 * ecken, None, None),                       # Ecke ol
        ]
        mitte_ecken = [(hb - ecken, -hh + ecken), (hb - ecken, hh - ecken),
                       (-hb + ecken, hh - ecken), (-hb + ecken, -hh + ecken)]
        rest, ecke_nr = s, 0
        for laenge, ort, normale in seiten:
            if rest > laenge:
                rest -= laenge
                if ort is None:
                    ecke_nr += 1
                continue
            if ort is not None:
                x, y = ort(rest)
                nx, ny = normale
            else:
                cx, cy = mitte_ecken[ecke_nr]
                start = [-math.pi / 2, 0, math.pi / 2, math.pi][ecke_nr]
                a = start + rest / ecken
                nx, ny = math.cos(a), math.sin(a)
                x, y = cx + ecken * nx, cy + ecken * ny
            d = ausbuchtung * (0.35 + 0.65 * rng.random())
            punkte.append((x + nx * d, y + ny * d))
            break

    # Catmull-Rom durch die Punkte, als kubische Beziers — rundet die
    # Zacken zu weichen Wellen.
    teile = [f"M{punkte[0][0]:.2f} {punkte[0][1]:.2f}"]
    m = len(punkte)
    for i in range(m):
        p0 = punkte[(i - 1) % m]
        p1 = punkte[i]
        p2 = punkte[(i + 1) % m]
        p3 = punkte[(i + 2) % m]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        teile.append(
            f"C{c1[0]:.2f} {c1[1]:.2f} {c2[0]:.2f} {c2[1]:.2f} "
            f"{p2[0]:.2f} {p2[1]:.2f}"
        )
    return "".join(teile) + "Z"


def qr_svg(dest: pathlib.Path) -> None:
    """Der QR als SVG in mm, Stil wie auf dem Anhänger: weiche Module,
    eckige Suchringe, Pyramide mit Auge in der Mitte.

    Der Grund ist keine weisse Fläche, sondern eine Aquarell-Wäsche aus
    der Palette des Plakats: Teich-Türkis als Grundton, darüber weiche
    Wolken aus sattem Türkis, dem Gelbgrün der Seerosenblätter, kühlem
    Wasserblau und einem Hauch Lilien-Pink (Farben per k-means aus dem
    Bild gemessen). Alles bleibt hell genug: QR-Scanner brauchen
    Kontrast zwischen Modulen und Grund, nicht Weiss — geprüft wird das
    am fertigen PDF.

    Die SVG ist exakt so gross wie das weisse Feld im Plakat und deckt es
    ganz ab."""
    qr = segno.make(URL, error="h", boost_error=True)
    matrix = [[bool(m) for m in row] for row in qr.matrix]
    n = len(matrix)

    feld_b = FELD[2] / 72 * 25.4     # das weisse Feld, in mm
    feld_h = FELD[3] / 72 * 25.4
    rand = RAND_PT / 72 * 25.4       # so weit darf der Fleck hinauslasieren
    breite = feld_b + 2 * rand       # Zeichenfläche
    hoehe = feld_h + 2 * rand
    seite = 27.0                     # Kantenlänge des QR samt Ruhezone
    mod = seite / (n + 4)            # 2 Module Ruhezone je Seite
    qr_size = mod * n
    x0 = y0 = -qr_size / 2

    # Mitte freiräumen, 11 Module wie auf dem Anhänger.
    loch = gen_qr.LOCH_MODULE
    von = (n - loch) // 2
    for r in range(von, von + loch):
        for c in range(von, von + loch):
            matrix[r][c] = False

    gravur = gen_qr.qr_gravur(matrix, x0, y0, mod)

    motiv = loch * mod
    py_breite, py_hoehe = motiv * 0.74, motiv * 0.40
    gravur += gen_qr.pyramide(
        0, motiv * 0.46, py_breite, py_hoehe, strich=mod * 0.16
    )

    hb, hh = breite / 2, hoehe / 2
    fb, fh = feld_b / 2, feld_h / 2
    # Drei Umrisse: Der innerste deckt das weisse Feld sicher ab, die zwei
    # äusseren lasieren halbtransparent darüber hinaus — so franst die
    # Kante aus, statt hart abzuschliessen.
    kern = fleck_pfad(fb + 0.3, fh + 0.3, ausbuchtung=1.6, samen=7)
    saum1 = fleck_pfad(fb + 0.9, fh + 0.9, ausbuchtung=2.2, samen=19)
    saum2 = fleck_pfad(fb + 1.5, fh + 1.5, ausbuchtung=2.8, samen=42)
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" version="1.1"
     width="{breite:.3f}mm" height="{hoehe:.3f}mm"
     viewBox="{-hb:.3f} {-hh:.3f} {breite:.3f} {hoehe:.3f}">
  <title>Hausfest Via — QR zur Fest-Seite</title>
  <defs>
    <!-- Grundwäsche: das Teich-Türkis, deutlich aufgehellt. -->
    <radialGradient id="wasser" cx="50%" cy="46%" r="80%">
      <stop offset="0%" stop-color="#c8e9e3"/>
      <stop offset="65%" stop-color="#a9dad3"/>
      <stop offset="100%" stop-color="#8fcdc6"/>
    </radialGradient>
    <!-- Darüber einzelne Farbwolken aus der Palette des Plakats:
         sattes Teich-Türkis, das Gelbgrün der Seerosenblätter, ein
         kühles Wasserblau und ein Hauch Lilien-Pink. Alle laufen weich
         nach aussen aus, wie ineinander verlaufende Lasuren. -->
    <radialGradient id="tuerkis" cx="18%" cy="20%" r="55%">
      <stop offset="0%" stop-color="rgba(47,175,181,0.42)"/>
      <stop offset="100%" stop-color="rgba(47,175,181,0)"/>
    </radialGradient>
    <radialGradient id="lilie" cx="85%" cy="86%" r="50%">
      <stop offset="0%" stop-color="rgba(197,197,40,0.38)"/>
      <stop offset="100%" stop-color="rgba(197,197,40,0)"/>
    </radialGradient>
    <radialGradient id="blau" cx="82%" cy="12%" r="48%">
      <stop offset="0%" stop-color="rgba(70,150,190,0.30)"/>
      <stop offset="100%" stop-color="rgba(70,150,190,0)"/>
    </radialGradient>
    <radialGradient id="gruen" cx="12%" cy="88%" r="45%">
      <stop offset="0%" stop-color="rgba(120,180,90,0.30)"/>
      <stop offset="100%" stop-color="rgba(120,180,90,0)"/>
    </radialGradient>
    <radialGradient id="pink" cx="55%" cy="98%" r="30%">
      <stop offset="0%" stop-color="rgba(210,90,140,0.20)"/>
      <stop offset="100%" stop-color="rgba(210,90,140,0)"/>
    </radialGradient>
  </defs>
  <style>
    .gravur {{ fill: #000; stroke: none; }}
    .gravur .hell {{ fill: none; }}
    .gravur .ring {{ fill: none; stroke: #000; }}
    .gravur .linie {{ fill: none; stroke: #000;
                      stroke-linecap: round; stroke-linejoin: round; }}
  </style>
  <!-- Ausgefranster Rand: zwei halbtransparente Säume, dann der volle
       Fleck. Die Wäsche selbst ist in den Kern-Umriss geschnitten. -->
  <path d="{saum2}" fill="#8fcdc6" opacity="0.28"/>
  <path d="{saum1}" fill="#9dd4cd" opacity="0.5"/>
  <clipPath id="fleck"><path d="{kern}"/></clipPath>
  <g clip-path="url(#fleck)">
    <rect x="{-hb:.3f}" y="{-hh:.3f}" width="{breite:.3f}" height="{hoehe:.3f}"
          fill="url(#wasser)"/>
    {"".join(f'<rect x="{-hb:.3f}" y="{-hh:.3f}" width="{breite:.3f}" height="{hoehe:.3f}" fill="url(#' + w + ')"/>' for w in ("tuerkis", "lilie", "blau", "gruen", "pink"))}
  </g>
  <g class="gravur">
    {"".join(gravur)}
  </g>
</svg>
"""
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(svg)
    print(f"{dest.name}: {n}x{n} Module, {mod:.3f} mm/Modul")


def einsetzen(plakat: pathlib.Path, svg: pathlib.Path,
              dest: pathlib.Path) -> None:
    """Setzt den QR als Vektor mittig ins weisse Feld des Plakats.

    Über den Umweg SVG → PDF, damit der Code auch im Plakat Vektor bleibt —
    ein eingebettetes Bild würde beim Druck in A3 sichtbar pixeln.
    """
    import cairosvg
    import fitz

    qr_pdf = svg.with_suffix(".pdf")
    cairosvg.svg2pdf(url=str(svg), write_to=str(qr_pdf))

    doc = fitz.open(plakat)
    seite = doc[0]
    x, y, b, h = FELD
    # Die SVG ist um den Lasier-Rand grösser als das Feld — mittig gesetzt
    # deckt ihr Kern das Weiss ab, die Säume greifen ins Bild hinaus.
    r = RAND_PT
    rect = fitz.Rect(x - r, y - r, x + b + r, y + h + r)
    ueberlage = fitz.open(qr_pdf)
    seite.show_pdf_page(rect, ueberlage, 0)
    doc.save(dest, garbage=3, deflate=True)
    print(f"{dest.name}: QR bei ({rect.x0:.0f}, {rect.y0:.0f}) pt, "
          f"{b / 72 * 25.4:.1f} x {h / 72 * 25.4:.1f} mm")


if __name__ == "__main__":
    out = pathlib.Path(__file__).resolve().parents[2] / "plakat"
    svg = out / "qr_seite.svg"
    qr_svg(svg)
    plakat = (
        pathlib.Path(sys.argv[1]) if len(sys.argv) > 1
        else out / "ViaFest_A3.pdf"
    )
    if plakat.exists():
        einsetzen(plakat, svg, out / "ViaFest_A3_mit_QR.pdf")
    else:
        print(f"Plakat nicht gefunden ({plakat}) — nur die SVG erzeugt.")
