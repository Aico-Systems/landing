"""Fetch the logos of the systems the vertical cards name, once, into
src/lib/logos/<id>.(svg|png). Run from the landing folder after adding a
system to src/lib/systems.ts; existing files are kept (delete one to
fetch it again).

python3 tools/logos/fetch.py

Sources, in order: the Simple Icons mark (CC0, coloured with its brand
hex), the Activepieces piece logo, the vendor's own site icon. Anything
smaller than 64 px is not a logo, and the page draws a lettered tile.
"""
import io, json, os, subprocess, sys, urllib.request
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(f"{HERE}/../..")
OUT = f"{ROOT}/src/lib/logos"
os.makedirs(OUT, exist_ok=True)
systems = json.loads(subprocess.check_output(["bun", f"{HERE}/systems.ts"], cwd=ROOT))


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (logo fetch for mandy landing)"})
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.read()


def save_png(data, path):
    im = Image.open(io.BytesIO(data)).convert("RGBA")
    if min(im.size) < 64:
        return False
    im.thumbnail((128, 128), Image.LANCZOS)
    im.save(path, optimize=True)
    return True


for sid, s in systems.items():
    if s.get("lettered"):
        for ext in ("svg", "png"):
            if os.path.exists(f"{OUT}/{sid}.{ext}"):
                os.remove(f"{OUT}/{sid}.{ext}")
        continue
    if any(os.path.exists(f"{OUT}/{sid}.{ext}") for ext in ("svg", "png")):
        continue
    got = None
    if s.get("svg"):
        with open(f"{OUT}/{sid}.svg", "w") as f:
            f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#{s["svg"]["hex"]}" d="{s["svg"]["path"]}"/></svg>')
        got = "simple-icons"
    sources = []
    if not got and s.get("piece"):
        sources.append(("activepieces", f"https://cdn.activepieces.com/pieces/{s['piece']}.png"))
    if not got:
        sources += [
            ("apple-touch-icon", f"https://{s['domain']}/apple-touch-icon.png"),
            ("site icon", f"https://www.google.com/s2/favicons?domain={s['domain']}&sz=256"),
        ]
    for label, url in sources:
        if got:
            break
        try:
            if save_png(get(url), f"{OUT}/{sid}.png"):
                got = label
        except Exception:
            pass
    print(f"{sid:16} {got or '— lettered tile'}")
