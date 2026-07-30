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

import pathlib
import sys

import segno

import gen_qr

# Der QR zeigt auf die Hausfest-Seite, nicht direkt auf Petzi: Der Shop
# ist passwortgeschützt, und das Passwort steht nur auf der Seite — beim
# Ticket-Knopf. Wer am Plakat scannt, bekommt so beides zusammen.
URL = gen_qr.URL

# Das weisse Quadrat im Plakat, in pt gemessen (72 pt = 1 Zoll).
FELD = (339.0, 769.5, 78.5, 78.0)


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

    breite = FELD[2] / 72 * 25.4     # das ganze weisse Feld, in mm
    hoehe = FELD[3] / 72 * 25.4
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
  <rect x="{-hb:.3f}" y="{-hh:.3f}" width="{breite:.3f}" height="{hoehe:.3f}"
        fill="url(#wasser)"/>
  {"".join(f'<rect x="{-hb:.3f}" y="{-hh:.3f}" width="{breite:.3f}" height="{hoehe:.3f}" fill="url(#' + w + ')"/>' for w in ("tuerkis", "lilie", "blau", "gruen", "pink"))}
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
    # Die SVG hat exakt die Masse des Felds — sie deckt das Weiss ganz ab.
    rect = fitz.Rect(x, y, x + b, y + h)
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
