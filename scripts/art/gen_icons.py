"""App-Icons in der Bildwelt der Landingpage: das leuchtende Haus in einer
Seifenblase, auf Nachtblau. Motiv bleibt in der Maskable-Safe-Zone (mittlere
80 %), damit Android nichts abschneidet."""

import io
import pathlib
import random

import cairosvg
from PIL import Image

import gen_art as g

S = 1024


def icon_svg():
    random.seed(905)
    art = [f'<rect width="{S}" height="{S}" fill="url(#night)"/>']

    # Sterne und Bokeh in den Ecken — dort, wo die Maske schneiden darf
    for _ in range(70):
        x, y, r = random.uniform(0, S), random.uniform(0, S), random.uniform(2, 5)
        art.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r:.1f}" fill="#fff" '
                   f'opacity="{random.uniform(.3, .9):.2f}"/>')
    for _ in range(9):
        x, y, r = random.uniform(0, S), random.uniform(0, S), random.uniform(20, 55)
        art.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r:.0f}" '
                   f'fill="{random.choice(["#6f8fd8", "#a98fd8", "#78b6d8"])}" '
                   f'opacity="{random.uniform(.16, .3):.2f}"/>')

    # Vier Korallen als Kranz um die Blase, knapp ausserhalb des Motivs
    for x, y, size, ang in [(120, 900, 230, -1.2), (905, 880, 210, -1.9),
                            (110, 250, 190, -1.4), (930, 260, 200, -1.7)]:
        g.coral(x, y, size, art, inked=True, ang=ang)

    # Die Blase mit dem Haus — Herzstück, mittig in der Safe-Zone
    cx = cy = S / 2
    r = S * 0.335
    art.append(f'<clipPath id="c"><circle cx="{cx:.0f}" cy="{cy:.0f}" '
               f'r="{r * 0.92:.0f}"/></clipPath>')
    g.bubble(cx, cy, r, art, 0)
    inner = []
    g.house(cx, cy, r * 1.05, inner)
    art.append('<g clip-path="url(#c)">' + "".join(inner) + "</g>")

    grad = ('<radialGradient id="night" cx="50%" cy="42%" r="78%">'
            f'<stop offset="0%" stop-color="{g.NIGHT_B}"/>'
            f'<stop offset="100%" stop-color="{g.NIGHT_A}"/></radialGradient>')

    # Die Gradienten der Blase liegen in `art`; sie duerfen vor der Nutzung
    # stehen, SVG loest Referenzen dokumentweit auf.
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}" '
            f'width="{S}" height="{S}" fill="none"><defs>{grad}</defs>'
            f"{''.join(art)}</svg>")


if __name__ == "__main__":
    svg = icon_svg()
    png = cairosvg.svg2png(bytestring=svg.encode(), output_width=S, output_height=S)
    master = Image.open(io.BytesIO(png)).convert("RGB")

    out = pathlib.Path(__file__).resolve().parents[2] / "public/icons"
    for size, name in [(512, "icon-512.png"), (192, "icon-192.png"),
                       (180, "apple-touch-icon.png")]:
        master.resize((size, size), Image.LANCZOS).save(out / name, optimize=True)
        print(name, size)

