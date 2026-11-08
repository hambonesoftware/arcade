# Hambone Arcade

**[Play the arcade](https://hambonesoftware.github.io/arcade/)** — a mobile-friendly launcher for the browser-playable games and worlds by [Hambone Software](https://github.com/hambonesoftware).

Only games with published browser entry points are listed. Developer tools, music and photo apps, native-only projects, and source-only repositories are not shown. Source code remains in its existing repositories.

## Games

| Game | Direct play URL |
| --- | --- |
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

Garage Gauntlet is a Unity WebGL export from the garage-gauntlet repository's gh-pages branch, not from its main source branch. Barrack's GitHub Pages workflow publishes the web/ subfolder at the site root. The featured Marble Merge card opens the newer v2 build rather than the older root version.

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
