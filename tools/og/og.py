"""Draw the share images (Open Graph, X cards): 1200 x 630, one per language
and page, at static/og/<locale>-<vertical|home>.png.

python3 tools/og/og.py            # from the landing folder; needs blender and bun

Each is the page in small: the vertical's name and line on the paper at
left, its scene at right, rendered headless by tools/blender/render.py (the
home page shows the warehouse). Words come from src/lib/i18n through
words.ts, colours from blueprint's tokens, the type is the page's Archivo.
Scene renders are cached in tools/og/.cache; delete it after a scene changes.
"""
import json, os, re, subprocess
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(f"{HERE}/../..")
CACHE = f"{HERE}/.cache"
OUT = f"{ROOT}/static/og"
W, H = 1200, 630
SCENE_W = 700
#: the text column ends here; the scene starts under the fade after it
TEXT_W = 420
os.makedirs(CACHE, exist_ok=True)
os.makedirs(OUT, exist_ok=True)

data = json.loads(subprocess.check_output(["bun", f"{HERE}/words.ts"], cwd=ROOT))
css = open(f"{ROOT}/../blueprint/src/blueprint.css").read()


def token(var):
    m = re.search(re.escape(var) + r":\s*rgb\((\d+),\s*(\d+),\s*(\d+)\)", css)
    return tuple(int(x) for x in m.groups())


PAPER, INK, ACCENT = (token(t) for t in ("--aico-grey-100", "--aico-grey-900", "--aico-orange-600"))

# the page's font, from woff2 to something Pillow reads
ttf = f"{CACHE}/archivo.ttf"
if not os.path.exists(ttf):
    font = TTFont(f"{ROOT}/node_modules/@fontsource-variable/archivo/files/archivo-latin-standard-normal.woff2")
    font.flavor = None
    font.save(ttf)


def face(size, weight, width=100):
    f = ImageFont.truetype(ttf, size)
    axes = {a["name"] if isinstance(a["name"], str) else a["name"].decode(): a for a in f.get_variation_axes()}
    f.set_variation_by_axes([weight if "Weight" in n else width for n in axes])
    return f


def scene(name):
    png = f"{CACHE}/{name}.png"
    if not os.path.exists(png):
        subprocess.run(["blender", "-b", "--factory-startup", "--python", f"{ROOT}/tools/blender/render.py", "--",
                        name, png, "52", "0", "0", str(SCENE_W), str(H)], check=True, capture_output=True)
    return Image.open(png).convert("RGB")


def wrap(draw, text, font, width):
    lines, line = [], ""
    for word in text.split():
        trial = f"{line} {word}".strip()
        if draw.textlength(trial, font=font) <= width or not line:
            line = trial
        else:
            lines.append(line)
            line = word
    return lines + [line]


def card(words, page, scene_name, out):
    img = Image.new("RGB", (W, H), PAPER)
    img.paste(scene(scene_name), (W - SCENE_W, 0))
    # the paper fades over the scene's left edge, as on the page
    edge = W - SCENE_W
    fade = Image.new("L", (W, 1))
    fade.putdata([max(0, min(255, int(255 * (1 - (x - edge) / 120)))) for x in range(W)])
    fade = fade.resize((W, H))
    img = Image.composite(Image.new("RGB", (W, H), PAPER), img, fade)
    d = ImageDraw.Draw(img)
    x = 64
    d.text((x, 56), words["brand"], font=face(34, 800, 125), fill=INK)
    # the name as large as fits before the scene starts
    size = 92
    while size > 48 and d.textlength(page["name"], font=face(size, 800, 125)) > TEXT_W:
        size -= 4
    title = face(size, 800, 125)
    d.text((x, 250), page["name"], font=title, fill=INK, anchor="ls")
    line = face(32, 500)
    y = 310
    for l in wrap(d, page["line"], line, TEXT_W)[:3]:
        d.text((x, y), l, font=line, fill=INK)
        y += 44
    d.rectangle((x, H - 70, x + 40, H - 66), fill=ACCENT)
    # flat art: a palette keeps every image near 100 KB
    img.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(out, optimize=True)
    print("OG", os.path.relpath(out, ROOT))


for locale, words in data["words"].items():
    card(words, words["home"], data["scenes"]["warehouse"], f"{OUT}/{locale}-home.png")
    for vid, page in words["verticals"].items():
        card(words, page, data["scenes"][vid], f"{OUT}/{locale}-{vid}.png")
