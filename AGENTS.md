# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

## User-approved design direction

- Build the selected first black-hole loading concept into a modern sci-fi game-based quantum learning website.
- The public title is `Quantum Atlas`; tagline: `Chart the unknown. Keep asking why.`
- Use the previous prototype's black-hole loading idea only as a motif; do not copy its page structure, old intro copy, old color system, or unrelated visuals.
- Keep loading skippable, brief, reduced-motion safe, silent by default, and tied to actual loading. Never fabricate a percent or hold the visitor after content is ready.
- Use `rem`/`em`, fluid layout sizing, and intrinsic `aspect-ratio` for responsive geometry. Avoid fixed-pixel page/card dimensions.
- Keep the interface language plain, the science source-grounded in CCST9077 lectures, and the core `Predict → Reveal → Explain` interaction optional and non-punitive.
- Do not use Figma or hand-drawn SVGs. Prefer real raster assets or an appropriate icon library; any future course artwork prompts should be credited accurately with the image-making tool used.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
