"""Laser-Vorlage: runder Anhänger Ø50 mm mit QR-Code zur Hausfest-Seite.

Aufbau der SVG (Einheiten = Millimeter, 1 user unit = 1 mm):
  * Ebene "gravur"  — schwarz gefüllt: QR-Module, Schrift, Zierlinie
  * Ebene "schnitt" — rote Haarlinie: Aussenkreis, den der Laser durchtrennt

Schrift ist in Pfade umgewandelt, damit keine Font-Abhängigkeit besteht.
"""

import math
import pathlib

import segno
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

URL = "https://hausfest-via.al-daellen.ch"
LINK_TEXT = "hausfest-via.al-daellen.ch"

FONT_DIR = pathlib.Path(__file__).resolve().parents[2] / "src/app/fonts"
FONT_BOLD = FONT_DIR / "Outfit-Bold.ttf"
FONT_REG = FONT_DIR / "Outfit-Regular.ttf"

D = 50.0                 # Durchmesser der Scheibe in mm
R = D / 2
CUT_STROKE = 0.08        # Haarlinie fuer den Schnitt


class Glyphs:
    """Holt Glyph-Umrisse als SVG-Pfade und misst Textbreiten."""

    def __init__(self, path):
        self.font = TTFont(str(path))
        self.upem = self.font["head"].unitsPerEm
        self.glyphset = self.font.getGlyphSet()
        self.cmap = self.font.getBestCmap()
        self.hmtx = self.font["hmtx"]
        self.kern = {}
        if "kern" in self.font:
            for st in self.font["kern"].kernTables:
                self.kern.update(st.kernTable)

    def name(self, ch):
        return self.cmap.get(ord(ch))

    def advance(self, ch):
        n = self.name(ch)
        return self.hmtx[n][0] if n else self.upem * 0.3

    def pair(self, a, b):
        na, nb = self.name(a), self.name(b)
        return self.kern.get((na, nb), 0) if na and nb else 0

    def width(self, text, size):
        total = 0
        for i, ch in enumerate(text):
            total += self.advance(ch)
            if i + 1 < len(text):
                total += self.pair(ch, text[i + 1])
        return total / self.upem * size

    def path(self, ch):
        n = self.name(ch)
        if not n:
            return ""
        pen = SVGPathPen(self.glyphset)
        self.glyphset[n].draw(pen)
        return pen.getCommands()


def text_paths(g, text, size, x, y, anchor="middle"):
    """Gerade Zeile. y ist die Grundlinie. Gibt SVG-Fragmente zurueck."""
    w = g.width(text, size)
    if anchor == "middle":
        x -= w / 2
    s = size / g.upem
    out, cur = [], x
    for i, ch in enumerate(text):
        d = g.path(ch)
        if d.strip():
            out.append(
                f'<path d="{d}" transform="translate({cur:.4f} {y:.4f}) '
                f'scale({s:.6f} {-s:.6f})"/>'
            )
        cur += g.advance(ch) / g.upem * size
        if i + 1 < len(text):
            cur += g.pair(ch, text[i + 1]) / g.upem * size
    return out


def arc_paths(g, text, size, radius, bottom=False, tracking=0.0):
    """Setzt den Text mittig auf einen Kreisbogen um den Ursprung.

    Der Bogen ergibt sich aus der tatsächlichen Textbreite — der Text wird
    also nie gestaucht oder gestreckt, sondern nur zentriert. `bottom` dreht
    die Schrift so, dass sie am unteren Rand aufrecht von links nach rechts
    gelesen wird (Münzprägung).
    """
    advances = [g.advance(ch) / g.upem * size + tracking for ch in text]
    for i in range(len(text) - 1):
        advances[i] += g.pair(text[i], text[i + 1]) / g.upem * size
    total = sum(advances)

    span = total / radius                      # Bogenwinkel im Bogenmass
    mitte = math.pi / 2 if bottom else -math.pi / 2
    richtung = -1 if bottom else 1             # unten laeuft der Winkel rueckwaerts
    start = mitte - richtung * span / 2

    out, walked = [], 0.0
    s = size / g.upem
    for ch, adv in zip(text, advances):
        ang = start + richtung * (walked + adv / 2) / radius
        px, py = math.cos(ang) * radius, math.sin(ang) * radius
        rot = math.degrees(ang) + (-90 if bottom else 90)
        d = g.path(ch)
        if d.strip():
            out.append(
                f'<g transform="translate({px:.4f} {py:.4f}) rotate({rot:.4f})">'
                f'<path d="{d}" transform="translate({-adv / 2:.4f} 0) '
                f'scale({s:.6f} {-s:.6f})"/></g>'
            )
        walked += adv
    return out, math.degrees(span)


def build(titel: str, dest: pathlib.Path) -> pathlib.Path:
    bold, reg = Glyphs(FONT_BOLD), Glyphs(FONT_REG)

    # --- QR ---------------------------------------------------------------
    # Fehlerkorrektur H: bis 30 % der Flaeche darf beschaedigt sein. Auf Holz
    # (Maserung, Brandraender, Schmutz) ist das der Unterschied zwischen
    # "scannt sofort" und "scannt manchmal".
    qr = segno.make(URL, error="h", boost_error=True)
    matrix = [[bool(m) for m in row] for row in qr.matrix]
    n = len(matrix)

    # Der QR wird so gross wie möglich: mit Ruhezone (2 Module je Seite) darf
    # seine Ecke den Innenkreis nicht überschreiten, auf dem die Schrift sitzt.
    innen = R - 5.9                      # freier Radius innerhalb der Schriftbänder
    qr_size = innen * 2 / math.sqrt(2) / (1 + 4 / n)
    mod = qr_size / n                    # Modulgrösse
    qr_x = qr_y = -qr_size / 2

    gravur = []

    # Ruhezone: heller Grund um den QR, damit Maserung und Zierlinien nicht
    # in den Code hineinlaufen. Wird nicht graviert (weiss = unberührtes Holz).
    quiet = mod * 2
    gravur.append(
        f'<rect class="hell" x="{qr_x - quiet:.3f}" y="{qr_y - quiet:.3f}" '
        f'width="{qr_size + 2 * quiet:.3f}" height="{qr_size + 2 * quiet:.3f}"/>'
    )

    # Module zeilenweise zu Rechtecken zusammenfassen — weniger Pfade, und
    # der Laser faehrt laengere Strecken am Stueck.
    module = []
    for r in range(n):
        c = 0
        while c < n:
            if matrix[r][c]:
                start = c
                while c < n and matrix[r][c]:
                    c += 1
                module.append(
                    f'<rect x="{qr_x + start * mod:.4f}" y="{qr_y + r * mod:.4f}" '
                    f'width="{(c - start) * mod:.4f}" height="{mod:.4f}"/>'
                )
            else:
                c += 1
    gravur.append('<g class="qr">' + "".join(module) + "</g>")

    # --- Schrift ----------------------------------------------------------
    # Titel oben, Link unten — beide auf dem Bogen. Auf der runden Scheibe
    # passt so deutlich mehr Text hin als auf geraden Zeilen.
    basis = R - 2.9                      # Grundlinie beider Schriftbänder
    titel_paths, titel_span = arc_paths(bold, titel, 3.0, basis)
    link_paths, link_span = arc_paths(reg, LINK_TEXT, 2.35, basis, bottom=True)
    gravur += titel_paths
    gravur += link_paths

    # Zwei Punkte trennen die beiden Bänder links und rechts.
    for seite in (-1, 1):
        gravur.append(
            f'<circle cx="{seite * (basis - 0.9):.3f}" cy="0" r="0.55"/>'
        )

    for name, span in (("Titel", titel_span), ("Link", link_span)):
        if span > 165:
            raise SystemExit(f"{name} zu breit für die Scheibe: {span:.0f}° Bogen")

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" version="1.1"
     width="{D}mm" height="{D}mm" viewBox="{-R} {-R} {D} {D}">
  <title>Hausfest Via — QR-Anhänger Ø{D:.0f} mm</title>
  <style>
    .gravur {{ fill: #000; stroke: none; }}
    .gravur .hell {{ fill: #fff; }}
    .gravur .linie {{ fill: none; stroke: #000; stroke-width: 0.35; }}
    .schnitt {{ fill: none; stroke: #ff0000; stroke-width: {CUT_STROKE}; }}
  </style>
  <g id="gravur" class="gravur">
    {"".join(gravur)}
  </g>
  <g id="schnitt" class="schnitt">
    <circle cx="0" cy="0" r="{R - CUT_STROKE / 2:.3f}"/>
  </g>
</svg>
"""
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(svg)
    print(f"{dest.name}: QR {n}x{n} Module, {mod:.3f} mm/Modul")
    return dest


if __name__ == "__main__":
    out = pathlib.Path(__file__).resolve().parents[2] / "laser"
    build("Hausfest Via1 · 5. September", out / "hausfest-qr-50mm.svg")
    build("Hausfest Via · 5. September", out / "hausfest-qr-50mm-ohne-1.svg")
