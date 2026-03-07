# danebertram.com

Backing repo for my personal website https://danebertram.com

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

- `npm run build` to generate the production site in `_site/` (usses `eleventy`)
- `npm run lint:fix` to run lint checks & auto-fix what can be (uses `oxlint`)
- `npm run format` to format everything (uses `oxfmt`)

### Deployment:

This repo has been connected to Netlify and will automatically deploy the main site whenever something is pushed or merged into `main`.

PR's will run basic checks (lint check, format check, tests) via a GitHub workflow.
