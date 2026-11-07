# Colony — Ant World

An original mobile-first, browser-playable ant-colony strategy game, inspired by the *genre* of classic simulation games such as Maxis's **SimAnt** (1991). This is an independent homage, not a port or redistribution of the commercial game.

**Play:** https://hambonesoftware.github.io/arcade/simant/

**Source:** https://github.com/hambonesoftware/arcade/tree/main/simant

## What's new — RTS and living nest

- **Select and command:** Tap individual black ants, select the scout, all workers, all soldiers, or all ants with the unit toolbar. Desktop players can marquee-select; Shift adds units to the current selection.
- **Squad orders:** Tap the surface to move, a food patch to gather, or a red army/nest to attack. The command banner, selection rings, health bars and destination flags make orders visible. Red ants still use autonomous AI.
- **Economy:** Recruit workers (22 food) and soldiers (38 food), with explicit incubation queues plus limited automatic worker production. Colony population and food storage are capped.
- **Nest upgrades:** Excavate the nursery (increased population capacity and faster worker incubation), enlarge the granary (increased food capacity) or fortify the nest entrance (reduced queen damage); each can be upgraded three times.
- **Detailed underground nest:** A new illustrated cross-section draws an entrance mound, layered soil, stones, roots, interconnected tunnels, royal chamber with queen and attendants, granary, nursery, larvae chamber, soldier gallery and refuse chamber. Moving ant traffic is derived from the living colony population.
- **Nest inspection:** Tap chambers for their name; pinch or use +/− to zoom, drag to pan, and use the center control to reset the view.
- **Campaign:** Fight the red queen across nine backyard patches. Pheromone trails, predators, brood and free-running workers continue to behave autonomously.
- **Save and installation:** Store actual ants, orders, brood, resources, upgrades, and campaign in localStorage. Install as a PWA, with the nest renderer cached for offline use.

## Controls

- **Mobile:** Use the selection toolbar under the world canvas. Tap an ant to select it; tap empty ground to order your selection. Pan the surface or nest by dragging, and pinch to zoom. The four field-order buttons sit on the surface but disappear in nest view so you can see the chambers.
- **Desktop:** Click an ant to select; left-drag a rectangle to select a squad; Shift-click or Shift-drag to extend selection. Right-click gives the current selection an order; right-drag pans. Mouse wheel zooms. Select groups with **1** (workers), **2** (soldiers), **3** (everyone); **Escape** clears selection.
- **Nest:** Select Nest, zoom in, and tap a named chamber. The scene is an animated sectional view of the colony, not an independently simulated second set of ants.
- **Backyard:** After a patch is secured, click/tap an adjacent frontier tile to continue the campaign.

## Tests

From the Arcade repository root, run `npm test`. The checks cover the shared HUD library as well as Colony startup, selection, RTS orders, troop recruitment, costed upgrades, saved-game restoration, touch gestures, chamber picking and rendering.

## Publishing

This folder is published through the parent Arcade repository's GitHub Actions Pages workflow. The site is a static app, so GitHub Pages can host it without server-side infrastructure.

After changes to `game.js`, also bump the cache version in `sw.js` if you need to force an offline cache refresh on installed home-screen apps. The service worker currently uses network-first fetching for immediate updates whenever online.

## Copyright / attribution

The original **SimAnt: The Electronic Ant Colony** is associated with Maxis / Electronic Arts. All gameplay code, visual rendering, interface styling, text and the app icon in this folder are newly written. This work does not contain proprietary SimAnt sprites, music, source code, manual pages or packaged game files and is **not affiliated** with Maxis or Electronic Arts.

Made for Hambone Arcade.
