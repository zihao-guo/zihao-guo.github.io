# Repository Guidelines

## Project Structure & Module Organization
All HTML entry points now reside in `pages/` (e.g., `pages/index.html`, `pages/project.html`, `pages/1_project_IFP.html`) and load shared assets from `src/`. Visual assets live under `src/images/`, shared styles/scripts/fonts under `utils/css/`, `utils/js/`, and `utils/webfonts/`, while downloadable files live in `src/doc/` (`src/doc/CV/CV_pdf/CV_Zihao_EN.pdf` is the résumé). Place any new media inside `src/images/` so relative paths stay predictable, and refresh `src/new_sitemap.xml` whenever a page is added, renamed, or retired to keep crawlers synced.

## Build, Test, and Development Commands
- `python3 -m http.server 4000` — serves the repository root; browse `http://localhost:4000` to verify navigation, animations, and downloads.
- `npx htmlhint "**/*.html"` — runs default HTMLHint rules to catch malformed tags or duplicate IDs before pushing.
- `npx prettier --write "utils/css/**/*.css" "utils/js/**/*.js"` — formats CSS and JS using the existing indentation so diffs stay clean; run it prior to large edits.

## Coding Style & Naming Conventions
HTML snippets use two-space indentation, while CSS (see `utils/css/main.css`) and JavaScript modules use three spaces. Prefer kebab-case filenames (`work-summary.html`, `project-card.js`) and BEM-inspired class names such as `.hero__avatar--large`. Shared tweaks belong in `utils/css/main.css` rather than per-page `<style>` blocks; scripts longer than a few lines should move into `utils/js/` modules. Comment intent, not mechanics, mirroring the existing table-of-contents banner.

## Testing Guidelines
There is no automated suite, so rely on visual walkthroughs. After running the local server, exercise every nav link in desktop and mobile breakpoints, confirm animations trigger, and download artifacts under `src/doc/`. Use `npx htmlhint` for regressions touching markup. Capture before/after screenshots whenever typography, spacing, or motion changes so reviewers can compare behavior.

## Commit & Pull Request Guidelines
Follow the pattern `:emoji:vX.Y.Z_scopeNote` (e.g., `:fire:v0.5.7_3SEP-25_updatedABOU`). Squash minor fixes before publishing, describe the visible change, and link any relevant issue. Pull requests should summarize intent, call out which HTML entry points changed, list manual test steps (URLs clicked, screen sizes tested), note whether downloads were reverified, and include updated screenshots or GIFs when UI shifts occur. Tag maintainers familiar with the touched area and wait for one approval before merging.
