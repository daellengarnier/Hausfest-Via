"""QR-Code für das gezeichnete A3-Plakat — im Stil des Laser-Anhängers.

Das Plakat bringt ein weisses Quadrat mit (unter dem «TICKETS»-Schild);
dieses Skript erzeugt den passenden QR und setzt ihn dort hinein:

  * plakat/qr_petzi.svg        — der QR allein, quadratisch, in mm
  * plakat/ViaFest_A3_mit_QR.pdf — das Plakat mit eingesetztem QR (Vektor)

Anders als der Anhänger zeigt dieser QR direkt auf den Petzi-Ticketshop —
das Plakat wirbt ja genau dafür. Der Link ist lang, darum wird der Code
dichter (Version 7, 45×45 Module statt 33×33). Auf Papier gedruckt ist
das unkritisch; die Mitte bleibt trotzdem frei für die Pyramide, die
Fehlerkorrektur H trägt das.

    python3 scripts/art/gen_qr_plakat.py <pfad-zum-plakat.pdf>
"""

import pathlib
import sys

import segno

import gen_qr

TICKET_URL = "https://www.petzi.ch/en/organiser/236127/x2nv44btSyy-vzACtazc3A/"

# Das weisse Quadrat im Plakat, in pt gemessen (72 pt = 1 Zoll).
FELD = (339.0, 769.5, 78.5, 78.0)


def qr_svg(dest: pathlib.Path) -> float:
    """Der QR als quadratische SVG in mm, Stil wie auf dem Anhänger:
    weiche Module, eckige Suchringe, Pyramide mit Auge in der Mitte."""
    qr = segno.make(TICKET_URL, error="h", boost_error=True)
    matrix = [[bool(m) for m in row] for row in qr.matrix]
    n = len(matrix)

    seite = 27.0                     # mm — knapp kleiner als das weisse Feld
    mod = seite / (n + 4)            # 2 Module Ruhezone je Seite
    qr_size = mod * n
    x0 = y0 = -qr_size / 2

    # Mitte freiräumen. 11 Module wie auf dem Anhänger — bei 45×45 ist das
    # ein kleinerer Anteil, die Pyramide wird also relativ kleiner, aber
    # die Fehlerkorrektur hat mehr Luft.
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

    halb = seite / 2
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" version="1.1"
     width="{seite}mm" height="{seite}mm"
     viewBox="{-halb} {-halb} {seite} {seite}">
  <title>Hausfest Via — QR zum Ticketshop</title>
  <style>
    .gravur {{ fill: #000; stroke: none; }}
    .gravur .hell {{ fill: #fff; }}
    .gravur .ring {{ fill: none; stroke: #000; }}
    .gravur .linie {{ fill: none; stroke: #000;
                      stroke-linecap: round; stroke-linejoin: round; }}
  </style>
  <g class="gravur">
    <rect class="hell" x="{-halb}" y="{-halb}" width="{seite}" height="{seite}"/>
    {"".join(gravur)}
  </g>
</svg>
"""
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(svg)
    print(f"{dest.name}: {n}x{n} Module, {mod:.3f} mm/Modul")
    return seite


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
    kante = min(b, h)
    rect = fitz.Rect(
        x + (b - kante) / 2, y + (h - kante) / 2,
        x + (b + kante) / 2, y + (h + kante) / 2,
    )
    ueberlage = fitz.open(qr_pdf)
    seite.show_pdf_page(rect, ueberlage, 0)
    doc.save(dest, garbage=3, deflate=True)
    print(f"{dest.name}: QR bei ({rect.x0:.0f}, {rect.y0:.0f}) pt, "
          f"{kante / 72 * 25.4:.1f} mm")


if __name__ == "__main__":
    out = pathlib.Path(__file__).resolve().parents[2] / "plakat"
    svg = out / "qr_petzi.svg"
    qr_svg(svg)
    plakat = (
        pathlib.Path(sys.argv[1]) if len(sys.argv) > 1
        else out / "ViaFest_A3.pdf"
    )
    if plakat.exists():
        einsetzen(plakat, svg, out / "ViaFest_A3_mit_QR.pdf")
    else:
        print(f"Plakat nicht gefunden ({plakat}) — nur die SVG erzeugt.")
