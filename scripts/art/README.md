# Bild-Werkstatt

Die gemalten Vorlagen liegen unter `art/` — ausserhalb von `public/`, damit
die schweren Originale nicht mit ausgeliefert werden. Alles, was der Browser
lädt, wird daraus abgeleitet. Die Laser-Vorlage entsteht ganz aus Code.

```bash
pip install Pillow numpy opencv-python segno fonttools

python3 scripts/art/prepare_hintergrund.py   # art/*.png -> public/art, public/icons
python3 scripts/art/gen_qr.py                # -> laser/*.svg
```

| Skript | erzeugt | worum es geht |
| --- | --- | --- |
| `prepare_hintergrund.py` | `public/art/*`, `public/icons/*`, `src/app/favicon.ico` | Rechnet die gemalten Vorlagen fürs Web klein: Hintergrund, Höhlenkachel für die Tiefe, Blasen-Textfelder, freigestellte Sprites (Blasen, Quallen, Laternenfische), App-Icons und Favicon aus dem Molch. |
| `gen_qr.py` | `laser/*.svg` | Der QR-Anhänger zum Lasern, siehe `laser/README.md`. |

Zwei Eingriffe in `prepare_hintergrund.py` sind mehr als Verkleinern:

* `vorlage()` retuschiert die zwei gemalten Laternenfische aus der Höhle
  heraus. An ihrer Stelle sitzt auf der Seite ein beweglicher Fisch
  (`.hoehlen-fisch`), der sich umschaut — zwei starre dazu wären einer
  zu viel.
* `nur_hauptmotiv()` wirft beim Freistellen lose Reste weg (eine
  abgeschnittene Flosse am Fisch, ein Stück Nachbarblase). Das muss **vor**
  dem Verkleinern laufen: Der weiche Rand nach dem Skalieren verbindet
  sonst den Rest wieder mit dem Hauptmotiv.

Die Fische, Blasen und Quallen sitzen auf der Seite in `src/components/blubber.tsx`,
das Molchauge und der Höhlenfisch in `src/app/page.tsx` — beide in `vw`
verankert, weil das Hintergrundbild auf die volle Fensterbreite gezogen wird.

`gen_qr.py` braucht die Schriften in `src/app/fonts/` — die Skripte also aus
dem Projektordner starten.
