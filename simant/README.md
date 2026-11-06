# Colony — Ant World

An original mobile-first, browser-playable ant-colony strategy game, inspired by the *genre* of classic simulation games such as Maxis's **SimAnt** (1991). This is an independent homage, not a port or redistribution of the commercial game.

**Play:** https://hambonesoftware.github.io/arcade/simant/

**Source:** https://github.com/hambonesoftware/arcade/tree/main/simant

## Features

- Live black and red ant colonies with workers, soldiers, a queen, eggs, food collection and reproduction.
- Direct your golden scout by tapping the map (or clicking). Your scout can gather food and attack.
- Select orders: **Forage**, **Rally**, **Attack**, or **Defend**.
- Watch free-roaming predators, pheromone scent trails and food stores in the surface simulation.
- Three views: interactive surface, animated nest cross-section, and a **3×3 backyard conquest map**.
- Conquer a patch by defeating the red queen, then select a neighboring frontier territory on the Backyard map.
- Responsive on iPhone, iPad and desktop; pinch to zoom, two-finger pan, mouse wheel, +/− zoom and keyboard movement.
- Auto-saved colony campaign in localStorage and optional offline install via service worker.
- Entirely self-contained HTML, JavaScript, CSS and original SVG artwork. No backend and no dependencies.

## How to play

1. Tap **Start your colony** and select **Surface**.
2. Tap a green food patch to send the golden scout there. Once it picks up food, it automatically heads back to the black nest. Meanwhile workers gather food independently.
3. When your colony is strong enough, switch to **Attack**. Your soldiers advance on the red nest; steer the scout there to help.
4. When the red queen is defeated, select **Backyard** and tap a nearby tile with an exclamation mark to move into the next territory.
5. Conquer all nine patches to win.

Use **Guide** for control instructions and a Reset action. Use **Pause** to suspend the simulation. Speed cycles through 1×, 2×, 3×, and 0.5×.

## Publishing

This folder is published through the parent Arcade repository's GitHub Actions Pages workflow. The site is a static app, so GitHub Pages can host it without server-side infrastructure.

After changes to `game.js`, also bump the cache version in `sw.js` if you need to force an offline cache refresh on installed home-screen apps. The service worker currently uses network-first fetching for immediate updates whenever online.

## Copyright / attribution

The original **SimAnt: The Electronic Ant Colony** is associated with Maxis / Electronic Arts. All gameplay code, visual rendering, interface styling, text and the app icon in this folder are newly written. This work does not contain proprietary SimAnt sprites, music, source code, manual pages or packaged game files and is **not affiliated** with Maxis or Electronic Arts.

Made for Hambone Arcade.
