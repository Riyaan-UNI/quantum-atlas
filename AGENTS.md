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
- The Art page leads with a user-controlled slideshow, then shows every supplied lecture-linked concept-art variation grouped under its lecture topic, followed by Qubi's six reference-sheet emotions. Do not auto-advance; label “Dizzy” as playful character art, not a depiction of superposition.
- Show each concept artwork's source lecture, science caption and metaphor boundary, visible “AI-generated with Google NanoBanana Pro” credit, and expandable complete prompt (shared visual direction plus topic prompt). Provide a copy-prompt control. The project team supplied 22 images: two visual variations for each of 11 lecture topics.
- The team still needs to review each generated image for scientific fit, accidental artifacts, and whether its mapping reads clearly to non-specialists; the interface must not imply the art is a scientific diagram.
- After a visitor marks a topic as explored, offer a direct button to the next topic in course order. The last topic returns to the Atlas; no content is locked.
- Credit the four members using the names and contribution record supplied by the user and carried forward from the previous prototype. Label those roles as the prior record so the team can revise them if their responsibilities change.
- Markus's contribution is video speaker only. Show contributions through the project artifacts they relate to, with concise role labels; do not present Markus as a scriptwriter.
- Qubi should react at meaningful moments across the site using the supplied expression sheet, with subtle idle/reaction motion and reduced-motion support. Keep the 3D Qubi render on the home page and let topic interactions change Qubi's expression.
- Quantum concept art should make the lecture phenomenon—not Qubi or generic retro hardware—the focal point. Qubi is optional and is kept separate in the character-emotion gallery. Use Image 4 from the supplied sample set only as a composition reference; reject pseudo-text and quantum-like decoration without a defined science mapping.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
