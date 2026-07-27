# Laser-Vorlagen

Runder Anhänger **Ø 50 mm** mit QR-Code auf die Hausfest-Seite, gedacht für
dünnes Sperrholz.

## Dateien

| Datei | Text oben |
| --- | --- |
| `hausfest-qr-50mm.svg` | Hausfest Via1 · 5. September |
| `hausfest-qr-50mm-ohne-1.svg` | Hausfest Via · 5. September |

Zwei Varianten, weil in der Vorgabe „Via1“ stand — falls das ein Tippfehler
war, ist die zweite Datei die richtige. Vor dem Lasern kurz prüfen: auf Holz
lässt sich das nicht mehr korrigieren.

## Ebenen

Die SVG hat zwei Gruppen, die jede Lasersoftware getrennt ansteuern kann:

- **`gravur`** — schwarz gefüllt: QR-Module, Schrift, die zwei Punkte an den
  Seiten. Als *Gravur / Raster* fahren.
- **`schnitt`** — rote Haarlinie (0.08 mm): der Aussenkreis. Als *Schnitt /
  Vektor* fahren.

Die weisse Fläche hinter dem QR ist die Ruhezone. Sie wird **nicht** graviert
— dort bleibt das Holz unberührt, damit der Code Kontrast hat.

## Masse

- Scheibe: 50 mm Durchmesser
- QR: 24.1 mm, 33 × 33 Module, **0.73 mm pro Modul**
- Fehlerkorrektur: Stufe H (bis 30 % der Fläche darf beschädigt sein)
- Die SVG ist in Millimetern angelegt (1 Einheit = 1 mm). Beim Import auf
  100 % skalieren, nicht „einpassen“.

## Worauf beim Lasern achten

- **Polarität nicht umkehren.** Die dunklen Module müssen graviert werden,
  der Rest bleibt hell. Ein invertierter Code wird von vielen Scannern nicht
  gelesen.
- **Nicht zu tief gravieren.** Der Laser trägt breiter ab als die Vektorkante;
  bei 0.73 mm Modulen laufen die hellen Zwischenräume sonst zu. Lieber
  schnell und hell als langsam und tief.
- **Vorher testen.** Ein Probestück gravieren und mit dem Handy scannen,
  bevor die ganze Serie läuft.

Der Code wurde gegen simulierten Brandrand, Holzmaserung und schwachen
Kontrast geprüft und liess sich noch aus einem 200 × 200 px grossen Foto der
Scheibe auslesen. Falls doch etwas schiefgeht, steht der Link unten auf der
Scheibe zum Abtippen.

## Neu erzeugen

Nach einer Textänderung (oder wenn die URL wechselt):

```bash
pip install segno fonttools
python3 scripts/art/gen_qr.py
```

Die Schriften kommen aus `src/app/fonts/` und stecken als Pfade in der SVG —
die Datei ist also auf jedem Rechner identisch, ganz ohne Font-Installation.
