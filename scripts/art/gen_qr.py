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
LOCH_MODULE = 11         # Kantenlaenge des freigeraeumten Mittelfelds in Modulen


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


def modul_pfad(x, y, m, oben, unten, links, rechts, radius):
    """Ein Modul als Rechteck, dessen Ecken nur dort gerundet werden, wo kein
    Nachbar anschliesst. Benachbarte Module wachsen dadurch zu weichen Bändern
    zusammen, einzelne bleiben als runde Punkte stehen."""
    r = radius
    tl = r if (not oben and not links) else 0
    tr = r if (not oben and not rechts) else 0
    br = r if (not unten and not rechts) else 0
    bl = r if (not unten and not links) else 0
    return (
        f"M{x + tl:.4f} {y:.4f}"
        f"H{x + m - tr:.4f}" + (f"A{tr:.4f} {tr:.4f} 0 0 1 {x + m:.4f} {y + tr:.4f}" if tr else "")
        + f"V{y + m - br:.4f}" + (f"A{br:.4f} {br:.4f} 0 0 1 {x + m - br:.4f} {y + m:.4f}" if br else "")
        + f"H{x + bl:.4f}" + (f"A{bl:.4f} {bl:.4f} 0 0 1 {x:.4f} {y + m - bl:.4f}" if bl else "")
        + f"V{y + tl:.4f}" + (f"A{tl:.4f} {tl:.4f} 0 0 1 {x + tl:.4f} {y:.4f}" if tl else "")
        + "Z"
    )


def qr_gravur(matrix, x0, y0, m):
    """Zeichnet die Matrix im weichen Stil: gerundete Module, die Suchmuster in
    den Ecken als Ringe mit runder Marke darin."""
    n = len(matrix)
    radius = m * 0.5                       # halbe Modulbreite = einzelne Punkte werden rund

    # Die drei Suchmuster (je 7x7) zeichnen wir von Hand.
    # WICHTIG: Der äussere Ring bleibt eckig. Scanner suchen entlang jeder
    # Abtastlinie das Verhältnis 1:1:3:1:1 — gerundete Ringecken verkürzen die
    # dunklen Abschnitte, und im Test (Brandrand + Maserung + wenig Kontrast)
    # fiel die Erkennung damit komplett aus. Der innere Punkt darf dagegen voll
    # gerundet sein, das kostete nichts.
    finder = {(0, 0), (0, n - 7), (n - 7, 0)}
    belegt = {(fr + dr, fc + dc)
              for fr, fc in finder for dr in range(7) for dc in range(7)}

    teile = []
    for fr, fc in finder:
        fx, fy = x0 + fc * m, y0 + fr * m
        teile.append(
            f'<rect class="ring" x="{fx + m / 2:.4f}" y="{fy + m / 2:.4f}" '
            f'width="{6 * m:.4f}" height="{6 * m:.4f}" '
            f'stroke-width="{m:.4f}"/>'
        )
        teile.append(
            f'<rect x="{fx + 2 * m:.4f}" y="{fy + 2 * m:.4f}" '
            f'width="{3 * m:.4f}" height="{3 * m:.4f}" rx="{m:.4f}"/>'
        )

    pfade = []
    for r in range(n):
        for c in range(n):
            if not matrix[r][c] or (r, c) in belegt:
                continue
            pfade.append(modul_pfad(
                x0 + c * m, y0 + r * m, m,
                oben=r > 0 and matrix[r - 1][c],
                unten=r < n - 1 and matrix[r + 1][c],
                links=c > 0 and matrix[r][c - 1],
                rechts=c < n - 1 and matrix[r][c + 1],
                radius=radius,
            ))
    teile.append(f'<path d="{"".join(pfade)}"/>')
    return teile


def pyramide(cx, boden, breite, hoehe, strich):
    """Pyramide aus gemauerten Steinlagen, darüber das strahlende Auge.
    `boden` ist die Standlinie, die Pyramide wächst von dort nach oben.

    Die Stossfugen stehen senkrecht und sind von Lage zu Lage um eine halbe
    Steinbreite versetzt — so liest es sich als Mauerwerk. Fugen, die zur
    Spitze zusammenlaufen, sähen dagegen aus wie ein Fächer.
    """
    hb = breite / 2
    spitze_y = boden - hoehe
    dick = f'class="linie" stroke-width="{strich:.3f}"'
    fein = f'class="linie" stroke-width="{strich * 0.66:.3f}"'
    p = []

    # Umriss und Mittelgrat
    p.append(f'<path {dick} d="M{cx:.3f} {spitze_y:.3f}'
             f'L{cx - hb:.3f} {boden:.3f}H{cx + hb:.3f}Z"/>')
    p.append(f'<path {fein} d="M{cx:.3f} {spitze_y:.3f}V{boden:.3f}"/>')

    lagen = 4
    stein = hb / 5                       # feste Steinbreite über alle Lagen
    for i in range(1, lagen + 1):
        t_o, t_u = (i - 1) / lagen, i / lagen
        y_o, y_u = spitze_y + hoehe * t_o, spitze_y + hoehe * t_u
        halb_o = hb * t_o

        # Lagerfuge (die unterste ist schon der Umriss)
        if i < lagen:
            halb_u = hb * t_u
            p.append(f'<path {fein} d="M{cx - halb_u:.3f} {y_u:.3f}'
                     f'H{cx + halb_u:.3f}"/>')

        # Stossfugen: senkrecht, feste Breite, je Lage um einen halben Stein
        # versetzt. Eine Fuge wird nur gesetzt, wenn sie auch an der schmalen
        # Oberkante der Lage noch innerhalb der Pyramide liegt — aussen bleiben
        # dadurch von selbst angeschnittene Steine stehen.
        versatz = 0.5 if i % 2 == 0 else 0.0
        for seite in (-1, 1):
            k = 1
            while True:
                x_rel = (k - versatz) * stein
                if x_rel >= halb_o:
                    break
                if x_rel < stein * 0.6:      # zu nah am Mittelgrat
                    k += 1
                    continue
                x = cx + seite * x_rel
                p.append(f'<path {fein} d="M{x:.3f} {y_o:.3f}V{y_u:.3f}"/>')
                k += 1

    # --- Das Auge über der Spitze ----------------------------------------
    aw = breite * 0.23                   # halbe Augenbreite
    ah = aw * 0.62                       # halbe Augenhöhe
    ay = spitze_y - aw * 1.30

    # Mandelform aus zwei Bögen
    p.append(f'<path {dick} d="M{cx - aw:.3f} {ay:.3f}'
             f'Q{cx:.3f} {ay - ah * 2:.3f} {cx + aw:.3f} {ay:.3f}'
             f'Q{cx:.3f} {ay + ah * 2:.3f} {cx - aw:.3f} {ay:.3f}Z"/>')
    p.append(f'<circle {fein} cx="{cx:.3f}" cy="{ay:.3f}" r="{ah * 0.86:.3f}"/>')
    p.append(f'<circle cx="{cx:.3f}" cy="{ay:.3f}" r="{ah * 0.36:.3f}"/>')

    # Strahlenkranz
    for i in range(16):
        a = math.radians(i * 22.5)
        r0, r1 = aw * 1.16, aw * 1.5
        p.append(f'<path {fein} d="M{cx + math.cos(a) * r0:.3f} '
                 f'{ay + math.sin(a) * r0 * 0.95:.3f}'
                 f'L{cx + math.cos(a) * r1:.3f} '
                 f'{ay + math.sin(a) * r1 * 0.95:.3f}"/>')
    return p


def build(titel: str, dest: pathlib.Path) -> pathlib.Path:
    bold, reg = Glyphs(FONT_BOLD), Glyphs(FONT_REG)

    # --- QR ---------------------------------------------------------------
    # Fehlerkorrektur H: bis 30 % der Flaeche darf beschaedigt sein. Auf Holz
    # (Maserung, Brandraender, Schmutz) ist das der Unterschied zwischen
    # "scannt sofort" und "scannt manchmal".
    qr = segno.make(URL, error="h", boost_error=True)
    matrix = [[bool(m) for m in row] for row in qr.matrix]
    n = len(matrix)

    # --- Aufteilung der Scheibe -------------------------------------------
    # Titel oben, Link unten, beide auf gerader Zeile. Der QR bekommt dann
    # alles, was übrig bleibt: seine halbe Kantenlänge `h` (samt Ruhezone) ist
    # begrenzt durch die Zeilen darüber/darunter — eine Zeile darf an ihrer
    # höchsten Stelle nicht breiter sein als die Kreissehne dort — und durch
    # die eigenen Ecken, die im Kreis bleiben müssen.
    RAND = 0.9                           # Sicherheitsabstand zur Schnittkante
    LUFT = 1.1                           # Abstand zwischen Zeile und QR
    r_safe = R - RAND

    titel_groesse, link_groesse = 2.35, 1.95
    zeilen = [(bold.width(titel, titel_groesse), titel_groesse),
              (reg.width(LINK_TEXT, link_groesse), link_groesse)]

    h = r_safe / math.sqrt(2)            # Ecken des QR bleiben im Kreis
    for breite, hoehe in zeilen:
        if breite / 2 >= r_safe:
            raise SystemExit(f"Zeile zu breit für die Scheibe: {breite:.1f} mm")
        # Kreissehne an der Oberkante der Zeile begrenzt, wie weit der QR reicht
        h = min(h, math.sqrt(r_safe**2 - (breite / 2) ** 2) - LUFT - hoehe)

    qr_size = 2 * h / (1 + 4 / n)        # Ruhezone von 2 Modulen je Seite abziehen
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

    # Mitte für das Motiv freiräumen. Die Fehlerkorrektur (Stufe H) trägt den
    # Verlust; wie viel wirklich geht, prüft `pruefe_lesbarkeit`.
    loch = LOCH_MODULE
    von = (n - loch) // 2
    for r in range(von, von + loch):
        for c in range(von, von + loch):
            matrix[r][c] = False

    gravur += qr_gravur(matrix, qr_x, qr_y, mod)

    # Pyramide mit Auge in die freigeräumte Mitte. Das Motiv reicht von der
    # Standlinie bis zum Strahlenkranz — diese Gesamthöhe wird mittig ins Loch
    # gesetzt, damit es nicht nach oben rutscht.
    motiv = loch * mod
    py_breite, py_hoehe = motiv * 0.74, motiv * 0.40
    aw = py_breite * 0.23
    gesamt = py_hoehe + aw * (1.30 + 1.5)
    gravur += pyramide(0, gesamt / 2, py_breite, py_hoehe,
                       strich=max(0.28, mod * 0.34))

    # --- Schrift ----------------------------------------------------------
    # Titel oben, Link unten. Grundlinie jeweils mit `LUFT` Abstand zum QR.
    gravur += text_paths(bold, titel, titel_groesse, 0, -h - LUFT)
    gravur += text_paths(reg, LINK_TEXT, link_groesse, 0,
                         h + LUFT + link_groesse)

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" version="1.1"
     width="{D}mm" height="{D}mm" viewBox="{-R} {-R} {D} {D}">
  <title>Hausfest Via — QR-Anhänger Ø{D:.0f} mm</title>
  <style>
    .gravur {{ fill: #000; stroke: none; }}
    .gravur .hell {{ fill: #fff; }}
    .gravur .ring {{ fill: none; stroke: #000; }}
    .gravur .linie {{ fill: none; stroke: #000;
                      stroke-linecap: round; stroke-linejoin: round; }}
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


def ausgeben(svg: pathlib.Path) -> None:
    """PDF und PNG neben die SVG legen.

    Nicht jede Lasersoftware und nicht jede Druckerei nimmt SVG. Das PDF ist
    dieselbe Vektorzeichnung in 50 × 50 mm — Schnittlinie bleibt rot und
    dünn. Das PNG ist für alles, was nur ein Bild will; 600 dpi, damit die
    feinen Module auch gedruckt sauber stehen.

    `cairosvg` ist optional: Fehlt es, entsteht trotzdem die SVG.
    """
    try:
        import cairosvg
    except ImportError:
        print("  (cairosvg fehlt — nur SVG erzeugt)")
        return

    pdf = svg.with_suffix(".pdf")
    cairosvg.svg2pdf(url=str(svg), write_to=str(pdf))
    print(f"{pdf.name}: {pdf.stat().st_size / 1024:.0f} KB")

    # 50 mm bei 600 dpi. Weisser Grund statt durchsichtig: Der QR braucht
    # seine helle Ruhezone, sonst liest ihn auf dunklem Grund kein Scanner.
    kante = round(D / 25.4 * 600)
    png = svg.with_suffix(".png")
    cairosvg.svg2png(
        url=str(svg), write_to=str(png),
        output_width=kante, output_height=kante, background_color="white",
    )
    print(f"{png.name}: {kante}x{kante} px (600 dpi), "
          f"{png.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    # Auf dem Anhänger steht „Hausfest Via“ ohne die 1 — auf 50 mm zählt
    # jedes Zeichen, und je kürzer die Zeile, desto grösser darf der QR
    # werden. Auf der Seite heisst das Fest weiterhin „Hausfest Via 1“.
    out = pathlib.Path(__file__).resolve().parents[2] / "laser"
    ausgeben(build("Hausfest Via · 5. September", out / "hausfest-qr-50mm.svg"))
