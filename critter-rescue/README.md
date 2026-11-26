# Critter Rescue — Woodland edition (2.0)
Original woodland rescue puzzle for Hambone Arcade. The existing deterministic tile/creature simulation is unchanged; the presentation is a new layered painterly Canvas renderer, with locally authored vector assets and seeded textures. No mandatory remote dependencies.

## Architecture
- engine.js: deterministic rescue simulation and four levels.
- assets.js: palettes, vector tool icons, articulated stylized critter drawing, natural props, burrows and seeded variation.
- renderer.js: cached terrain and background layers, particles, animated water, camera transformations, quality tiers.
- game.js: game view model, touch/mouse input, UI, progression, planning undo and synthesized interaction audio.
- styles.css / index.html: compact rescue HUD, tool dock, level map, settings and responsive layout.

## Controls
Plan before releasing the flock. Select a tool and tap or drag on terrain. Two-finger pinch/drag navigates; mouse wheel zooms, right-drag pans, Fit resets the view. Undo is available only before the first release. 1–6 select tools, Space toggles the simulation, R restarts, Z undoes planning. Best stars retain the original local-storage key.

## Art direction
Warm woodland greens, bark and parchment, rounded character silhouettes, original illustrated icons, textured soil, moss edges, layered forest silhouettes, soft contact shadows, varied coats, scarves, acorn hats and glowing burrows. Four palette variants distinguish the groves. Terrain visuals are kept aligned with physics. This is a stylized 2.5D illustration, not a true 3D mesh renderer; dynamic water, full creature rigging, authored music, additional levels and creature-led construction are still future work.

## Validation
npm test preserves the deterministic rescue tests and adds camera/asset checks. The Critter Rescue PR workflow runs real browser interaction tests at desktop, iPhone and iPad sizes and uploads screenshots. These emulated viewports do not substitute for real iOS Safari performance testing.
