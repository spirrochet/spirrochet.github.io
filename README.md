# spirrochet.github.io

Personal portfolio site for Christopher James Kites, published at
<https://spirrochet.github.io>. It holds engineering case studies of building
with AI coding agents, told twice: a plain-language track and a technical one.

Built with [Astro](https://astro.build) as a fully static site, tested with
[Playwright](https://playwright.dev), deployed to GitHub Pages by GitHub
Actions.

## Develop In The Dev Container

The toolchain is declared in `.devcontainer/devcontainer.json`: Node.js 24, the
version the workflow uses, with the Astro and Playwright extensions.

1. Install a container runtime and VS Code's **Dev Containers** extension.
2. Open this folder and run **Dev Containers: Reopen in Container**. The first
   start runs `npm ci` and installs the test browser.
3. In the container's terminal:

   ```bash
   npm run dev     # http://localhost:4321, forwarded to the host
   npm run build   # writes dist/
   npm test        # builds, serves, and runs the Playwright tests
   ```

npm's cache and the test browser live inside the container, not in your home
directory on the host.

## Develop Without The Container

Requires Node.js 22.12 or later, even-numbered releases only; 24 matches CI.

```bash
npm ci
npx playwright install chromium   # once, for the tests
npm run dev
```

No environment variables or secrets are needed, so there is no `.env.example`.
To turn off Astro's anonymous telemetry locally, set
`ASTRO_TELEMETRY_DISABLED=1`; the workflow and the container set it.

## Validate

```bash
npm run build
npm test
```

`npm test` runs on a desktop and a phone-sized browser. It crawls every page
from the home page and checks each one loads, is described, states the
licences, and has a track switch that lands on the other track. It also checks
the 404 page, the link-preview tags and image, the favicon, the switch itself,
the timelines, and that no sentence runs into the next. A portability scan
reads the built HTML for anything that must not be published.

Only one `astro preview` server may run per project: stop any you started before
running the tests.

## Layout

```text
.devcontainer/devcontainer.json     the development container
.github/workflows/deploy.yml        build and test on pull request; build, test, deploy on main
.github/dependabot.yml              weekly updates for actions and npm, 3-day cooldown
src/content.config.ts               the case-study and story collections, with schemas
src/content/case-studies/           technical track: one Markdown file per case study
src/content/stories/                plain track: one Markdown file per story
src/data/timeline.ts                the experiment's milestones, curated by hand
src/lib/siteHistory.ts              the site's own timeline, read from git at build time
src/layouts/Base.astro              page shell, both themes, the track switch, preview tags
src/pages/                          routes; /technical/ is the technical track's home
scripts/og-card.html                the social preview card; npm run og renders it
tests/                              Playwright tests
```

## Two Tracks

Every page declares a track, `plain` or `technical`, and where its switch goes.
A page with a twin on the other track switches to it. A page without one
switches to the section of the other track its content belongs to, rather
than to a page written only to be switched to.

To add a case study, add a Markdown file under `src/content/case-studies/`, and
its plain telling under `src/content/stories/` with `caseStudy` naming it.
Both lists and the switch pick them up; the tests check the result.

## Repository Settings

Chosen and recorded here, so they are not only in GitHub's settings pages.

- **Merges:** merge commits only; squash and rebase merging off. GitHub signs
  its own merge commits, so the main line stays verifiably signed; rebase
  merging would drop the signatures. Head branches are deleted after merge.
- **Rules on `main`:** signed commits, a pull request, and the `build` and
  `test` checks passing.
- **Actions:** GitHub's own actions plus `withastro/action` only, each pinned
  to a full commit SHA with its release in a comment.

## Publishing Rule

Nothing is published unless it passes the portability test: still true and
useful with every proper noun removed. No host names, work item keys, account
identifiers, cost figures, or third-party detail. The test suite scans the
built output for the mechanical part of that rule.

## Licence

- **Code** (everything that builds and tests the site) is under the MIT
  licence in `LICENSE`.
- **Writing and images** (the case studies, stories, page text, timelines, and
  the preview image) are © 2026 Christopher James Kites, all rights reserved.
  They are not covered by the MIT licence.
