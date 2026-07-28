"""Bereitet die gemalten Vorlagen aus `art/` fürs Web auf.

Die Originale sind zusammen rund 7.6 MB — viel zu schwer für eine App, die
Gäste am Fest über Handyempfang laden. Daraus entstehen:

  * public/art/hintergrund.webp   — der Seitenhintergrund
  * public/art/sprites/*.webp     — Blasen und Laternenfische zum Schweben
  * public/icons/*.png            — die App-Icons, aus dem Molch oben

Die Originale bleiben unter `art/` liegen (ausserhalb von `public/`, damit
sie nicht mit ausgeliefert werden) und lassen sich jederzeit neu ableiten.

    python3 scripts/art/prepare_hintergrund.py
"""

import pathlib

from PIL import Image

WURZEL = pathlib.Path(__file__).resolve().parents[2]
QUELLEN = WURZEL / "art"
HINTERGRUND = QUELLEN / "Lang_B_Molch-oben.png"


def hintergrund() -> None:
    """Die Seite ist deutlich höher als das Bild, und der Hintergrund scrollt
    mit — das Bild muss sich also wiederholen. Oben (helle Blasen) und unten
    (dunkler Meeresgrund) passen aber nicht aneinander, eine schlichte
    Wiederholung gäbe eine harte Kante.

    Darum wird die Kachel aus dem Bild und seiner senkrechten Spiegelung
    gebaut: Unterkante trifft dann immer auf Unterkante, Oberkante auf
    Oberkante — die Landschaft läuft nahtlos durch.
    """
    ziel = WURZEL / "public/art/hintergrund.webp"
    ziel.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(HINTERGRUND).convert("RGB")

    kachel = Image.new("RGB", (im.width, im.height * 2))
    kachel.paste(im, (0, 0))
    kachel.paste(im.transpose(Image.FLIP_TOP_BOTTOM), (0, im.height))

    # WebP: für eine gemalte Illustration mit vielen weichen Verläufen bringt
    # das den grössten Sprung bei sichtbar gleicher Qualität.
    kachel.save(ziel, "WEBP", quality=78, method=6)
    print(f"{ziel.name}: {kachel.width}x{kachel.height}, "
          f"{ziel.stat().st_size / 1024:.0f} KB")


def sprites() -> None:
    """Blasen und Laternenfische — freigestellt, also mit Alphakanal."""
    ordner = WURZEL / "public/art/sprites"
    ordner.mkdir(parents=True, exist_ok=True)
    gesamt = 0
    for quelle in sorted(QUELLEN.glob("*.png")):
        if quelle == HINTERGRUND:
            continue
        im = Image.open(quelle).convert("RGBA")
        # Auf dem Bildschirm erscheinen sie höchstens ~180 px breit; alles
        # darüber wäre Ballast. 360 px lässt Luft für Retina-Displays.
        if im.width > 360:
            hoehe = round(im.height * 360 / im.width)
            im = im.resize((360, hoehe), Image.LANCZOS)
        ziel = ordner / f"{quelle.stem}.webp"
        im.save(ziel, "WEBP", quality=80, method=6)
        gesamt += ziel.stat().st_size
        print(f"  {ziel.name}: {ziel.stat().st_size / 1024:.0f} KB")
    print(f"Sprites gesamt: {gesamt / 1024:.0f} KB")


def icons() -> None:
    """Quadratischer Ausschnitt um den Molch — er sitzt oben im Bild und ist
    das stärkste Motiv. Mittig gesetzt, damit Androids runde Maske nichts
    Wichtiges abschneidet."""
    im = Image.open(HINTERGRUND).convert("RGB")
    breite = im.width
    mitte_y = int(breite * 0.52)          # Höhe, auf der der Molch sitzt
    halb = int(breite * 0.42)
    motiv = im.crop(
        (breite // 2 - halb, mitte_y - halb, breite // 2 + halb, mitte_y + halb)
    ).resize((1024, 1024), Image.LANCZOS)

    ordner = WURZEL / "public/icons"
    for groesse, name in [
        (512, "icon-512.png"),
        (192, "icon-192.png"),
        (180, "apple-touch-icon.png"),
    ]:
        motiv.resize((groesse, groesse), Image.LANCZOS).save(
            ordner / name, optimize=True
        )
        print(f"  {name}: {groesse}px")


if __name__ == "__main__":
    hintergrund()
    sprites()
    icons()
