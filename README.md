# Seal Systems Animation Library

A small static website that collects the Adobe Animate (HTML5 Canvas) animations of
API 682 piping plans and dry gas seal systems in one place.

## Open it

- **Just double-click** `index.html`. Everything works offline from `file://` (CreateJS is in `assets/vendor/`, nothing loads from the internet).
- Or serve it to colleagues: `scripts/run_app.sh --lan` (Windows: `scripts\run_app.bat --lan`), then open http://localhost:8053. To keep it running on a Windows machine, see [Host it on Windows](#host-it-on-windows-nssm-service).
- To publish it, copy the whole folder to any static host (GitHub Pages, Netlify, SharePoint document library, an internal web server…). There is no build step.

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
scripts/                serve.py, run_app.*, install_service.bat, update.bat (hosting)
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
- the responsive call is set to fit both directions **and scale up**, so the animation fills the player and full-screen instead of staying at its authored pixel size.

## Player shortcuts

`Space` pause/play · `[` / `]` slower/faster · `R` restart · `F` full screen · `I` notes panel

## Hand-built animations (no Adobe Animate)

`animations/plan-23.html` is built directly in SVG + JavaScript and is the template for
new animations. Everything is in that one file:

- **Wording**: the `PROCESS`, `COMPONENTS` and `CHAPTERS` blocks at the top of the `<script>` (chapter steps, (i) popups, illustrative temperatures).
- **Drawing**: the `<svg>` on a 1600 × 900 stage.
- **Deep link to a step** (handy for review): `animations/plan-23.html?ch=2&st=1` (chapter and step, counted from 0). Arrow keys step forward and back.

It works with the player through `window.AnimAPI` (see `assets/anim-bridge.js`).
To add one to the library, add its entry in `assets/catalog.js` and make a thumbnail with
`python3 tools/add_animation.py --thumb-only --id <id>`.

## Host it on Windows (NSSM service)

`scripts/serve.py` serves the site with Python alone (standard library, port **8053**). It only
hands out `index.html`, `view.html`, `assets/`, `animations/` and `thumbs/`; `originals/`,
`tools/`, `.git` and everything else return 404.

### One-time setup

1. Install [Python 3.8+](https://www.python.org/downloads/) (tick **Add python.exe to PATH**),
   [Git](https://git-scm.com/download/win) and [NSSM](https://nssm.cc/download)
   (copy `win64\nssm.exe` to a folder on the PATH, e.g. `C:\Windows\System32` or `C:\tools`).
2. Clone to a stable place, e.g. `git clone https://github.com/chamferlab/systems-animated.git C:\animations`.
   If the repo is private, Git Credential Manager asks you to sign in once; it remembers it for `update.bat`.
3. Optional quick check: `scripts\run_app.bat`, then open http://localhost:8053 (Ctrl+C to stop).
4. From an **administrator** Command Prompt:

   ```bat
   cd /d C:\animations
   scripts\install_service.bat                     rem service "SealAnimations" on port 8053
   scripts\install_service.bat MyServiceName 9000  rem other name / port
   ```

   It checks first (administrator, `nssm` on the PATH, Python 3.8+) and changes nothing if a
   check fails. Then it installs a service running `scripts\serve.py --lan --port 8053` with the
   full path of `python.exe`, set to **start automatically with Windows** (no login needed),
   logging to `logs\animations.log` (rotated at 1 MB), adds a firewall rule for the port
   (Domain and Private networks), and starts it. Run it again to change the port.

Colleagues then open `http://<COMPUTERNAME>:8053/`. On a managed work computer, running a
server usually needs IT's agreement.

### Update

Push changes from your dev machine, then on the Windows machine, from an administrator Command Prompt:

```bat
scripts\update.bat                  rem or: scripts\update.bat MyServiceName
```

It checks first (administrator, `nssm` and `git` on the PATH, the service exists, no files
edited on that machine), then stops the service, runs `git pull --ff-only`, lists the new
commits and starts it again. If the pull fails, the old version is started again; if the
service does not start, it prints how to go back (`git reset --hard <previous commit>`).
People get the new version when they reload the page (files are served with `Cache-Control: no-cache`).

### Handy commands

```bat
nssm status SealAnimations
nssm restart SealAnimations
nssm edit SealAnimations             rem GUI with all settings
nssm remove SealAnimations confirm   rem uninstall (stop it first)
```
