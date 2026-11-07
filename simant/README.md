# COLONY — First Light

A complete, original ant-colony real-time strategy mission built for the browser and touch screens. Start with **four workers, one scout, one queen and 25 food**. Build the colony beneath an ordinary backyard, train defenders, survive a red-ant raid and capture the first enemy outpost.

This version **replaces the previous Ant World sandbox completely**. The old decorative nest module, scout-only victory system and nine-tile campaign have been removed. The new mission uses a new save schema and does **not** load the old sandbox save.

**Play:** https://hambonesoftware.github.io/arcade/simant/

**Source:** https://github.com/hambonesoftware/arcade/tree/main/simant

## Real gameplay

1. **Feed the first brood** — Deliver 45 food in the granary. Black workers physically travel to surface seed nodes, pick up food, cross the entrance, follow connected underground tunnels, and deliver it to the granary. Reward: two worker eggs and excavation unlocked.
2. **Room to grow** — Mark soil cells for excavation, then wait while workers follow existing tunnels and dig six new connected cells. Spend 45 food to construct the nursery. Reward: 50 food and soldier training.
3. **The contested border** — Hatch three soldiers and hold the glowing seed border for 18 seconds.
4. **Defend the queen** — Three red raiders advance through the surface entrance into the same underground tunnel network. Defend the queen for 45 seconds. Enemy ants and friendly soldiers can fight in either layer. Lose if the queen dies.
5. **Secure the patch** — Attack the enemy forward outpost until its health reaches zero; hold its ground for 16 seconds to win First Light.

Food is a limited resource, brood hatches after a delay, and the army exists as individual moving ants. Underground digging is persistent geometry, not a decorative animation.

The surface and nest are **two views of one simulation**, not two independent boards. Ants remain the same entities as they travel through the entrance.

## Controls

- **Touch:** Tap an ant or use Scout / Workers / Soldiers / All to select a group. Choose Move / Forage / Attack / Defend and tap a destination. Drag to pan; pinch to zoom. Select Nest and tap unexcavated soil to queue digs, or use *Mark nursery tunnel* to plan a six-cell route automatically.
- **Desktop:** Click an ant, use group buttons, and issue orders on the ground. Shift-drag draws a multiple-unit selection box; drag normally to pan, scroll to zoom.
- **Keyboard:** 1 Workers, 2 Soldiers, 3 All; N switches between surface and nest; Space pauses.
- **Production:** Recruit a worker for 18 food or a soldier for 30 food after the nursery is built. A nursery costs 45 food and six completed tunnel cells.
- **Camera:** Surface and underground have independent pan/zoom cameras. The top-right crosshair focuses the current objective.

The **top mission card** always tells you the next action, progress, and current goal. The game has a clear win screen, a defeat state, a restart button and an automatic local save.

## Implementation

- `firstlight.js` — Objective definitions, progress counters and mission state validation.
- `engine.js` — Entire simulation: ants, brood, gathering, shared portal, excavated tunnel graph and pathfinding, squad orders, recruitment, enemy raid, outpost battle and win/loss.
- `renderer.js` — Original procedural canvas artwork for surface terrain, ants, food caches, entrance mound, carved soil, brood, queen and enemy outpost.
- `game.js` — Camera, pointer events, mobile controls, UI, local saves and fixed-timestep simulation loop.
- `index.html` — Responsive iPhone, iPad and desktop interface.
- `sw.js` and `manifest.webmanifest` — Installable PWA and network-first offline cache.

No network requests, backend, account, third-party art or runtime library is needed for the game. Save format: `colony-firstlight-v2` in device-local storage.

## Testing and publishing

At the Arcade repository root run `npm test`. Automated tests cover the fresh start, real food hauling, underground corridor integrity, excavation, construction, squad commands, recruitment, complete five-stage victory path, queen defeat, save/restore and both render views.

The site's existing GitHub Actions Pages workflow runs `npm test` and, if successful, publishes the static repository at the Play URL above.

## Future direction

After First Light is solid, extend the design into a multi-territory campaign, with connected colonies, weather, predators, more strategic enemy AI and distinct mission types. See [GAME_DESIGN.md](GAME_DESIGN.md). **Those features are future plans, not present gameplay.**

## Independent work

This is an original game inspired by classic ant-colony simulations. *SimAnt: The Electronic Ant Colony* is associated with Maxis/Electronic Arts. No proprietary SimAnt artwork, audio, game files, manuals or code are used. This project is not affiliated with or endorsed by Maxis or Electronic Arts.

Made for Hambone Arcade.
