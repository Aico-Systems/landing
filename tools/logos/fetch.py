"""Fetch the logos of the systems the cards name into src/lib/logos, in a
light and a dark variant: <id>.png for light tiles, <id>-dark.png for dark
tiles where the mark needs one. Run from the landing folder after adding
or changing a system in src/lib/systems.ts; it fetches only what is
missing (--all fetches everything again).

python3 tools/logos/fetch.py [--all]

Where a logo comes from, in order: the system's own `logo` (a URL, an
inline SVG in a page header, or a mark drawn here), its Simple Icons mark
(CC0), its Activepieces piece logo, the vendor's apple-touch icon, the
vendor's site icon. Every logo then goes the same way: rasterised, any
flat white background removed, trimmed, set on a square. The dark variant
recolours a dark, colourless mark (black or grey ink) to near-white and
leaves brand colours as they are.
"""
import io, json, os, re, subprocess, sys, urllib.request
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(f"{HERE}/../..")
OUT = f"{ROOT}/src/lib/logos"
SIZE = 160
os.makedirs(OUT, exist_ok=True)
systems = json.loads(subprocess.check_output(["bun", f"{HERE}/systems.ts"], cwd=ROOT))
redo = "--all" in sys.argv

# marks drawn here, for systems without a brand of their own
LOCAL = {
    "webhooks": '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#1f1f23" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 15.5a3.5 3.5 0 1 1-4-3.46"/><path d="M12 6.5a3.5 3.5 0 1 1 3.2 4.95L12 16.5"/><path d="M15 15.5h4.5a3.5 3.5 0 1 1-1.6 6.6"/><path d="M8.5 9.8 5.5 15.5h9.5"/></svg>',
}


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) logo-fetch"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read(), r.headers.get_content_type()


def raster(data, kind):
    """Bytes of an SVG or bitmap to an RGBA image."""
    if kind == "image/svg+xml" or data.lstrip()[:5] in (b"<svg ", b"<?xml") or b"<svg" in data[:300]:
        png = subprocess.run(["rsvg-convert", "-h", "512", "--keep-aspect-ratio"], input=data, capture_output=True, check=True).stdout
        return Image.open(io.BytesIO(png)).convert("RGBA")
    return Image.open(io.BytesIO(data)).convert("RGBA")


def clear_white(im):
    """A flat white (or near-white) background, reached from the corners, goes transparent."""
    w, h = im.size
    px = im.load()
    white = lambda p: p[3] > 200 and min(p[:3]) > 222
    if sum(white(px[x, y]) for x, y in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1))) < 3:
        return im
    seen, todo = set(), [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    while todo:
        x, y = todo.pop()
        if (x, y) in seen or not (0 <= x < w and 0 <= y < h) or not white(px[x, y]):
            continue
        seen.add((x, y))
        px[x, y] = (255, 255, 255, 0)
        todo += [(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)]
    return im


def trim(im):
    box = im.getchannel("A").point(lambda a: 255 if a > 12 else 0).getbbox()
    return im.crop(box) if box else im


def square(im):
    side = int(max(im.size) * 1.08)
    sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    sq.alpha_composite(im, ((side - im.width) // 2, (side - im.height) // 2))
    return sq.resize((SIZE, SIZE), Image.LANCZOS)


INK_LIGHT, INK_DARK = (236, 236, 240), (31, 31, 35)
lum = lambda p: 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2]
colourless = lambda p: max(p[:3]) - min(p[:3]) < 40


def own_tile(im):
    """The mark brings its own background (an app icon, a plate): the
    trimmed mark is almost entirely opaque. Leave it alone."""
    alpha = im.getchannel("A").get_flattened_data()
    return sum(a > 200 for a in alpha) / len(alpha) > 0.85


def variants(im):
    """(light, dark) images for light and dark tiles; dark is None when the
    light one reads on both. A mark that is mostly dark (black, grey, or a
    dark brand colour like navy) turns near-white on dark tiles; a mark in
    colourless dark ink among colours turns only that ink; a mark that is
    white turns dark on light tiles."""
    if own_tile(im):
        return im, None
    px = list(im.get_flattened_data())
    seen = [p for p in px if p[3] > 40]
    if not seen:
        return im, None
    # deep: colourless dark ink, or a colour as deep as navy (a saturated
    # red is darker than it looks by luminance and reads on dark tiles)
    deep = lambda p: lum(p) < 110 if colourless(p) else (lum(p) < 50 and p[0] < 90) or (lum(p) < 80 and p[2] > p[0] + 60 and p[2] > p[1])
    dark = sum(deep(p) for p in seen) / len(seen)
    ink = sum(lum(p) < 110 and colourless(p) for p in seen) / len(seen)
    white = sum(lum(p) > 225 and colourless(p) for p in seen) / len(seen)

    def recolour(test, to):
        out = Image.new("RGBA", im.size)
        out.putdata([(*to, p[3]) if p[3] > 0 and test(p) else p for p in px])
        return out

    if white > 0.5:
        return recolour(lambda p: lum(p) > 200 and colourless(p), INK_DARK), im
    if dark > 0.5:
        # a two-tone mark (a white glyph on a navy disc) swaps both tones
        out = Image.new("RGBA", im.size)
        out.putdata([(*INK_LIGHT, p[3]) if p[3] > 0 and deep(p) else (*INK_DARK, p[3]) if p[3] > 0 and lum(p) > 225 and colourless(p) else p for p in px])
        return im, out
    if ink > 0.12:
        return im, recolour(lambda p: lum(p) < 110 and colourless(p), INK_LIGHT)
    return im, None


def sources(s):
    logo = s.get("logo")
    if logo and logo.startswith("local:"):
        yield "drawn here", lambda: (LOCAL[logo[6:]].encode(), "image/svg+xml")
    elif logo and logo.startswith("inline:"):
        def inline():
            page, _ = get(logo[7:])
            # the header's brand link holds the logo; the first <svg> on a page is often an icon
            brand = re.search(rb"(navbar-brand|brand|logo)[^>]*>\s*(<svg.*?</svg>)", page, re.S)
            svg = brand.group(2)
            return svg, "image/svg+xml"
        yield "inline SVG", inline
    elif logo:
        yield "own logo", lambda: get(logo)
    if s.get("svg"):
        yield "simple-icons", lambda: (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#{s["svg"]["hex"]}" d="{s["svg"]["path"]}"/></svg>'.encode(), "image/svg+xml")
    if s.get("piece"):
        yield "activepieces", lambda: get(f"https://cdn.activepieces.com/pieces/{s['piece']}.png")
    yield "apple-touch-icon", lambda: get(f"https://{s['domain']}/apple-touch-icon.png")
    yield "site icon", lambda: get(f"https://www.google.com/s2/favicons?domain={s['domain']}&sz=256")


for sid, s in systems.items():
    light, dark = f"{OUT}/{sid}.png", f"{OUT}/{sid}-dark.png"
    if os.path.exists(light) and not redo:
        continue
    for old in (light, dark, f"{OUT}/{sid}.svg"):
        if os.path.exists(old):
            os.remove(old)
    got = None
    for label, fetch in sources(s):
        try:
            im = raster(*fetch())
            if min(im.size) < 24 and label != "own logo":
                continue
            # variants are judged on the trimmed mark, whose edge is its own
            lt, dk = variants(trim(clear_white(im)))
            square(lt).save(light, optimize=True)
            if dk:
                square(dk).save(dark, optimize=True)
            got = label + (" + dark" if dk else "")
            break
        except Exception:
            continue
    print(f"{sid:16} {got or '— lettered tile'}")
