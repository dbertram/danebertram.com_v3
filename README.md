# danebertram.com

Backing repo for my personal website https://danebertram.com

## Site Structure

This repo intentionally stays close to Eleventy's default directory conventions:

- `_data/` holds global data files used by templates
- `_includes/` holds layouts, include partials, and inline SVG icons
- `index.njk` is the site's homepage template
- `public/` holds static files that should keep stable URLs, like `favicon.ico`
- `assets/` holds build-managed styles and images
- `src/shared/` holds JavaScript shared between Eleventy config and client-side code

### Eleventy vs `@11ty/eleventy-plugin-vite`

Eleventy is responsible for:

- loading data from `_data/`
- resolving layouts and includes from `_includes/`
- rendering `index.njk` to `_site/index.html`
- copying `assets/` through via `addPassthroughCopy()`
- registering custom shortcodes and filters in `eleventy.config.mjs`

`@11ty/eleventy-plugin-vite` is responsible for:

- running as middleware during local development
- post-processing the generated HTML after Eleventy builds
- compiling SCSS into CSS
- following asset references from CSS and emitting optimized, fingerprinted production assets
- copying files from `public/` using Vite's default public directory behavior

### Asset Placement

If a file needs a stable URL (e.g., `favicon.ico`), put it in `public/`.
If a file is referenced by CSS or JS and should be fingerprinted, put it in `assets/`.

## Local Development

1. Clone the repo
1. Install [`asdf`](https://asdf-vm.com/guide/getting-started.html) if you haven't already
1. Setup Node:
   ```bash
   asdf install
   ```
1. Install dependencies:
   ```bash
   npm install
   ```
1. Start the local dev server:
   ```bash
   npm run dev
   ```
1. Open the dev site in your browser: http://localhost:8080

### Useful commands:

- `npm run build` to generate the production site in `_site/` using Eleventy plus the Vite post-processing step
- `npm run lint:fix` to run lint checks & auto-fix what can be (uses `oxlint`)
- `npm run format` to format everything (uses `oxfmt`)

### Deployment:

This repo has been connected to Netlify and will automatically deploy the main site whenever something is pushed or merged into `main`.

PR's will run basic checks (lint check, format check, tests) via a GitHub workflow.
