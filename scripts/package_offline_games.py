#!/usr/bin/env python3
"""Stage the playable browser builds as same-origin Arcade game packages.

Source repositories remain independent. This script runs after the GitHub
Actions checkout/build steps, and emits a deterministic, versioned file catalog.
No source-only or development files are published.
"""
from __future__ import annotations

import hashlib
import json
import re
import shutil
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "_sources"
SITE = ROOT / "_site"
GAMES = SITE / "games"

FRONT_FILES = [
    "index.html", "app.js", "styles.css", "manifest.webmanifest",
    "sw.js", "offline-return.js", "favicon.png", "favicon.svg",
    "apple-touch-icon.png",
]
FRONT_DIRS = ["icons", "simant", "play"]
EXCLUDE_DIRS = {".git", ".github", "node_modules", "tests", "docs", "__pycache__", "test-results", "art_pipeline", "scripts", "tools", "Agents", "plan", "design"}
EXCLUDE_FILES = {".DS_Store", ".gitignore", ".nojekyll", "README.md", "package.json", "package-lock.json", "playwright.config.js", "pyproject.toml"}
EXCLUDE_SUFFIXES = {".md", ".py", ".ps1", ".bat", ".cmd", ".log", ".map", ".lock"}


def ignored(directory: str, filenames: list[str]) -> set[str]:
    ignored_names = set()
    for name in filenames:
        full = Path(directory) / name
        if full.is_dir() and name in EXCLUDE_DIRS:
            ignored_names.add(name)
        if full.is_file() and (name in EXCLUDE_FILES or full.suffix.lower() in EXCLUDE_SUFFIXES or name.endswith(".test.js") or name.endswith(".test.mjs")):
            ignored_names.add(name)
    return ignored_names


def copy_dir(source: Path, dest: Path, *, filter_dev: bool = True) -> None:
    if not source.is_dir():
        raise RuntimeError(f"Required game files missing: {source}")
    shutil.copytree(source, dest, dirs_exist_ok=True, ignore=ignored if filter_dev else None)


def git_version(source: Path) -> str:
    try:
        return subprocess.check_output(["git", "-C", str(source), "rev-parse", "--short=12", "HEAD"], text=True).strip()
    except Exception as exc:
        raise RuntimeError(f"Version for {source} unavailable") from exc


def rewrite_text(path: Path, before: str, after: str) -> None:
    text = path.read_text(encoding="utf-8")
    if before not in text:
        raise RuntimeError(f"Required rewrite target missing in {path}: {before[:100]}")
    path.write_text(text.replace(before, after), encoding="utf-8")


def package_garage() -> None:
    source = SOURCE / "garage-pages"
    dest = GAMES / "garage-gauntlet"
    dest.mkdir(parents=True)
    html = (source / "index.html").read_text(encoding="utf-8")
    (dest / "index.html").write_text(html, encoding="utf-8")
    targets = set(re.findall(r'Build/[A-Za-z0-9_.-]+', html))
    if len(targets) < 4:
        raise RuntimeError("Garage Gauntlet Unity index did not expose the four build files")
    for item in sorted(targets):
        parent = dest / item
        parent.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source / item, parent)
    for extra in ["maple-junction-map.svg"]:
        if (source / extra).is_file():
            shutil.copy2(source / extra, dest / extra)


def package_marbles() -> None:
    source = SOURCE / "marbleMerge"
    dest = GAMES / "marbleMerge"
    copy_dir(source / "v2", dest / "v2")
    copy_dir(source / "src", dest / "src")
    html = dest / "v2" / "index.html"
    text = html.read_text(encoding="utf-8")
    if not (dest / "v2" / "offline-main.js").is_file():
        raise RuntimeError("Bundled Marble Merge browser JS missing")
    text = re.sub(r'<script\s+type="importmap">[\s\S]*?</script>', "", text)
    if 'src="./main.js?v=geometry-14"' not in text:
        raise RuntimeError("Marble Merge entry point unexpectedly changed")
    text = text.replace('src="./main.js?v=geometry-14"', 'src="./offline-main.js"')
    html.write_text(text, encoding="utf-8")


def package_rc_cars() -> None:
    source = SOURCE / "rcCars"
    dest = GAMES / "rcCars"
    copy_dir(source, dest)
    # The hosted games used CDN imports. Bundle those dependencies in the same
    # origin so neither the PWA nor the games require a CDN while offline.
    vendor = dest / "vendor"
    if not (vendor / "three-0.164.1.module.js").is_file():
        raise RuntimeError("Locally vendored Three.js 0.164.1 missing")
    if not (vendor / "playcanvas.mjs").is_file():
        raise RuntimeError("Locally vendored PlayCanvas missing")
    three_remote = "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js"
    three_local = "./vendor/three-0.164.1.module.js"
    for script in dest.glob("*.js"):
        code = script.read_text(encoding="utf-8")
        if three_remote in code:
            script.write_text(code.replace(three_remote, three_local), encoding="utf-8")
    rewrite_text(dest / "maple-junction.html",
                 "https://cdn.jsdelivr.net/npm/playcanvas@2.23.3/+esm",
                 "./vendor/playcanvas.mjs")


def package_faces() -> None:
    source = SOURCE / "faces-and-heels"
    dest = GAMES / "faces-and-heels"
    copy_dir(source, dest)
    html = dest / "index.html"
    text = html.read_text(encoding="utf-8")
    # The Arcade controls game downloads centrally. Prevent an old nested
    # game SW from taking over the Arcade's explicitly versioned game scope.
    text = re.sub(r'<script>\s*if \(.serviceWorker. in navigator[\s\S]*?</script>', "", text)
    html.write_text(text, encoding="utf-8")


def package_mechanical_world() -> None:
    copy_dir(SOURCE / "mechanicalWorld" / "dist", GAMES / "mechanicalWorld", filter_dev=False)


def package_sunward() -> None:
    source = SOURCE / "sunward" / "public"
    for datafile in ["data/stony-creek-dem.json", "data/stony-creek-map.json"]:
        if not (source / datafile).is_file():
            raise RuntimeError(f"Stony Creek geography data missing: {datafile}")
    copy_dir(source, GAMES / "sunward")


def prepare() -> None:
    if SITE.exists():
        shutil.rmtree(SITE)
    SITE.mkdir()
    GAMES.mkdir()
    for filename in FRONT_FILES:
        shutil.copy2(ROOT / filename, SITE / filename)
    for dirname in FRONT_DIRS:
        copy_dir(ROOT / dirname, SITE / dirname, filter_dev=False)

    package_garage()
    package_rc_cars()
    copy_dir(SOURCE / "hopshift", GAMES / "hopshift")
    package_marbles()
    package_faces()
    copy_dir(SOURCE / "old-school-football", GAMES / "old-school-football")
    copy_dir(SOURCE / "apeironX", GAMES / "apeironX")
    copy_dir(SOURCE / "Barrack" / "web", GAMES / "Barrack")
    copy_dir(SOURCE / "sprayworks" / "public", GAMES / "sprayworks", filter_dev=False)
    package_mechanical_world()
    package_sunward()

    (SITE / ".nojekyll").write_text("", encoding="utf-8")


SPECS = {
    "garage": ("garage-pages", "games/garage-gauntlet/", "games/garage-gauntlet/index.html"),
    "rccars": ("rcCars", "games/rcCars/", "games/rcCars/index.html"),
    "hopshift": ("hopshift", "games/hopshift/", "games/hopshift/course-concept.html"),
    "marbles": ("marbleMerge", "games/marbleMerge/", "games/marbleMerge/v2/index.html"),
    "wrestling": ("faces-and-heels", "games/faces-and-heels/", "games/faces-and-heels/index.html"),
    "football": ("old-school-football", "games/old-school-football/", "games/old-school-football/index.html"),
    "apeiron": ("apeironX", "games/apeironX/", "games/apeironX/index.html"),
    "barrack": ("Barrack", "games/Barrack/", "games/Barrack/index.html"),
    "sprayworks": ("sprayworks", "games/sprayworks/", "games/sprayworks/index.html"),
    "redline": ("mechanicalWorld", "games/mechanicalWorld/", "games/mechanicalWorld/index.html"),
    "stony": ("sunward", "games/sunward/", "games/sunward/index.html"),
    "colony": (None, "simant/", "simant/index.html"),
}

GAME_ENTRIES = {
    "garagegauntlet": ("garage", "games/garage-gauntlet/index.html"),
    "colony": ("colony", "simant/index.html"),
    "maplejunction": ("rccars", "games/rcCars/maple-junction.html"),
    "microbackyard": ("rccars", "games/rcCars/index.html"),
    "microcanyon": ("rccars", "games/rcCars/canyon-circuit.html"),
    "hopshift": ("hopshift", "games/hopshift/course-concept.html"),
    "marblemerge": ("marbles", "games/marbleMerge/v2/index.html"),
    "facesandheels": ("wrestling", "games/faces-and-heels/index.html"),
    "football": ("football", "games/old-school-football/index.html"),
    "apeironx": ("apeiron", "games/apeironX/index.html"),
    "barrack": ("barrack", "games/Barrack/index.html"),
    "sprayworks": ("sprayworks", "games/sprayworks/index.html"),
    "mechanicalworld": ("redline", "games/mechanicalWorld/index.html"),
    "engineeringcareer": ("redline", "games/mechanicalWorld/career.html"),
    "stony": ("stony", "games/sunward/index.html"),
}


def create_catalog() -> None:
    packages = {}
    for package_id, (source_name, prefix, entry) in SPECS.items():
        base = SITE / prefix
        if not (SITE / entry).is_file():
            raise RuntimeError(f"Playable entry is missing for {package_id}: {entry}")
        paths = sorted(p for p in base.rglob("*") if p.is_file())
        relative = [p.relative_to(SITE).as_posix() for p in paths]
        if not relative:
            raise RuntimeError(f"No files for {package_id}")
        sha = hashlib.sha256()
        for path in paths:
            sha.update(path.relative_to(base).as_posix().encode())
            sha.update(hashlib.sha256(path.read_bytes()).digest())
        content_version = sha.hexdigest()[:16]
        packages[package_id] = {
            "version": content_version,
            "files": relative,
            "bytes": sum(p.stat().st_size for p in paths),
            "entries": [entry],
        }
        print(f"{package_id}: {len(paths)} files, {packages[package_id]['bytes']:,} bytes, v{content_version}")

    # These are distinct game launchers. Several titles deliberately share
    # the same offline package (RC racing and REDLINE engineering).
    games = {game: {"package": pkg, "entry": path}
             for game, (pkg, path) in GAME_ENTRIES.items()}
    if not all((SITE / value["entry"]).is_file() for value in games.values()):
        raise RuntimeError("One or more published game routes are missing")
    manifest = {
        "schema": 1,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "packages": packages,
        "games": games,
    }
    (SITE / "game-packages.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    total = sum(p["bytes"] for p in packages.values())
    print(f"TOTAL packaged game bytes: {total:,}")
    # GitHub Pages currently limits published sites to 1 GiB.
    if total > 980 * 1024 * 1024:
        raise RuntimeError("Offline arcade package exceeds the safe GitHub Pages size budget")


def add_game_return_navigation() -> None:
    # All local game routes must offer a way back in iOS standalone mode.
    # Remove old nested game service worker registrations; Arcade's root SW
    # remains the one authority for installed game versions.
    for game, (_, entry) in GAME_ENTRIES.items():
        entry_file = SITE / entry
        markup = entry_file.read_text(encoding="utf-8")
        if game == "colony":
            markup = re.sub(r"<script>if\\('serviceWorker' in navigator\\)[\\s\\S]*?</script>", "", markup)
        if 'src="/arcade/offline-return.js"' not in markup:
            if "</body>" not in markup:
                raise RuntimeError(f"Game is missing closing body tag: {entry}")
            markup = markup.replace("</body>", '<script defer src="/arcade/offline-return.js"></script>\n</body>')
        entry_file.write_text(markup, encoding="utf-8")


if __name__ == "__main__":
    prepare()
    add_game_return_navigation()
    create_catalog()
