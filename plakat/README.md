# Plakat

Das gezeichnete A3-Plakat, mit QR-Code zum Ticketshop.

| Datei | wofür |
| --- | --- |
| `ViaFest_A3.pdf` | die gezeichnete Vorlage mit dem leeren weissen Feld |
| `qr_seite.svg` / `qr_seite.pdf` | der QR allein, 27 mm, als Vektor |
| `ViaFest_A3_mit_QR.pdf` | das fertige Plakat — **das in den Druck geben** |

Der QR steckt im Plakat als Vektor, nicht als Bild — er bleibt also auch
in A3 gestochen scharf. Sein Grund ist keine weisse
Fläche, sondern eine Aquarell-Wäsche aus der Palette des Plakats
(per k-means gemessen): Teich-Türkis als Grundton, darüber weiche Wolken
aus sattem Türkis, dem Gelbgrün der Seerosenblätter, Wasserblau und
einem Hauch Lilien-Pink. Scanner brauchen Kontrast, nicht Weiss; die
Lesbarkeit ist mit dem farbigen Grund unverändert geprüft.

## Worauf er zeigt

Auf die Hausfest-Seite — wie der Anhänger. Der Petzi-Shop ist
passwortgeschützt, und das Passwort steht nur auf der Seite, direkt am
Ticket-Knopf; ein QR direkt in den Shop liesse die Leute vor einem
Passwortfeld stehen. Gleicher Code wie auf dem Anhänger (33 × 33
Module, hier 0.73 mm je Modul), nur ohne Scheibe und Schrift. Die
Lesbarkeit ist an gerenderten «Handyfotos» geprüft — schräg, unscharf
und mit schwachem Kontrast.

Gestaltet wie der Anhänger: weiche, verbundene Module, eckige Suchringe
(Pflicht — siehe `laser/README.md`), in der freigeräumten Mitte die
Pyramide mit dem Auge.

## Neu erzeugen

Wenn sich der Ticket-Link ändert oder ein neues Plakat kommt:

```bash
pip install segno fonttools cairosvg pymupdf
python3 scripts/art/gen_qr_plakat.py            # nimmt plakat/ViaFest_A3.pdf
python3 scripts/art/gen_qr_plakat.py mein.pdf   # oder eine andere Vorlage
```

Die Lage des weissen Felds steht als `FELD` im Skript (in pt gemessen).
Bei einem neuen Plakat-Entwurf zuerst dort die Koordinaten nachführen.
