# Bild-Generatoren

Die Illustration, die App-Icons und die Laser-Vorlage werden aus Code erzeugt,
nicht von Hand gezeichnet. So bleibt alles reproduzierbar und lässt sich
ändern, ohne ein Grafikprogramm zu öffnen.

```bash
pip install segno fonttools cairosvg Pillow

python3 scripts/art/gen_art.py     # -> public/art/hero.svg
python3 scripts/art/gen_icons.py   # -> public/icons/*.png
python3 scripts/art/gen_qr.py      # -> laser/*.svg
```

| Skript | erzeugt | worum es geht |
| --- | --- | --- |
| `gen_art.py` | `public/art/hero.svg` | Die Hintergrund-Zeichnung: Seifenblasen, verzweigte Korallen, Glaspyramide und das Haus, auf Nachtblau. Auch die Bausteine (`bubble`, `coral`, `house`, `pyramid`) für die anderen Skripte. |
| `gen_icons.py` | `public/icons/*.png` | Die PWA-Icons — das Haus in einer Blase, Motiv innerhalb der Maskable-Safe-Zone. |
| `gen_qr.py` | `laser/*.svg` | Der QR-Anhänger zum Lasern, siehe `laser/README.md`. |

Alle Skripte haben einen festen Zufalls-Seed: gleicher Code, gleiches Bild.
Wer die Komposition ändern will, dreht am Seed (`random.seed(...)`) oder an
der Blasen-Liste `HERO` in `gen_art.py`.

`gen_icons.py` und `gen_qr.py` bauen auf `gen_art.py` bzw. auf den Schriften
in `src/app/fonts/` auf — die Skripte also aus dem Projektordner starten.
