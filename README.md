# Hambone Arcade

**[Play the arcade](https://hambonesoftware.github.io/arcade/)** — a mobile-friendly launcher for the browser-playable games and worlds by [Hambone Software](https://github.com/hambonesoftware).

Only games with published browser entry points are listed. Developer tools, music and photo apps, native-only projects, and source-only repositories are not shown. Source code remains in its existing repositories.

## Games

| Game | Direct play URL |
| --- | --- |
| Willowbend | https://hambonesoftware.github.io/willowbend/ |
| Trash Panda Heist | https://hambonesoftware.github.io/trash-panda-heist/ |
| Trash Rac: Back Alley Rumble | https://hambonesoftware.github.io/trash-rac-unity/ |
| Stony Creek Explorer: Unity | https://hambonesoftware.github.io/stony-creek-unity/ |
| Garage Gauntlet: Railway Rush | https://hambonesoftware.github.io/garage-gauntlet/ |
| Colony: First Light | https://hambonesoftware.github.io/arcade/simant/ |
| Maple Junction Loop | https://hambonesoftware.github.io/rcCars/maple-junction.html |
| Micro Mayhem: Backyard Blitz | https://hambonesoftware.github.io/rcCars/ |
| Micro Mayhem: Canyon Thunder | https://hambonesoftware.github.io/rcCars/canyon-circuit.html |
| HopShift | https://hambonesoftware.github.io/hopshift/course-concept.html |
| Marble Merge Grand Prix (v2) | https://hambonesoftware.github.io/marbleMerge/v2/ |
| Faces & Heels | https://hambonesoftware.github.io/faces-and-heels/ |
| Old School Football | https://hambonesoftware.github.io/old-school-football/ |
| Apeiron X | https://hambonesoftware.github.io/apeironX/ |
| Barrack+ (browser edition) | https://hambonesoftware.github.io/Barrack/ |
| SprayWorks: Clockwork Crew | https://hambonesoftware.github.io/sprayworks/ |
| Mechanical World: REDLINE | https://hambonesoftware.github.io/mechanicalWorld/ |
| REDLINE: Engineering Career | https://hambonesoftware.github.io/mechanicalWorld/career.html |
| Stony Creek Explorer | https://hambonesoftware.github.io/sunward/ |

The three Micro Mayhem/Maple Junction entries launch distinct playable courses within the same rcCars repository. Likewise, the two REDLINE entries point to separate playable modes in mechanicalWorld.

Garage Gauntlet, Trash Rac and Stony Creek Explorer: Unity are Unity WebGL exports from their repositories' gh-pages branches, not from their main source branches. Trash Panda Heist and Willowbend load three.js from a CDN when played directly; the Arcade build bundles each one (three.js included) into a single offline-main.js. Barrack's GitHub Pages workflow publishes the web/ subfolder at the site root. The featured Marble Merge card opens the newer v2 build rather than the older root version.

## Downloadable offline PWA game library

All 19 playable launch entries are built under the Arcade's own `/arcade/games/` path (or `/arcade/simant/` for Colony). They share **16 actual downloaded packages**. The three `rcCars` racing titles share one asset pack, and the two REDLINE modes share one. This avoids duplicate data and ensures games remain controlled by the Arcade service worker.

A separate generated `game-packages.json` contains every static file and a content-derived package version. The service worker `sw.js` provides:

- **Download**: fetch every file for that game package, including its HTML, code, models, textures and compressed Unity assets. The package is marked installed only when all transfers succeed.
- **Open**: use a same-origin local game route. Downloaded games load from Cache Storage even with Airplane Mode enabled; undownloaded games can still open online.
- **Update**: compare the installed version to the published hash. Download the replacement in a new cache, then delete the old cache *only after the new package has completed*. Game save data is not deleted.
- **Remove**: free cached game files without touching localStorage or IndexedDB.
- **Download all / Update all**: process each unique package only once, with progress shown on the cards.
- **Check updates**: request the newest published package catalog; the catalog is also checked when the app starts and reconnects to the internet.

The GitHub Pages build checks out every game repository, packages its working web build, includes its self-hosted library dependencies, publishes the entire collection as one same-origin Pages site, and executes a mobile-size Chromium offline install/update/remove regression test. The workflow also runs automatically once per day in UTC, so changes to games in other repositories appear as available updates after the next successful Arcade rebuild (or a manual workflow dispatch). A source repo update does not immediately change existing offline files.

**Important:** Browser-managed PWA storage is not an OS-level permanent installation. iOS can evict offline caches under storage pressure. The UI must allow re-downloading a package if it is evicted. If the collection has a temporary build or CDN failure, GitHub keeps the previous successful Pages deployment.

### Offline development and validation

`scripts/package_offline_games.py` collects the actual built files into `_site` and generates `_site/game-packages.json`. It is executed only after the workflow prepares Unity WebGL, locally hosted JS libraries, the physics WASM, REDLINE's Vite bundle, and Stony Creek geography files.

`tests/offline-browser.test.mjs` runs against the `_site` build on localhost with a mobile-sized Chromium viewport. It verifies real package caching, opening Colony offline, reloading the launcher offline, detecting a newer version, updating atomically, removing cached files and retaining local data.

## Community Hub (staged)

The Community feature lives at [Community](https://hambonesoftware.github.io/arcade/community/) once the new shell is published. Visitors can propose game ideas, support approved suggestions, vote in curated official polls without accounts, report inappropriate ideas, and view the build roadmap. The owner moderates suggestions and creates polls through a separate protected admin dashboard.

**Deployment status:** The Community frontend and API code are implemented in the repository, but active submissions and voting require an independently configured Cloudflare Worker, D1 database, Turnstile site key and secret, and Cloudflare Access for owner moderation. Until those are configured, the website intentionally displays a setup message rather than simulated vote counts. See [community-api/README.md](community-api/README.md) for the exact deployment steps and security requirements.

## Website features

- Responsive custom-illustrated homepage built with plain HTML, CSS, and JavaScript.
- Game categories: Racing, Arcade, Platformer, Strategy, Physics, Worlds.
- Search by game name, type, category, or description (press / on a keyboard).
- Favorites stored locally in the current browser only.
- Surprise Me opens a random browser game in a new tab.
- Optional iframe previews; games that cannot be embedded can still be opened with Play now.
- Reduced-motion support, keyboard navigation and accessible labels.

## Maintain the game catalog

The catalog is in the PROJECTS array in app.js. All entries must have playable: true and a working browser game entry point.

An entry's repo must match the exact case-sensitive GitHub repository name. The default URL is https://hambonesoftware.github.io/REPO/. For games at specific paths such as hopshift/course-concept.html, set the url property to the exact hosted entry point.

Do not add source-only repos, galleries, tools, or native Swift/Unity projects without a deployed browser game. A project with GitHub Pages enabled may still have a failed deployment; verify its own workflow.

## Tests and hosting

Run npm test to check the playable-only catalog, page interactions, Hambone PLAY HUD library, and current Colony: First Light simulation tests.

Run python3 -m http.server 8000 from the repository root to view the static site locally at http://localhost:8000/.

The .github/workflows/pages.yml workflow runs tests and publishes the site to GitHub Pages on pushes to main. GitHub Pages must be configured with Build and deployment → GitHub Actions.

The SimAnt old nest-renderer test was retired because it targeted nest.js, a file deliberately removed when Colony: First Light replaced the old sandbox. The new First Light tests remain enabled.

## Notes

- Game builds are hosted and maintained by their own repositories; editing an arcade card does not redeploy its game.
- Favorites do not synchronize between devices.
- Emoji/SVG/CSS card visuals are illustrative, not screenshots of live gameplay.
- Games that block iframe embedding must be opened in a full browser tab.

## App icon

The selected glossy neon arcade-cabinet icon is installed as the website favicon, 180-pixel Apple touch icon, and 192-/512-pixel PWA manifest icons. The image files are version-controlled directly in this repository. On iOS, open the arcade in Safari, tap Share → Add to Home Screen; if an existing shortcut still shows the previous icon, remove that shortcut and add it again.
