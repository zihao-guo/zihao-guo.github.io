# Repository Guidelines

## Project Structure & Module Organization
The root hosts individually crafted HTML entry points (`index.html`, `work.html`, `about.html`, etc.) that share assets and partials rather than using a static-site generator. Visual assets live under `images/`, reusable fonts and vendor scripts under `webfonts/`, `css/`, and `js/`, while downloadable content such as the résumé PDF is nested in `doc/` (`doc/CV/CV_Zihao_Eric_GUO.pdf`). Keep net-new media inside `assets/` to stay consistent with existing relative paths, and update `new_sitemap.xml` whenever you introduce or retire a page so search crawlers stay aligned.

## Build, Test, and Development Commands
- `python3 -m http.server 4000` — serves the repository root locally; navigate to `http://localhost:4000` to preview navigation, animations, and external links.
- `npx htmlhint "**/*.html"` — optional HTML validation to catch malformed tags before pushing (HTMLHint is not configured here, so defaults apply).
- `npx prettier --write "css/**/*.css" "js/**/*.js"` — optional formatter that matches the three-space indentation style already in `css/main.css` and `js/`. Run it before large refactors to keep diffs reviewable.

## Coding Style & Naming Conventions
Match the existing three-space indentation for CSS and two-space indentation for HTML snippets inside the `.html` files. Favor kebab-case for file names (`work-summary.html`, `project-card.js`) and BEM-flavored class names when extending layouts (e.g., `.hero__avatar--large`). Inline script blocks belong in `js/` modules when growing beyond a few lines, and shared CSS adjustments belong next to `css/main.css` instead of per-page `<style>` tags. Comments should describe the intent of sections (see the table-of-contents banner in `css/main.css`) so future updates stay discoverable.

## Testing Guidelines
This site ships without automated unit tests, so lean on visual and link testing: open the local server in desktop and mobile breakpoints, click every nav transition, and verify downloadable artifacts in `doc/` still render. For regressions that touch interaction logic, run `npx htmlhint` and manually exercise the affected component. Record before/after screenshots whenever you change motion, spacing, or theme colors, and attach them to the pull request for reviewers.

## Commit & Pull Request Guidelines
Recent commits follow the pattern `:emoji:version_updateDescription` (see `git log` entries such as `:fire:v0.5.7_3SEP-25_updatedABOU`), so continue using expressive emoji prefixes, semantic version bumps, and concise scope notes. Squash small fixes before pushing, ensure commit messages describe the visible effect, and link to any GitHub issue in the body. Pull requests should outline the intent, enumerate page-level changes, list manual test steps (URLs clicked, screen sizes checked), and include updated screenshots or GIFs when UI changes occur. Tag reviewers familiar with the touched section (e.g., @owner for `doc/` or `research.html`) and wait for one approval before merging.
