# Seal Systems Animation Library

A small static website that collects the Adobe Animate (HTML5 Canvas) animations of
API 682 piping plans and dry gas seal systems in one place.

## Open it

- **Just double-click `index.html`**. Everything works offline from `file://`
  (CreateJS is in `assets/vendor/`, nothing loads from the internet).
- Or serve the folder to share it on a network:
  `python3 -m http.server 8000` then open http://localhost:8000
- To publish it, copy the whole folder to any static host (GitHub Pages, Netlify,
  SharePoint document library, an internal web server…). There is no build step.

## Folder layout

```
index.html              library page (search, category filter, cards)
view.html               player page: view.html?id=plan-53b
assets/catalog.js       ALL TEXT: site title, categories, every animation's description
assets/site.css         styles (light + dark theme)
assets/site.js          shared helpers
assets/anim-bridge.js   injected into each animation: pause / speed / restart / keys
assets/vendor/          CreateJS 1.0.0 (local copy)
animations/<id>.html    patched Animate exports (one per animation)
thumbs/<id>.png         card thumbnails
originals/              your untouched original exports - keep as backup
tools/add_animation.py  adds or updates an animation
```

## Add a new animation

1. In Adobe Animate: *File → Publish* as **HTML5 Canvas** (a single `.html` file, as before).
2. Run:

   ```bash
   python3 tools/add_animation.py ~/Desktop/Plan52.html --id plan-52 \
       --title "Plan 52" --category api682 \
       --summary "Unpressurized buffer fluid reservoir for arrangement 2 seals."
   ```

   If the animation starts on a "Click to Start" screen, add `--click 0.5,0.45` so the
   thumbnail is taken after clicking the centre of the stage. `--delay 5000` waits longer.
3. Open `assets/catalog.js` and fill in the new entry's `subtitle`, `description`,
   `keyPoints`, `chapters` and `howTo`. The order of entries is the order on the site.

**Updating** an animation after re-exporting: run the same command with the same `--id`.
The file and thumbnail are replaced; the text in `catalog.js` is kept.

**New category** (e.g. "Single seals", "Seal failure modes"): add it to `CATEGORIES`
in `assets/catalog.js` and use its `id` with `--category`.

## What the tool changes in an export

Only three things - the animation itself is untouched:

- the CreateJS `<script>` points to the local copy instead of code.createjs.com,
- `anim-bridge.js` is added (player controls),
- the responsive call is set to fit both directions **and scale up**, so the animation
  fills the player and full-screen instead of staying at its authored pixel size.

## Player shortcuts

`Space` pause/play · `[` / `]` slower/faster · `R` restart · `F` full screen · `I` notes panel
