# Laser-Vorlagen

Runder Anhänger **Ø 50 mm** mit QR-Code auf die Hausfest-Seite, gedacht für
dünnes Sperrholz.

## Dateien

| Datei | wofür |
| --- | --- |
| `hausfest-qr-50mm.svg` | die Vorlage, für die Lasersoftware |
| `hausfest-qr-50mm.pdf` | dieselbe Zeichnung als PDF, 50 × 50 mm — für alles, was kein SVG frisst |
| `hausfest-qr-50mm.png` | 1181 × 1181 px (600 dpi), weisser Grund — für Vorschau und Druck |

Alle drei tragen oben „Hausfest Via · 5. September“ und unten den Link.
SVG und PDF sind Vektor, im PNG steckt der Schnittkreis nur noch als rote
Linie im Bild.

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
- QR: 26.2 mm, 33 × 33 Module, **0.79 mm pro Modul**
- Fehlerkorrektur: Stufe H (bis 30 % der Fläche darf beschädigt sein)
- Die SVG ist in Millimetern angelegt (1 Einheit = 1 mm). Beim Import auf
  100 % skalieren, nicht „einpassen“.

Titel und Link stehen auf gerader Zeile statt auf dem Bogen — das spart
Platz, und der QR wird dadurch grösser (0.79 statt 0.73 mm pro Modul). Die
Grösse rechnet das Skript aus: Es misst die beiden Textzeilen und gibt dem QR
alles, was zwischen ihnen noch in den Kreis passt.

Schrift und QR teilen sich also denselben Platz — grössere Schrift heisst
kleinere Module. Die aktuellen 2.55 mm (Titel) und 2.10 mm (Link) sind der
Punkt, an dem die Schrift spürbar wächst, ohne dass der Code schlechter
liest: Im Test gegen Brandrand, Maserung und schwachen Kontrast besteht
diese Fassung genau dieselben Fälle wie die frühere mit kleinerer Schrift.
Eine Stufe grösser fiel bereits ein Fall weg.

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
  bei 0.79 mm Modulen laufen die hellen Zwischenräume sonst zu. Lieber
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
pip install segno fonttools cairosvg
python3 scripts/art/gen_qr.py
```

`cairosvg` braucht es nur für PDF und PNG — ohne das Paket entsteht
trotzdem die SVG.

Die Schriften kommen aus `src/app/fonts/` und stecken als Pfade in der SVG —
die Datei ist also auf jedem Rechner identisch, ganz ohne Font-Installation.
