# Colony — Ant World

An original mobile-first, browser-playable ant-colony strategy game, inspired by the *genre* of classic simulation games such as Maxis's **SimAnt** (1991). This is an independent homage, not a port or redistribution of the commercial game.

**Play:** https://hambonesoftware.github.io/arcade/simant/

**Source:** https://github.com/hambonesoftware/arcade/tree/main/simant

## Features

- Live black and red ant colonies with workers, soldiers, a queen, eggs, food collection and reproduction.
- RTS unit selection: tap any black ant, pick Scout/Workers/Soldiers/All groups, or drag a desktop marquee to select squads. Tap the field to issue formations and targeted commands.
- Select stances: **Forage**, **Rally**, **Attack**, or **Defend**. Controlled ants obey manual move, gather, attack and defensive orders while the remainder of the colony continues autonomous behavior.
- Watch free-roaming predators, pheromone scent trails and food stores in the surface simulation.
- Three views: interactive RTS surface, detailed living nest cross-section and a **3×3 backyard conquest map**.
- In the nest, workers and soldiers move through curved tunnels between the royal chamber, food store, egg nursery, soldier gallery, larvae/pupae room and waste chamber. The queen, eggs, stored food and guard ants are illustrated with original canvas artwork.
- Spend food to explicitly train workers (22) or soldiers (38), and invest in a larger nursery, expanded granary or fortified nest entrance.
- Conquer a patch by defeating the red queen, then select a neighboring frontier territory on the Backyard map.
- Responsive on iPhone, iPad and desktop; compact in-world mobile orders, tap-to-command, one-finger drag to pan, pinch to zoom, mouse marquee selection, mouse wheel, +/− zoom, minimap navigation and keyboard group shortcuts.
- Auto-saved **individual ant positions, health, targets, food patches, brood, predators, and colony campaign** in localStorage, plus optional offline install via service worker.
- Entirely self-contained HTML, JavaScript, CSS and original SVG artwork. No backend and no dependencies.

## How to play

1. Tap **Start your colony**, choose **Workers** on the RTS strip, and tap a green food pile to order the workers to harvest it.
2. Spend food to train additional workers or soldiers. New ants hatch from the queen's brood queue.
3. Choose **Nest** to inspect your living underground network and spend food on nursery, storage and defense upgrades. Tap any chamber for its name.
4. Select **Soldiers** on the RTS strip, choose **Attack**, and tap the red nest or enemy units. You can also select one ant by tapping it, box-select on desktop, or choose **All**.
5. When the red queen is defeated, select **Backyard** and tap a neighboring frontier tile. Conquer all nine patches to win.

**Touch:** tap an ant to select it; tap another location to issue an order. Drag a finger to pan; pinch to zoom. The RTS strip scrolls horizontally on narrow phones.

**Desktop:** left-click to select an ant and left-drag a box to select several. Right-click gives an order; right-drag pans. Click the minimap to reposition the camera. 1 selects workers, 2 soldiers, 3 the whole colony, and Escape clears selection.

Use **Guide** for control instructions and a Reset action. Use **Pause** to suspend the simulation. Speed cycles through 1×, 2×, 3×, and 0.5×.

## Tests

From the Arcade repository root, run `npm test`. The checks cover game and nest-renderer JavaScript syntax, the Colony first-launch, RTS unit orders, population training, upgrade persistence, touch-versus-mouse selection, detailed chamber hit-testing and portrait/landscape rendering, snapshot restoration and tap-versus-drag behavior (alongside the shared Arcade HUD tests).


## Publishing

This folder is published through the parent Arcade repository's GitHub Actions Pages workflow. The site is a static app, so GitHub Pages can host it without server-side infrastructure.

After changes to `game.js`, also bump the cache version in `sw.js` if you need to force an offline cache refresh on installed home-screen apps. The service worker currently uses network-first fetching for immediate updates whenever online.

## Copyright / attribution

The original **SimAnt: The Electronic Ant Colony** is associated with Maxis / Electronic Arts. All gameplay code, visual rendering, interface styling, text and the app icon in this folder are newly written. This work does not contain proprietary SimAnt sprites, music, source code, manual pages or packaged game files and is **not affiliated** with Maxis or Electronic Arts.

Made for Hambone Arcade.
