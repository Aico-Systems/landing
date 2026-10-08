# landing

Mandy's public landing page: one live 3D scene per vertical (warehouse,
manufacturing, parcel, eCommerce, grocery, fashion, pharma, aviation), one
screen of scroll each, with the people in it asking Mandy as they work. A static SvelteKit
site, prerendered; Three.js for the scene, blueprint's tokens for every colour.

```bash
bun install
bun run dev        # http://localhost:5173
bun run build      # static site in build/
bun run check
```

## Layout

| Path | What |
| --- | --- |
| `src/lib/verticals.ts` | The verticals as data: scene file, size, people and machines with their routes and voices. No text |
| `src/lib/i18n/` | Every word on the site, one file per language (`en.ts`, `de.ts`), all typed by `types.ts`, the list of languages in `locales.ts` |
| `src/lib/stage/` | The 3D stage: `stage.ts` (renderer, isometric camera, drag to turn, switching scenes), `scene.ts` (loads a scene, restyles it, draws the outlines), `assemble.ts` (a scene building itself, and taking itself apart), `actors.ts` (the workers and forklifts, built in code: walk cycle, the press-the-glove gesture), `palette.ts` + `colours.json` (film material roles to blueprint tokens, shared with the Blender preview) |
| `src/routes/+page.svelte` | The page: the stage, the speech bubbles, the vertical's name and line |
| `src/hooks.server.ts` | Hands the list of languages to the detection script in `src/app.html` at build time |

## Languages

The site has no language switch. A script in the head of `src/app.html`
reads the browser's own language list (`navigator.languages`, which the
visitor sets in the browser or the system, region included) and takes the
first the site has, matching `de-AT` to `de`; otherwise English. The page
is built in English and stays hidden for the one frame the app takes to
switch to another language.

All text lives in `src/lib/i18n/`. `types.ts` defines one shape for every
language, so a missing or extra word in any language is a type error.

- A new language: add its code to `LOCALES` in `locales.ts`, copy `en.ts`
  to `<code>.ts` and translate it, and register it in `MESSAGES` in
  `index.svelte.ts`.
- A new page: add a group for it to `Messages` in `types.ts` (next to
  `home`) and fill it in every language.
- Names of other languages ("Asked in Romanian") come from
  `Intl.DisplayNames`, so they need no translating.
| `tools/blender/` | The scenes' source: Blender scripts that build, preview, render and export them (below) |
| `res/` | Confidential reference material (partner strategy decks): gitignored, never committed |
| `static/models/` | The exported scenes (`<vertical>.glb`) and nothing else |

## The scenes

Every scene is built in Blender from Python (Blender 5.2+):

```bash
# export for the page: static/models/<vertical>.glb
blender -b --factory-startup --python tools/blender/export.py -- warehouse
# check a scene headless, as the page frames it: span in metres, optional look-at x y
blender -b --factory-startup --python tools/blender/render.py -- warehouse out.png 50
blender -b --factory-startup --python tools/blender/render.py -- warehouse close.png 20 3 -4
```

In a running Blender (its Python console, or the Blender MCP),
`VERTICAL = "warehouse"; exec(open("tools/blender/preview.py").read())`
builds the scene into a scene of its own (`landing_<vertical>`) and frames the
viewport like the page.

A new vertical: a script in `tools/blender/scenes/` (copy one; the page lands
`hall_floor` and `lane_*` first, slides `hall_wall_x*` in from −x and
`hall_wall_y*` from behind, drops the rest in a wave along x, and anything
named `_load_` last), exported with `export.py`, plus its entry in
`src/lib/verticals.ts` (routes in the same metres, z = −Blender y) and its
words in each language in `src/lib/i18n/`.

- `tools/blender/scenes/<vertical>.py` builds one vertical into the `SCENE`
  collection, exported to `static/models/<vertical>.glb`. The people are not
  in it: the page builds them (`src/lib/stage/actors.ts`).
- `tools/blender/kit/` is the toolkit the scenes are made of: `common.py`
  (materials, boxes, capsules), `props.py` (hall shell, rack runs and the
  other props). It is forked from the Mandy film
  (Mandy_Marketing, `scripts/interlude`, commit 034c7b9) and owned here now.
- Materials keep the film's role names (`FLAT_paper`, `FLAT_ink`,
  `FLAT_orange`, …): the page maps each role to a blueprint token
  (`src/lib/stage/palette.ts`), so a scene carries no colours of its own.
- No downloaded models: everything is boxes and capsules. The film's
  forklift is a BlenderKit model licensed for renders, not for shipping as a
  3D file, so the page builds its own (`actors.ts`).
