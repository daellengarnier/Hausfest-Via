"""Zeichnet die Hausfest-Illustration als SVG:
Tuschezeichnung auf Nachtblau — Seifenblasen, verzweigte Korallen, Sterne.
Deterministisch (fester Seed), damit Builds reproduzierbar bleiben.
"""

import math
import random

W, H = 1200, 1600

INK = "#0d2a6b"          # dunkelblaue Kontur
NIGHT_A = "#0a1d52"
NIGHT_B = "#123a86"

CORAL_COLORS = [
    "#ff8a6b", "#ff9db8", "#c9a3ff", "#8fd8ff",
    "#b6f2c0", "#ffd28a", "#e6a9ff", "#7fe3d4",
]
PALE = ["#dff1ff", "#f3e4ff", "#ffe6f2", "#e2fff0"]


def branch(x, y, ang, length, width, depth, segs, color):
    """Rekursiver Korallenast — kurz, dick und knollig wie echte Koralle."""
    if depth == 0 or length < 4:
        return
    curve = random.uniform(-0.5, 0.5)
    x2 = x + math.cos(ang) * length
    y2 = y + math.sin(ang) * length
    cx = x + math.cos(ang + curve) * length * 0.55
    cy = y + math.sin(ang + curve) * length * 0.55
    segs.append((f"M{x:.0f} {y:.0f}Q{cx:.0f} {cy:.0f} {x2:.0f} {y2:.0f}", width))
    for i in range(random.choice([2, 2, 3])):
        spread = random.uniform(0.45, 0.95)
        na = ang + (spread if i % 2 == 0 else -spread) + random.uniform(-0.2, 0.2)
        branch(x2, y2, na, length * random.uniform(0.62, 0.8),
               max(1.0, width * 0.76), depth - 1, segs, color)


def coral(x, y, size, out, color=None, opacity=1.0, ang=None, inked=False):
    """Zeichnet die Äste nach Strichstärke gruppiert — spart Attribute und
    erlaubt eine dunkle Tuschekontur unter der Farbe."""
    color = color or random.choice(CORAL_COLORS)
    ang = ang if ang is not None else random.uniform(-math.pi, 0)
    depth = 4 if size > 55 else 3
    segs = []
    branch(x, y, ang, size * 0.3, max(1.6, size * 0.1), depth, segs, color)

    buckets = {}
    for d, w in segs:
        buckets.setdefault(round(w, 1), []).append(d)

    if inked:
        for w, ds in buckets.items():
            out.append(
                f'<path d="{"".join(ds)}" stroke="{INK}" stroke-width="{w + 2.4:.1f}" '
                f'stroke-linecap="round" fill="none" opacity="{opacity * .55:.2f}"/>'
            )
    for w, ds in buckets.items():
        out.append(
            f'<path d="{"".join(ds)}" stroke="{color}" stroke-width="{w:.1f}" '
            f'stroke-linecap="round" fill="none" opacity="{opacity:.2f}"/>'
        )


def bubble(cx, cy, r, out, idx):
    """Seifenblase: schimmernde Fläche, feiner Rand, Glanzlichter."""
    gid = f"bub{idx}"
    out.append(
        f'<radialGradient id="{gid}" cx="34%" cy="28%" r="78%">'
        f'<stop offset="0%" stop-color="#ffffff" stop-opacity=".92"/>'
        f'<stop offset="42%" stop-color="{random.choice(PALE)}" stop-opacity=".72"/>'
        f'<stop offset="82%" stop-color="#b9d9ff" stop-opacity=".55"/>'
        f'<stop offset="100%" stop-color="#e9d5ff" stop-opacity=".78"/>'
        f"</radialGradient>"
    )
    out.append(f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{r:.0f}" fill="url(#{gid})"/>')
    out.append(
        f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{r:.0f}" fill="none" '
        f'stroke="#ffffff" stroke-width="{max(1.4, r * 0.012):.1f}" opacity=".85"/>'
    )
    out.append(
        f'<circle cx="{cx:.0f}" cy="{cy:.0f}" r="{r - r * 0.045:.0f}" fill="none" '
        f'stroke="#9ec9ff" stroke-width="1" opacity=".5"/>'
    )
    # Glanzsichel oben links
    a0, a1 = math.radians(190), math.radians(255)
    rr = r * 0.82
    x0, y0 = cx + math.cos(a0) * rr, cy + math.sin(a0) * rr
    x1, y1 = cx + math.cos(a1) * rr, cy + math.sin(a1) * rr
    out.append(
        f'<path d="M{x0:.0f} {y0:.0f}A{rr:.0f} {rr:.0f} 0 0 1 {x1:.0f} {y1:.0f}" '
        f'stroke="#ffffff" stroke-width="{max(2, r * 0.05):.1f}" fill="none" '
        f'stroke-linecap="round" opacity=".9"/>'
    )
    out.append(
        f'<ellipse cx="{cx - r * 0.42:.0f}" cy="{cy - r * 0.5:.0f}" '
        f'rx="{r * 0.1:.0f}" ry="{r * 0.07:.0f}" fill="#fff" opacity=".95" '
        f'transform="rotate(-35 {cx - r * 0.42:.0f} {cy - r * 0.5:.0f})"/>'
    )


def pyramid(cx, cy, s, out):
    """Glaspyramide als rosa Drahtgitter — das Wahrzeichen des Hauses."""
    apex = (cx, cy - s * 0.62)
    bl, br_, bf = (cx - s * 0.6, cy + s * 0.42), (cx + s * 0.6, cy + s * 0.42), (cx, cy + s * 0.62)
    c = "#ff9ec7"
    for a, b in [(apex, bl), (apex, br_), (apex, bf), (bl, br_), (bl, bf), (br_, bf)]:
        out.append(
            f'<line x1="{a[0]:.0f}" y1="{a[1]:.0f}" x2="{b[0]:.0f}" y2="{b[1]:.0f}" '
            f'stroke="{c}" stroke-width="2" opacity=".85" stroke-linecap="round"/>'
        )
    for t in (0.33, 0.66):
        for base in (bl, br_, bf):
            mx = apex[0] + (base[0] - apex[0]) * t
            my = apex[1] + (base[1] - apex[1]) * t
            out.append(f'<circle cx="{mx:.0f}" cy="{my:.0f}" r="2" fill="{c}" opacity=".7"/>')
    for t in (0.25, 0.5, 0.75):
        p1 = (apex[0] + (bl[0] - apex[0]) * t, apex[1] + (bl[1] - apex[1]) * t)
        p2 = (apex[0] + (br_[0] - apex[0]) * t, apex[1] + (br_[1] - apex[1]) * t)
        out.append(
            f'<line x1="{p1[0]:.0f}" y1="{p1[1]:.0f}" x2="{p2[0]:.0f}" y2="{p2[1]:.0f}" '
            f'stroke="{c}" stroke-width="1.2" opacity=".55"/>'
        )


def house(cx, cy, s, out):
    """Kleines Haus mit leuchtenden Fenstern — Echo aufs App-Icon."""
    w, h = s * 0.9, s * 0.62
    x0, y0 = cx - w / 2, cy - h / 2 + s * 0.12
    out.append(
        f'<path d="M{x0:.0f} {y0:.0f}h{w:.0f}v{h:.0f}h{-w:.0f}z" fill="#1b3f8f" '
        f'stroke="{INK}" stroke-width="2.5" opacity=".9"/>'
    )
    out.append(
        f'<path d="M{x0 - s * 0.09:.0f} {y0:.0f}L{cx:.0f} {y0 - s * 0.42:.0f}'
        f'L{x0 + w + s * 0.09:.0f} {y0:.0f}z" fill="#24509f" stroke="{INK}" '
        f'stroke-width="2.5" stroke-linejoin="round" opacity=".95"/>'
    )
    for i in (-1, 1):
        out.append(
            f'<rect x="{cx + i * s * 0.26 - s * 0.1:.0f}" y="{y0 + h * 0.22:.0f}" '
            f'width="{s * 0.2:.0f}" height="{s * 0.2:.0f}" rx="2" fill="#ffc36b" '
            f'stroke="{INK}" stroke-width="1.6"/>'
        )
    out.append(
        f'<path d="M{cx - s * 0.09:.0f} {y0 + h:.0f}v{-h * 0.42:.0f}'
        f'a{s * 0.09:.0f} {s * 0.09:.0f} 0 0 1 {s * 0.18:.0f} 0v{h * 0.42:.0f}z" '
        f'fill="#ffb055" stroke="{INK}" stroke-width="1.6"/>'
    )


def build(seed, w, h, bubbles_spec, dense=True):
    random.seed(seed)
    defs, art = [], []

    art.append(f'<rect width="{w}" height="{h}" fill="url(#night)"/>')

    # Hintergrund-Korallen: blass, wie durchs Wasser gesehen
    for _ in range(int((w * h) / 60000)):
        coral(random.uniform(0, w), random.uniform(0, h),
              random.uniform(40, 100), art,
              color=random.choice(["#3f6dc4", "#5b8ad6", "#7a6fd0"]),
              opacity=random.uniform(0.35, 0.6))

    # Sterne und Bokeh
    for _ in range(int((w * h) / 16000)):
        x, y, r = random.uniform(0, w), random.uniform(0, h), random.uniform(1, 2.6)
        art.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r:.1f}" fill="#fff" '
                   f'opacity="{random.uniform(.3, .9):.2f}"/>')
    for _ in range(int((w * h) / 60000)):
        x, y, r = random.uniform(0, w), random.uniform(0, h), random.uniform(8, 22)
        art.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r:.0f}" '
                   f'fill="{random.choice(["#6f8fd8", "#a98fd8", "#78b6d8"])}" '
                   f'opacity="{random.uniform(.14, .28):.2f}"/>')

    # Blasen mit Innenleben
    for i, (bx, by, br_, inner) in enumerate(bubbles_spec):
        cx, cy, r = bx * w, by * h, br_ * min(w, h)
        clip = f"clip{i}"
        defs.append(f'<clipPath id="{clip}"><circle cx="{cx:.0f}" cy="{cy:.0f}" '
                    f'r="{r * 0.92:.0f}"/></clipPath>')
        bubble(cx, cy, r, art, i)
        inside = []
        if inner == "pyramid":
            pyramid(cx, cy, r * 0.95, inside)
        elif inner == "house":
            house(cx, cy, r * 0.85, inside)
        else:
            for _ in range(random.choice([1, 2, 2])):
                coral(cx + random.uniform(-r * .4, r * .4),
                      cy + random.uniform(-r * .1, r * .55),
                      r * random.uniform(1.0, 1.7), inside, inked=True)
        art.append(f'<g clip-path="url(#{clip})">' + "".join(inside) + "</g>")

    # Korallen im Vordergrund, kräftig
    if dense:
        for _ in range(int((w * h) / 70000)):
            coral(random.uniform(0, w), random.uniform(0, h),
                  random.uniform(60, 140), art, opacity=random.uniform(.8, 1),
                  inked=True)

    grad = (
        f'<radialGradient id="night" cx="50%" cy="42%" r="78%">'
        f'<stop offset="0%" stop-color="{NIGHT_B}"/>'
        f'<stop offset="100%" stop-color="{NIGHT_A}"/></radialGradient>'
    )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        f'width="{w}" height="{h}" fill="none">'
        f"<defs>{grad}{''.join(defs)}</defs>{''.join(art)}</svg>"
    )


HERO = [
    (0.18, 0.14, 0.115, "coral"),
    (0.72, 0.10, 0.155, "coral"),
    (0.46, 0.24, 0.085, "pyramid"),
    (0.30, 0.40, 0.185, "coral"),
    (0.78, 0.46, 0.145, "house"),
    (0.10, 0.70, 0.165, "coral"),
    (0.55, 0.76, 0.125, "coral"),
    (0.88, 0.82, 0.10, "coral"),
    (0.28, 0.93, 0.115, "coral"),
]

if __name__ == "__main__":
    import pathlib
    out = pathlib.Path(__file__).resolve().parents[2] / "public/art"
    out.mkdir(parents=True, exist_ok=True)
    (out / "hero.svg").write_text(build(20260905, 1200, 1600, HERO))
    print("hero.svg", (out / "hero.svg").stat().st_size // 1024, "KB")
