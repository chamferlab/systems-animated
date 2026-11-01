/*
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE CONTENT — edit this file to change titles, descriptions and categories.
 *
 *  To add a new animation, the easy way:
 *      python3 tools/add_animation.py path/to/export.html --id plan-52 \
 *          --title "Plan 52" --category api682 --summary "One-line summary"
 *  then fill in the text fields of the new entry at the bottom of the list.
 *
 *  Entry fields
 *    id          file name in /animations (without .html) and thumbnail in /thumbs
 *    title       card + page title
 *    subtitle    short line under the title
 *    category    one of the ids in CATEGORIES below
 *    summary     one or two sentences for the card
 *    description paragraphs for the viewer side panel
 *    keyPoints   bullet list ("What to look for")
 *    chapters    sections reachable from the menu inside the animation
 *    howTo       how to interact with this animation
 *    width/height  stage size from Adobe Animate (keeps the right aspect ratio)
 *    tags        free words that the search box also matches
 *    status      optional: "draft" shows a "Work in progress" badge
 * ─────────────────────────────────────────────────────────────────────────────
 */
window.SITE = {
  title: "Seal Systems Animation Library",
  tagline: "Interactive animations of API 682 seal piping plans and dry gas seal systems."
};

window.CATEGORIES = [
  { id: "api682", name: "API 682 Piping Plans", blurb: "Barrier and buffer fluid systems for mechanical seals on pumps." },
  { id: "dgs", name: "Dry Gas Seals", blurb: "Gas seal support systems and components for compressors." }
];

window.CATALOG = /*CATALOG-START*/
[
  {
    "id": "plan-23",
    "title": "Plan 23",
    "subtitle": "Cooled closed loop with pumping ring",
    "category": "api682",
    "summary": "The pumping ring circulates seal chamber fluid through a seal cooler and back. Covers basic function, venting before start-up and loss of cooling.",
    "description": [
      "Plan 23 cools the fluid in the seal chamber in a closed loop. A pumping ring in the seal circulates it through a seal cooler and back to the seal chamber, while a throat bushing separates the seal chamber from the hot pump casing.",
      "Because only the small seal chamber volume is cooled, and not a continuous stream of pumped product as in Plan 21, the cooler duty is small and pump efficiency is not affected. It is typical for hot water services such as boiler feed water.",
      "This animation is built in SVG and JavaScript. Temperatures follow a simple model with illustrative values, and the fluid colour shows temperature."
    ],
    "keyPoints": [
      "The pumping ring has very little head: the loop needs low resistance and lines sloping up to the cooler.",
      "A loop that hasn't been vented won't circulate. Vent at the high point before start-up.",
      "The temperature difference across the cooler confirms circulation and heat removal.",
      "Watch the margin to boiling: lost cooling water or a fouled cooler lets the seal faces flash and run dry."
    ],
    "chapters": [
      "Overview",
      "Basic Function",
      "Venting",
      "Loss of Cooling"
    ],
    "howTo": "Use the Next / Back buttons (or the arrow keys) to step through, the menu on the right to switch chapters, and the (i) icons for component details.",
    "width": 1600,
    "height": 900,
    "tags": [
      "cooling",
      "seal cooler",
      "pumping ring",
      "throat bushing",
      "hot water",
      "boiler feed water",
      "venting",
      "closed loop",
      "Plan 21"
    ],
    "added": "2026-11-01"
  },
  {
    "id": "plan-53a",
    "title": "Plan 53A",
    "subtitle": "Pressurized reservoir, gas-blanketed barrier fluid",
    "category": "api682",
    "summary": "Dual pressurized seal with a barrier fluid reservoir pressurized directly by nitrogen. Circulation by the seal's pumping ring.",
    "description": [
      "Plan 53A supplies a dual pressurized (arrangement 3) seal with a clean barrier fluid from an external reservoir. The reservoir is pressurized by a regulated gas supply, normally nitrogen, so that the barrier pressure stays above the seal chamber pressure and any leakage across the inner seal goes from the barrier side into the process, not the other way round.",
      "The barrier fluid is circulated by an internal pumping ring in the seal: it leaves the seal warm, flows up to the reservoir and returns to the seal. Because the gas is in direct contact with the barrier fluid, gas absorption limits how high this plan can be pressurized."
    ],
    "keyPoints": [
      "Barrier pressure is set above seal chamber pressure (API 682 calls for a margin of at least 1.4 bar / 20 psi).",
      "Direct gas contact means gas can dissolve into the barrier fluid at high pressure - the main limitation of 53A.",
      "Reservoir level is the leakage indicator: a falling level means the seals are consuming barrier fluid.",
      "Watch the circulation direction and the temperature difference between the seal outlet and return lines."
    ],
    "chapters": [
      "Overview",
      "Basic Function",
      "Normal Refill"
    ],
    "howTo": "Click to start, then click the (i) icons to learn about each component. Use the menu on the right to switch chapters.",
    "width": 1600,
    "height": 800,
    "tags": [
      "barrier",
      "reservoir",
      "nitrogen",
      "arrangement 3",
      "dual pressurized"
    ]
  },
  {
    "id": "plan-53b",
    "title": "Plan 53B",
    "subtitle": "Bladder accumulator, closed barrier loop",
    "category": "api682",
    "summary": "Barrier fluid pressurized through a bladder accumulator, circulated by the pumping ring through a cooler. Covers normal operation, refill, failure modes and ambient effects.",
    "description": [
      "Plan 53B pressurizes the barrier fluid of a dual pressurized seal through a bladder accumulator. The nitrogen pre-charge is separated from the barrier fluid by the bladder, so there is no gas absorption and the plan can run at much higher pressures than Plan 53A.",
      "The barrier fluid circulates in a closed loop: the pumping ring drives it from the seal through an air- or water-cooled heat exchanger and back. As the seals consume barrier fluid the accumulator volume and pressure drop until a refill is required, typically with a hand pump or refill trolley.",
      "This interactive also shows what happens when a refill is missed, when the loop is not vented properly, and how ambient temperature changes the system pressure."
    ],
    "keyPoints": [
      "Pressure falls as barrier fluid is consumed - the pressure transmitter is the leakage indicator.",
      "The accumulator pressure also changes with temperature, which is why alarm set-points must account for ambient conditions.",
      "Venting the loop at commissioning is critical: trapped gas stops pumping-ring circulation and overheats the seal.",
      "The refill (hand pump / trolley) restores volume and pressure without opening the loop."
    ],
    "chapters": [
      "Overview",
      "Basic Function",
      "Normal Refill",
      "Trolley!",
      "Failure to Refill",
      "Failure to Vent",
      "Ambient Influence"
    ],
    "howTo": "Click to start, then click the (i) icons to learn about each component. Use the menu on the right to switch chapters.",
    "width": 1600,
    "height": 800,
    "tags": [
      "barrier",
      "accumulator",
      "bladder",
      "nitrogen",
      "cooler",
      "refill",
      "arrangement 3"
    ]
  },
  {
    "id": "plan-53b-sequence",
    "title": "Plan 53B Commissioning Sequence",
    "subtitle": "Bladder accumulator, step by step",
    "category": "api682",
    "summary": "The accumulator from delivery to operation: empty, nitrogen pre-charge, barrier fill and pressurization, with nitrogen and barrier pressures shown at each stage.",
    "description": [
      "A close-up of the Plan 53B bladder accumulator through the commissioning stages. It starts with the accumulator as supplied (no nitrogen, no barrier fluid), then shows how the bladder responds as it is pre-charged and as barrier fluid is pumped in.",
      "Each stage lists the nitrogen pre-charge pressure and the barrier pressure, so you can follow how the gas volume and fluid volume relate to the gauge readings."
    ],
    "keyPoints": [
      "Pre-charge is set with the barrier side empty - the bladder fills the shell.",
      "Pumping in barrier fluid compresses the bladder; the gauge pressure rises as the gas volume shrinks.",
      "The anti-extrusion valve at the bottom stops the bladder being pushed into the outlet."
    ],
    "chapters": [
      "Empty",
      "Pre-charge",
      "Fill",
      "Pressurized"
    ],
    "howTo": "Use the rewind, pause and play buttons at the bottom right of the animation to step through the stages.",
    "width": 1300,
    "height": 820,
    "tags": [
      "accumulator",
      "bladder",
      "pre-charge",
      "commissioning",
      "nitrogen"
    ]
  },
  {
    "id": "plan-53b-sizing",
    "title": "Plan 53B Sizing",
    "subtitle": "Pressure vs. liquid volume, alarm strategies",
    "category": "api682",
    "summary": "Builds the pressure / liquid-volume curve of a bladder accumulator and compares fixed and floating alarm strategies with fixed or variable refill.",
    "description": [
      "This animation builds the accumulator's pressure versus liquid volume curve step by step. Liquid volume is obtained by subtracting the nitrogen volume from the accumulator's total size, so the curve follows directly from the gas law applied to the pre-charge.",
      "It then compares alarm and refill strategies: a fixed alarm per API 682 with variable or fixed refill, a fixed alarm per FAEP, and a floating (temperature-compensated) alarm per API 682."
    ],
    "keyPoints": [
      "The pressure-volume curve is set by the nitrogen pre-charge and accumulator size.",
      "Ambient temperature shifts the whole curve - a fixed alarm can trip on a cold night or be missed on a hot day.",
      "A floating alarm follows temperature so the usable volume between refills stays consistent."
    ],
    "chapters": [
      "Fixed Alarm API 682 - Variable Refill",
      "Fixed Alarm API 682 - Fixed Refill",
      "Fixed Alarm FAEP - Variable Refill",
      "Fixed Alarm FAEP - Fixed Refill",
      "Floating Alarm API 682"
    ],
    "howTo": "Use the play and rewind buttons under the graph, and the menu on the right to pick a scenario.",
    "width": 1920,
    "height": 1080,
    "tags": [
      "accumulator",
      "sizing",
      "alarm",
      "temperature",
      "ambient",
      "refill"
    ]
  },
  {
    "id": "plan-53c",
    "title": "Plan 53C",
    "subtitle": "Piston accumulator, referenced to seal chamber",
    "category": "api682",
    "summary": "Barrier pressure generated by a differential-area piston accumulator that tracks seal chamber pressure, with cooler, circulation and level indication.",
    "description": [
      "Plan 53C pressurizes the barrier fluid with a piston accumulator. A reference line from the seal chamber acts on one side of a differential-area piston, so the barrier pressure follows the seal chamber pressure at a fixed ratio above it - no separate gas supply is needed.",
      "The barrier fluid is circulated through a cooler and back to the seal. The accumulator position (level) shows barrier fluid consumption, and the system is topped up with a hand pump."
    ],
    "keyPoints": [
      "Barrier pressure tracks seal chamber pressure automatically through the piston area ratio.",
      "The reference line (red) carries process pressure - it is a key element to understand.",
      "Accumulator level indicates barrier fluid consumption; the hand pump refills it.",
      "Look at the API 682 cooler chapter for how heat is removed from the loop."
    ],
    "chapters": [
      "Overview",
      "Basic Function",
      "API 682 Cooler"
    ],
    "howTo": "Click the (i) icons and magnifier icons for details. Use the menu on the right and the play button to move through chapters.",
    "width": 1920,
    "height": 1080,
    "tags": [
      "barrier",
      "piston accumulator",
      "reference line",
      "cooler",
      "arrangement 3"
    ]
  },
  {
    "id": "dgs-aux-system",
    "title": "Dry Gas Seal Auxiliary System",
    "subtitle": "Tandem dry gas seal with separation seal",
    "category": "dgs",
    "summary": "Gas flows in and out of a tandem dry gas seal: primary and secondary gas supply, primary and secondary vent, and separation gas supply.",
    "description": [
      "A cross-section of a tandem dry gas seal cartridge with its connections to the gas control system. Each chapter highlights one gas path, so you can see where it enters the seal, which faces it passes, and where it leaves.",
      "Primary seal gas keeps the process side clean; the primary vent carries most of the leakage to flare; the secondary gas and vent manage the outboard seal; separation gas protects the seal from bearing oil."
    ],
    "keyPoints": [
      "Primary seal gas is injected inboard of the primary seal so that unfiltered process gas cannot reach the seal faces.",
      "The primary vent is the main leakage path and the key monitoring point for seal health.",
      "Separation gas (usually nitrogen or air) is supplied to the separation seal to keep bearing oil away from the gas seal."
    ],
    "chapters": [
      "Overview",
      "Basic Function",
      "Primary Gas Supply",
      "Primary Vent",
      "Secondary Gas Supply",
      "Secondary Vent",
      "Separation Gas Supply"
    ],
    "howTo": "Click to start, then use the menu on the right to step through each gas path. Click the (i) icons for details.",
    "width": 1920,
    "height": 1082,
    "tags": [
      "dry gas seal",
      "DGS",
      "compressor",
      "tandem",
      "seal gas",
      "vent",
      "separation gas",
      "nitrogen"
    ]
  },
  {
    "id": "dgs-standstill-seal",
    "title": "Standstill Seal",
    "subtitle": "Activation and deactivation",
    "category": "dgs",
    "summary": "How a standstill seal is activated when the compressor stops and released before it starts again, with the control panel and pressure readings.",
    "description": [
      "A compressor with dry gas seals at both ends, connected to a standstill seal control panel. During normal running the standstill seal is not activated and the dry gas seals work as usual.",
      "The Activation chapter shows how the panel pressurizes the standstill seal so it closes around the shaft once the compressor stops; the Deactivation chapter shows it being released before the compressor is restarted. Gauges on both sides show the pressure at each step."
    ],
    "keyPoints": [
      "During normal operation the standstill seal is open and does not touch the shaft.",
      "Activation is pneumatic, controlled from the panel - watch the pressure gauges and indicator lamp.",
      "Deactivation must be confirmed before the compressor restarts."
    ],
    "chapters": [
      "Activation",
      "Deactivation"
    ],
    "howTo": "Use the Next button to advance and the Activation / Deactivation menu to switch phases. Click the (i) icons for details.",
    "width": 2226,
    "height": 1080,
    "tags": [
      "dry gas seal",
      "DGS",
      "compressor",
      "standstill",
      "control panel",
      "shutdown"
    ]
  }
]
/*CATALOG-END*/;
