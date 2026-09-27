# spirrochet.github.io

Personal portfolio site for Christopher James Kites, published at
<https://spirrochet.github.io>. It holds engineering case studies, starting
with Agent Work Tracking.

Built with [Astro](https://astro.build) as a fully static site, deployed to
GitHub Pages by GitHub Actions.

## Install

Requires Node.js 22.12 or later; even-numbered releases only.

```bash
npm ci
```

No environment variables or secrets are needed, so there is no
`.env.example`.

## Run Locally

```bash
npm run dev
```

Serves the site at <http://localhost:4321> with live reload.

## Validate

```bash
npm run build
```

This is the smoke test. It must finish without errors and write
`dist/index.html`. The same build runs on every pull request, and a merge
to `main` builds and deploys.

To turn off Astro's anonymous telemetry for local builds, set
`ASTRO_TELEMETRY_DISABLED=1`. The workflow sets it.

## Layout

```text
.github/workflows/deploy.yml   build on pull request; build and deploy on main
astro.config.mjs               site URL; no base path, as a user site
src/layouts/Base.astro         shared page shell and styles
src/pages/index.astro          home page
src/pages/case-studies/        one Markdown file per case study
```

To add a case study, add a Markdown file under `src/pages/case-studies/`
with `layout`, `title`, and `description` frontmatter, copying the existing
one, and link it from `src/pages/index.astro`.

## Publishing Rule

Nothing is published unless it passes the portability test: still true and
useful with every proper noun removed. No host names, work item keys,
account identifiers, or third-party detail.
