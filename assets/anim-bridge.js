/*
 * anim-bridge.js
 * Injected into every Adobe Animate (CreateJS) export in /animations.
 * Lets the site's player page control the animation through postMessage
 * (works from file:// as well as from a web server).
 *
 * Works with two kinds of animation:
 *   - Adobe Animate / CreateJS exports (uses the global `stage` and `createjs`)
 *   - hand-built animations that define  window.AnimAPI = { width, height,
 *     pause(), play(), setSpeed(s) }  (e.g. the SVG animations like plan-23)
 *
 * Messages in  (from player):  { target: 'anim-bridge', cmd: 'pause' | 'play' | 'toggle' | 'speed' | 'restart', value }
 * Messages out (to player):    { source: 'anim-bridge', type: 'ready' | 'state' | 'key', ... }
 */
(function () {
  var baseFps = 30;
  var speed = 1;
  var paused = false;

  function post(msg) {
    if (window.parent === window) return;
    msg.source = 'anim-bridge';
    try { window.parent.postMessage(msg, '*'); } catch (e) { /* ignore */ }
  }

  function props() {
    try {
      var comps = window.AdobeAn && AdobeAn.compositions;
      for (var id in comps) return comps[id].getLibrary().properties;
    } catch (e) { /* ignore */ }
    return null;
  }

  function sendState() {
    post({ type: 'state', paused: paused, speed: speed });
  }

  function setPaused(p) {
    paused = !!p;
    if (window.AnimAPI) { paused ? AnimAPI.pause() : AnimAPI.play(); sendState(); return; }
    if (!window.stage) return;
    // Stage keeps redrawing (hover still works) but timelines stop advancing.
    stage.tickEnabled = !paused;
    sendState();
  }

  function setSpeed(s) {
    s = Math.max(0.1, Math.min(4, Number(s) || 1));
    speed = s;
    if (window.AnimAPI) { AnimAPI.setSpeed(s); sendState(); return; }
    createjs.Ticker.framerate = baseFps * speed;
    sendState();
  }

  function ready() {
    if (window.AnimAPI) {
      document.addEventListener('mousedown', function () { if (paused) setPaused(false); }, true);
      post({ type: 'ready', width: AnimAPI.width, height: AnimAPI.height });
      sendState();
      return;
    }
    if (!window.stage || !window.createjs) return setTimeout(ready, 50);
    var p = props() || {};
    baseFps = p.fps || createjs.Ticker.framerate || 30;
    // Clicking inside the animation while paused resumes it, so the
    // animation's own buttons never seem "dead".
    var c = document.getElementById('canvas');
    if (c) c.addEventListener('mousedown', function () { if (paused) setPaused(false); }, true);
    post({ type: 'ready', width: p.width, height: p.height, fps: baseFps });
    sendState();
  }

  window.addEventListener('load', function () { setTimeout(ready, 0); });

  window.addEventListener('message', function (e) {
    var d = e.data || {};
    if (d.target !== 'anim-bridge') return;
    switch (d.cmd) {
      case 'pause': setPaused(true); break;
      case 'play': setPaused(false); break;
      case 'toggle': setPaused(!paused); break;
      case 'speed': setSpeed(d.value); break;
      case 'restart': location.reload(); break;
    }
  });

  // Forward keyboard shortcuts to the player when the iframe has focus.
  window.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var k = e.key;
    if (k === ' ' || k === 'f' || k === 'F' || k === 'r' || k === 'R' || k === '[' || k === ']' || k === 'Escape') {
      e.preventDefault();
      post({ type: 'key', key: k });
    }
  });
})();
