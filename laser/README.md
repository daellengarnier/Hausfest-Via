# Laser-Vorlagen

Runder Anhänger **Ø 50 mm** mit QR-Code auf die Hausfest-Seite, gedacht für
dünnes Sperrholz.

## Dateien

| Datei | Text oben |
| --- | --- |
| `hausfest-qr-50mm.svg` | Hausfest Via · 5. September |

Auf dem Anhänger steht „Hausfest Via“ ohne die 1 — auf 50 mm zählt jedes
Zeichen, und je kürzer die Zeile, desto grösser darf der QR werden. Auf der
Seite heisst das Fest weiterhin „Hausfest Via 1“.

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
- QR: 27.7 mm, 33 × 33 Module, **0.84 mm pro Modul**
- Fehlerkorrektur: Stufe H (bis 30 % der Fläche darf beschädigt sein)
- Die SVG ist in Millimetern angelegt (1 Einheit = 1 mm). Beim Import auf
  100 % skalieren, nicht „einpassen“.

Titel und Link stehen auf gerader Zeile statt auf dem Bogen — das spart
Platz, und der QR wird dadurch grösser (0.84 statt 0.73 mm pro Modul). Die
Grösse rechnet das Skript aus: Es misst die beiden Textzeilen und gibt dem QR
alles, was zwischen ihnen noch in den Kreis passt.

## Gestaltung

Die Module sind weich verrundet und wachsen zu Bändern zusammen, einzelne
stehen als runde Punkte. In der Mitte ist ein Feld von 11 × 11 Modulen
freigeräumt, dort steht die gemauerte Pyramide mit dem strahlenden Auge.

**Die äusseren Ringe der drei Suchmuster sind bewusst eckig.** Scanner suchen
entlang jeder Abtastlinie das Verhältnis 1:1:3:1:1; gerundete Ringecken
verkürzen die dunklen Abschnitte. Im Test fiel die Erkennung mit gerundeten
Ringen vollständig aus — schon eine leichte Rundung (0.4 Modul) kostete die
Hälfte der Leseabstände. Der innere Punkt darf dagegen voll gerundet sein,
das kostet nichts. Wer die Ecken also „schöner“ machen will: nur den inneren
Punkt anfassen, nicht den Ring.

## Worauf beim Lasern achten

- **Polarität nicht umkehren.** Die dunklen Module müssen graviert werden,
  der Rest bleibt hell. Ein invertierter Code wird von vielen Scannern nicht
  gelesen.
- **Nicht zu tief gravieren.** Der Laser trägt breiter ab als die Vektorkante;
  bei 0.84 mm Modulen laufen die hellen Zwischenräume sonst zu. Lieber
  schnell und hell als langsam und tief.
- **Vorher testen.** Ein Probestück gravieren und mit dem Handy scannen,
  bevor die ganze Serie läuft.

Der Code wurde gegen simulierten Brandrand, Holzmaserung und schwachen
Kontrast geprüft — mit freigeräumter Mitte und Pyramide — und liess sich noch
aus einem 200 × 200 px grossen Foto der Scheibe auslesen. Falls doch etwas
schiefgeht, steht der Link unten auf der Scheibe zum Abtippen.

## Neu erzeugen

Nach einer Textänderung (oder wenn die URL wechselt):

```bash
pip install segno fonttools
python3 scripts/art/gen_qr.py
```

Die Schriften kommen aus `src/app/fonts/` und stecken als Pfade in der SVG —
die Datei ist also auf jedem Rechner identisch, ganz ohne Font-Installation.
