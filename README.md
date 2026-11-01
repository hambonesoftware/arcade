# Hambone Arcade

**Hambone Arcade** is the playful landing page for games and creative experiments by [Hambone Software](https://github.com/hambonesoftware).

## What's here

- Responsive custom-illustrated homepage; no framework or build tooling needed.
- Curated cards for real GitHub repositories, with Arcade, Physics, Worlds, Creative, and Workbench filters.
- Project search (press / to focus), local favorites, and a random playable game button.
- Optional embedded browser previews and full-window launch links.
- Source-only projects explicitly labeled so they are not mistaken for playable browser games.
- Accessibility features including semantic headings, keyboard navigation, reduced motion, and an accessible dialog.

## Files

- index.html — page content and inline arcade machine SVG artwork
- styles.css — responsive styling and animations
- app.js — curated catalog and all interactive behavior
- favicon.svg — arcade controller icon
- .github/workflows/pages.yml — GitHub Actions deployment to Pages

## Publish with GitHub Pages

At the time of creation this repository was **private**. GitHub Pages for private repositories can require an eligible paid GitHub plan. If your plan does not support private repo Pages, first make the repository public or host it using a platform supporting private source repositories.

1. Open [Settings → Pages](https://github.com/hambonesoftware/arcade/settings/pages).
2. Under Build and deployment, choose **GitHub Actions** as the source.
3. Check the [Deploy Hambone Arcade workflow](https://github.com/hambonesoftware/arcade/actions/workflows/pages.yml). If needed, choose Run workflow.
4. After deployment succeeds, the expected web address is https://hambonesoftware.github.io/arcade/.

Note: A committed workflow alone does not guarantee that Pages is enabled or the website is live. Verify the workflow result and visit the address.

## Add a project

Open app.js and edit the PROJECTS array. Each item includes the actual repository name, category, title, description, emoji, colors, and a boolean playable flag.

- playable: true — links to https://hambonesoftware.github.io/REPO_NAME/ (the repository must actually have a functional GitHub Pages website).
- playable: false — links to https://github.com/hambonesoftware/REPO_NAME and is marked Source.

The list is curated rather than automatically showing every repo, preventing private or unpublished projects from appearing as broken game links.

## Test locally

Run `python3 -m http.server 8000` in the repository root, then visit http://localhost:8000/.

## Important notes

- Previews use an iframe; some projects may prohibit embedding. The Open game link is always available.
- Favorites are saved locally to browser storage and do not sync between devices.
- Projects keep their independent source repositories and deployment workflows.
- The card art is illustrative CSS/SVG/emoji artwork, not actual screenshots of the games.
