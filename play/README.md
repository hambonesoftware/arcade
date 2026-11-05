# Hambone PLAY — Reusable Game HUD Core

Hambone PLAY is a small, framework-free UI layer that can sit over Three.js, Canvas2D, WebGL and DOM games without taking ownership of gameplay state.

Version: **1.0.0**. Source of truth: \`hambonesoftware/arcade/play/v1\`.

## Four genre formats
- **Workbench:** contextual controls for mechanical and simulation games.
- **Broadcast:** narrow scorebug, event calls, race/sports metadata.
- **Arcade:** score, lives and state; minimal chrome.
- **Adventure:** sparse world-driven overlays.

The core handles actual viewport measurements, touch-sized action controls, a small event announcer, a compact/standard density setting, contextual tool trays and readout binding. Games provide their own colors and art direction through scoped CSS variables.

## Use inside a game

Copy the **versioned** files to your game repository under \`src/vendor/hambone-play/\` so gameplay has no network dependency on another site's current deployment. Updates should be deliberate and testable. The same API can be loaded from the Pages URL for experiments:

    import { createPlayHUD } from "./vendor/hambone-play/hambone-play.js";

    const hud = createPlayHUD({
      root: document.querySelector("#game"),
      viewport: document.querySelector("#viewport"),
      style: "workbench",
      title: "Lab 01",
      metrics: [
        { id: "force", label: "FORCE", value: "0 kN" },
        { id: "strain", label: "STRAIN", value: "0 με" }
      ]
    });
    hud.placeControl(document.querySelector("#test-button"));
    hud.setMetric("force", "12 kN");
    hud.setPhase("playing");
    hud.showEvent("FIRST YIELD", { tone: "warning", duration: 1600 });
    hud.setSafeFrameCallback((rect) => {
      // Reframe your camera around the genuinely free portion of the screen.
      // rect is relative to viewport in CSS pixels.
    });

## API
- \`setMetric(id,value)\` / \`bindReadout(dom,id,format?)\`
- \`setStatus(text,tone?)\`, \`showEvent(text,{tone,duration}?)\`
- \`setPhase(ready|editing|playing|paused|result)\`
- \`setDensity(standard|compact)\`
- \`placeControl(element,actions|utilities)\`, \`addAction({...})\`
- \`openTray({title,content:Node})\`, \`closeTray()\`
- \`registerOccluder(element)\`, \`getSafeRect()\`, \`setSafeFrameCallback(fn)\`
- \`destroy()\`

All new elements have \`hb-play\` CSS namespacing. A game can keep legacy IDs and event listeners when relocating controls with \`placeControl\`. Don't replace an existing working control with a lookalike button.

## Principles
1. Game first, UI second.
2. Don't display data that doesn't change a current decision.
3. Preserve existing input, simulation and score logic.
4. Keep accessible DOM buttons and readable text.
5. Adjust camera when context panels cover the scene.
6. Prefer intentional visual identities per game to one universal color palette.
7. Validate touch interaction in real browsers and representative viewport sizes.

## Local tests

    npm test

The \`calculateSafeRect\` helper is isolated so viewport math can be verified without a browser. This is the first shared HUD foundation; further game-specific experiments may expand it without breaking v1.
