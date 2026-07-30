# Plakat

Das gezeichnete A3-Plakat, mit QR-Code zum Ticketshop.

| Datei | wofür |
| --- | --- |
| `ViaFest_A3.pdf` | die gezeichnete Vorlage mit dem leeren weissen Feld |
| `qr_petzi.svg` / `qr_petzi.pdf` | der QR allein, 27 mm, als Vektor |
| `ViaFest_A3_mit_QR.pdf` | das fertige Plakat — **das in den Druck geben** |

Der QR steckt im Plakat als Vektor, nicht als Bild — er bleibt also auch
in A3 gestochen scharf.

## Worauf er zeigt

Direkt auf den Petzi-Ticketshop (nicht auf die Hausfest-Seite — das
Plakat wirbt ja genau für die Tickets). Der Link ist lang, darum ist der
Code dichter als auf dem Laser-Anhänger: 45 × 45 Module, 0.55 mm je
Modul. Auf Papier gedruckt ist das unkritisch; geprüft wurde die
Lesbarkeit an gerenderten «Handyfotos» — schräg, unscharf und mit
schwachem Kontrast klappt es bis weit über das hinaus, was beim Scannen
eines Plakats normal ist.

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
