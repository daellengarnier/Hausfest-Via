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

import numpy as np
from PIL import Image, ImageEnhance

WURZEL = pathlib.Path(__file__).resolve().parents[2]
QUELLEN = WURZEL / "art"
HINTERGRUND = QUELLEN / "App-Hintergrund_lang_Molch-oben.png"


def hintergrund() -> None:
    """Das Bild läuft einmal von oben nach unten durch — vom Molch an der
    Oberfläche bis in die dunkle Höhle am Grund.

    Die Seite ist höher als das Bild. Es einfach zu wiederholen ginge nicht:
    Unten die schwarze Höhle, oben wieder das helle Wasser — das gibt eine
    sichtbare Kante. Und das Bild samt Spiegelung zu kacheln würde die Datei
    verdoppeln.

    Darum zwei Ebenen: das Bild einmal ganz oben, und darunter eine schmale
    Kachel aus dem Höhlengrund, die sich endlos weiterwiederholt. Wer weiter
    scrollt, sinkt also einfach tiefer ins Dunkle — was zum Bild passt.
    """
    ordner = WURZEL / "public/art"
    ordner.mkdir(parents=True, exist_ok=True)
    im = Image.open(HINTERGRUND).convert("RGB")

    ziel = ordner / "hintergrund.webp"
    im.save(ziel, "WEBP", quality=74, method=6)
    print(f"{ziel.name}: {im.width}x{im.height}, "
          f"{ziel.stat().st_size / 1024:.0f} KB")

    # Die Tiefe: unterster Streifen, an sich selbst gespiegelt, damit die
    # Wiederholung keine Kante zeigt.
    hoch = 420
    unten = im.crop((0, im.height - hoch, im.width, im.height))
    tiefe = Image.new("RGB", (im.width, hoch * 2))
    tiefe.paste(unten, (0, 0))
    tiefe.paste(unten.transpose(Image.FLIP_TOP_BOTTOM), (0, hoch))
    ziel_tiefe = ordner / "tiefe.webp"
    tiefe.save(ziel_tiefe, "WEBP", quality=74, method=6)
    print(f"{ziel_tiefe.name}: {tiefe.width}x{tiefe.height}, "
          f"{ziel_tiefe.stat().st_size / 1024:.0f} KB")


def einfaerben(im: Image.Image, drehung: int, staerke: float,
               innen: float) -> Image.Image:
    """Dreht den Farbton einer Blase — aus der türkisen wird eine orange, die
    Pinselstrich und Schillern behält.

    Der Farbton allein reicht nicht: Das dunkle Innere der Blase wird beim
    Drehen schlammig braun. Darum wird alles, was im Original dunkel war,
    zusätzlich abgedunkelt (`innen`), damit helle Schrift darauf trägt.
    """
    alpha = im.getchannel("A")
    h, s, v = im.convert("RGB").convert("HSV").split()
    versatz = round(drehung / 360 * 255) % 255
    h = h.point(lambda t: (t + versatz) % 255)
    gedreht = Image.merge("HSV", (h, s, v)).convert("RGB")
    gedreht = ImageEnhance.Color(gedreht).enhance(staerke)

    farbe = np.asarray(gedreht).astype(float)
    hell = np.asarray(v).astype(float)
    maske = np.clip((110 - hell) / 110, 0, 1)[..., None]
    farbe *= 1 - maske * (1 - innen)

    fertig = Image.fromarray(farbe.clip(0, 255).astype("uint8")).convert("RGBA")
    fertig.putalpha(alpha)
    return fertig


def rahmen() -> None:
    """Die Blasen-Textfelder. Sie werden später über border-image auf jede
    Textlänge gedehnt, brauchen also mehr Auflösung als die kleinen Sprites —
    aber auch nicht die vollen 800 KB je Stück."""
    ordner = WURZEL / "public/art/rahmen"
    ordner.mkdir(parents=True, exist_ok=True)
    for quelle in sorted(QUELLEN.glob("textfeld_*.png")):
        im = Image.open(quelle).convert("RGBA")
        if im.width > 700:
            im = im.resize((700, round(im.height * 700 / im.width)), Image.LANCZOS)
        ziel = ordner / f"{quelle.stem}.webp"
        im.save(ziel, "WEBP", quality=82, method=6)
        print(f"  {ziel.name}: {im.width}x{im.height}, "
              f"{ziel.stat().st_size / 1024:.0f} KB")

        # Aus dem flachen Feld zusätzlich eine orange Blase drehen — sie
        # rahmt den Ticket-Knopf ein und hebt ihn aus der türkisen Umgebung
        # heraus. Gedreht statt neu gemalt, damit Pinselstrich und
        # Schillern dieselben bleiben.
        if quelle.stem == "textfeld_04":
            orange = einfaerben(im, drehung=-175, staerke=1.6, innen=0.2)
            ziel_o = ordner / "textfeld_ticket.webp"
            orange.save(ziel_o, "WEBP", quality=82, method=6)
            print(f"  {ziel_o.name}: orange gedreht, "
                  f"{ziel_o.stat().st_size / 1024:.0f} KB")


def nur_hauptmotiv(im: Image.Image, anteil: float = 0.3) -> Image.Image:
    """Entfernt freistehende Reste aus einem freigestellten Bild.

    Beim Ausschneiden bleibt schon mal ein Stück vom Nachbarn hängen — im
    Fisch-Sprite etwa eine abgeschnittene Flosse in der Ecke. Hier werden
    zusammenhängende Flächen gesucht und alles verworfen, was kleiner ist als
    `anteil` der grössten.
    """
    breite, hoehe = im.size
    alpha = im.getchannel("A").load()
    besucht = bytearray(breite * hoehe)
    teile: list[list[int]] = []

    for start in range(breite * hoehe):
        if besucht[start]:
            continue
        sx, sy = start % breite, start // breite
        if alpha[sx, sy] <= 40:
            besucht[start] = 1
            continue
        teil = []
        stapel = [start]
        besucht[start] = 1
        while stapel:
            p = stapel.pop()
            teil.append(p)
            x, y = p % breite, p // breite
            for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                if 0 <= nx < breite and 0 <= ny < hoehe:
                    q = ny * breite + nx
                    if not besucht[q]:
                        besucht[q] = 1
                        if alpha[nx, ny] > 40:
                            stapel.append(q)
        teile.append(teil)

    if len(teile) < 2:
        return im

    groesste = max(len(t) for t in teile)
    weg = [p for t in teile if len(t) < groesste * anteil for p in t]
    if not weg:
        return im

    # getchannel() gibt ein eigenständiges Bild zurück, keinen Blick in das
    # Original — der geänderte Kanal muss also zurückgeschrieben werden.
    sauber = im.copy()
    kanal = sauber.getchannel("A")
    punkte = kanal.load()
    for p in weg:
        punkte[p % breite, p // breite] = 0
    sauber.putalpha(kanal)
    print(f"    {len(weg)} px loser Reste entfernt")
    return sauber


def sprites() -> None:
    """Blasen und Laternenfische — freigestellt, also mit Alphakanal."""
    ordner = WURZEL / "public/art/sprites"
    ordner.mkdir(parents=True, exist_ok=True)
    gesamt = 0
    for quelle in sorted(QUELLEN.glob("*.png")):
        if quelle == HINTERGRUND or quelle.name.startswith("textfeld_"):
            continue
        im = Image.open(quelle).convert("RGBA")
        # Reste zuerst entfernen, dann verkleinern: Beim Verkleinern entsteht
        # ein weicher Alphasaum, der lose Teile mit dem Motiv verbindet — danach
        # sind sie nicht mehr trennbar.
        im = nur_hauptmotiv(im)
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


def favicon() -> None:
    """Der Molch allein, eng beschnitten. Ein Favicon ist 16 bis 32 px gross —
    da wäre die ganze Blasenszene nur noch Matsch, ein einzelnes Motiv liest
    sich auch winzig noch."""
    im = Image.open(HINTERGRUND).convert("RGB")
    breite = im.width
    mitte_x, mitte_y = int(breite * 0.52), int(breite * 0.62)
    halb = int(breite * 0.24)
    motiv = im.crop(
        (mitte_x - halb, mitte_y - halb, mitte_x + halb, mitte_y + halb)
    ).resize((256, 256), Image.LANCZOS)
    # RGBA erzwingen: Next liest ICO-Dateien nur mit Alphakanal, sonst bricht
    # der Build mit „The PNG is not in RGBA format“ ab.
    ziel = WURZEL / "src/app/favicon.ico"
    motiv.convert("RGBA").save(ziel, sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
    print(f"  {ziel.name}: {ziel.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    hintergrund()
    rahmen()
    sprites()
    icons()
    favicon()
