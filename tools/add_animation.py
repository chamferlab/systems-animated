#!/usr/bin/env python3
"""
Add (or update) an Adobe Animate HTML5 Canvas export in the Seal Systems library.

What it does
  1. Copies the export into  animations/<id>.html
  2. Patches it so it
       - loads CreateJS from assets/vendor (works offline),
       - loads assets/anim-bridge.js (play / pause / speed / restart from the player),
       - scales UP as well as down to fill the player.
  3. Takes a thumbnail with headless Firefox (thumbs/<id>.png)   [skip with --no-thumb]
  4. Adds an entry to assets/catalog.js if the id is new          [skip with --no-catalog]

Examples
  python3 tools/add_animation.py ~/Desktop/Plan52.html --id plan-52 \
      --title "Plan 52" --category api682 --summary "Unpressurized buffer fluid reservoir."

  # re-patch an existing animation after re-exporting from Animate (catalog entry kept):
  python3 tools/add_animation.py ~/Desktop/Plan53A_Final.html --id plan-53a

  # only refresh a thumbnail:
  python3 tools/add_animation.py --thumb-only --id plan-53a --delay 4000
"""
import argparse
import datetime
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ANIM_DIR = os.path.join(ROOT, "animations")
THUMB_DIR = os.path.join(ROOT, "thumbs")
CATALOG = os.path.join(ROOT, "assets", "catalog.js")

CDN_RE = re.compile(r'<script src="https?://code\.createjs\.com/[^"]*createjs[^"]*\.js"></script>')
LOCAL_TAGS = ('<script src="../assets/vendor/createjs-1.0.0.min.js"></script>\n'
              '<script src="../assets/anim-bridge.js"></script>')
RESP_RE = re.compile(r"AdobeAn\.makeResponsive\(\s*(true|false)\s*,\s*'(\w+)'\s*,\s*(true|false)\s*,\s*(\d)\s*,")


def patch(html: str) -> str:
    if "anim-bridge.js" not in html:
        html, n = CDN_RE.subn(LOCAL_TAGS, html, count=1)
        if n == 0:
            # No CDN tag found: insert before the first inline <script>.
            html = html.replace("<script>", LOCAL_TAGS + "\n<script>", 1)
    # responsive: fit both dimensions, allow scaling up
    html = RESP_RE.sub("AdobeAn.makeResponsive(true,'both',true,1,", html, count=1)
    return html


# Optional: click the canvas once (e.g. a "Click to Start" screen) before the shot.
CLICK_JS = """<script>
setTimeout(function () {
  var w = document.querySelector('iframe').contentWindow, c = w.document.getElementById('canvas');
  var r = c.getBoundingClientRect(), x = r.left + r.width * %f, y = r.top + r.height * %f;
  ['mousedown', 'mouseup', 'click'].forEach(function (t) {
    var t2 = t === 'mouseup' ? w : c;
    t2.dispatchEvent(new w.MouseEvent(t, {bubbles: true, clientX: x, clientY: y, button: 0}));
  });
}, 1000);
</script>"""


def thumbnail(anim_id: str, delay_ms: int, click=None) -> None:
    """Screenshot the animation with headless Firefox.

    Firefox takes its screenshot on the page "load" event, before CreateJS has drawn
    anything. So we serve the project over a throw-away local HTTP server and load the
    animation inside a wrapper page that also requests a deliberately slow image -
    the load event (and therefore the screenshot) waits until the animation has played
    for `delay_ms`.
    """
    import http.server
    import threading
    import time
    import functools

    firefox = shutil.which("firefox")
    if not firefox:
        print("  ! firefox not found - skipping thumbnail")
        return
    os.makedirs(THUMB_DIR, exist_ok=True)
    out = os.path.join(THUMB_DIR, anim_id + ".png")
    gif = bytes.fromhex("47494638396101000100800000ffffff00000021f90401000000002c00000000010001000002024401003b")

    class Handler(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *args):
            pass

        def do_GET(self):
            if self.path.startswith("/__shot"):
                body = (f'<!doctype html><body style="margin:0;overflow:hidden">'
                        f'<iframe src="/animations/{anim_id}.html" style="border:0;width:100vw;height:100vh"></iframe>'
                        f'<img src="/__delay" style="position:absolute;width:1px;height:1px">'
                        + (CLICK_JS % (click[0], click[1]) if click else '')
                        + '</body>').encode()
                ctype = "text/html"
            elif self.path.startswith("/__delay"):
                time.sleep(delay_ms / 1000)
                body, ctype = gif, "image/gif"
            else:
                return super().do_GET()
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Handler, directory=ROOT))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    try:
        with tempfile.TemporaryDirectory() as profile:
            cmd = [firefox, "--headless", "--no-remote", "--profile", profile,
                   "--window-size=1600,900", "--screenshot", out,
                   f"http://127.0.0.1:{srv.server_address[1]}/__shot"]
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=180)
    finally:
        srv.shutdown()
    if os.path.exists(out):
        print(f"  thumbnail -> {os.path.relpath(out, ROOT)}")
    else:
        print("  ! thumbnail failed")


def load_catalog():
    with open(CATALOG) as f:
        text = f.read()
    m = re.search(r"/\*CATALOG-START\*/(.*)/\*CATALOG-END\*/", text, re.S)
    if not m:
        sys.exit("catalog.js is missing the /*CATALOG-START*/ ... /*CATALOG-END*/ markers")
    return text, m, json.loads(m.group(1))


def save_catalog(text, m, entries):
    body = json.dumps(entries, indent=2, ensure_ascii=False)
    with open(CATALOG, "w") as f:
        f.write(text[:m.start(1)] + "\n" + body + "\n" + text[m.end(1):])


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("source", nargs="?", help="Adobe Animate exported .html file")
    ap.add_argument("--id", required=True, help="short url-safe id, e.g. plan-53a")
    ap.add_argument("--title")
    ap.add_argument("--category", default="api682", help="category id from catalog.js (api682, dgs, ...)")
    ap.add_argument("--summary", default="")
    ap.add_argument("--tags", default="", help="comma separated")
    ap.add_argument("--delay", type=int, default=2500, help="ms to wait before thumbnail")
    ap.add_argument("--click", help="x,y fraction of the canvas to click before the thumbnail, e.g. 0.5,0.45")
    ap.add_argument("--no-thumb", action="store_true")
    ap.add_argument("--no-catalog", action="store_true")
    ap.add_argument("--thumb-only", action="store_true")
    a = ap.parse_args()

    if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", a.id):
        sys.exit("--id must be lowercase letters, digits and dashes")

    size = None
    if not a.thumb_only:
        if not a.source:
            sys.exit("source file required")
        with open(a.source, encoding="utf-8") as f:
            html = f.read()
        if "createjs" not in html:
            print("  ! warning: this does not look like an Adobe Animate canvas export")
        os.makedirs(ANIM_DIR, exist_ok=True)
        dest = os.path.join(ANIM_DIR, a.id + ".html")
        with open(dest, "w", encoding="utf-8") as f:
            f.write(patch(html))
        print(f"  animation -> {os.path.relpath(dest, ROOT)}")
        size = re.search(r"lib\.properties\s*=\s*\{[^}]*?width:\s*(\d+),\s*height:\s*(\d+)", html, re.S)

    if not a.no_thumb:
        click = tuple(float(v) for v in a.click.split(",")) if a.click else None
        thumbnail(a.id, a.delay, click)

    if a.thumb_only or a.no_catalog:
        return
    text, m, entries = load_catalog()
    if any(e["id"] == a.id for e in entries):
        print("  catalog entry already exists - left unchanged (edit assets/catalog.js to change text)")
        return
    entries.append({
        "id": a.id,
        "title": a.title or a.id,
        "subtitle": "",
        "category": a.category,
        "summary": a.summary,
        "description": [],
        "keyPoints": [],
        "howTo": "Use the buttons inside the animation to move between steps.",
        "width": int(size.group(1)) if size else 1920,
        "height": int(size.group(2)) if size else 1080,
        "tags": [t.strip() for t in a.tags.split(",") if t.strip()],
        "added": datetime.date.today().isoformat(),
    })
    save_catalog(text, m, entries)
    print("  catalog entry added to assets/catalog.js - fill in description / keyPoints there")


if __name__ == "__main__":
    main()
