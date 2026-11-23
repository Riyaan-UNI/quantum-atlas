# Quantum Atlas

**Chart the unknown. Keep asking why.**

Quantum Atlas is a sci-fi, game-inspired learning website created for the CCST9077 final project. It introduces quantum information to non-specialists through short films, a visual course map, optional interactive activities, concept art, and the Qubi mascot.

## Project overview

The experience is designed around three ways in: **Watch**, **Explore**, and **View Art**. Visitors can follow a suggested learning route or move freely among the site's pages. Topic progress is a personal browsing aid saved in the current browser; it is not a score or a measure of mastery.

The Atlas contains eleven course topics arranged in five regions:

1. Information foundations
2. Quantum correlations
3. Quantum technologies
4. Interpretation and popular claims
5. Spacetime and information

The Episodes area links all four published videos. Episode 4, **The Un-Copyable Secret**, covers no-cloning and quantum cryptography. Episodes 1–3 include readable transcripts based on the original scripts; Episode 4 requests YouTube captions when available, but does not currently include a separate readable transcript. Short science notes accompany the films to clarify metaphors and qualify claims for first-time viewers.

The Art page presents the team's reviewed concept-art collection, with an automatic slideshow, a browsable image grid, full-size image viewing, prompts, and Qubi's expression sheet. The images are illustrative concept art, not scientific diagrams.

## Requirements

- Node.js 18, 20, or 22 and later, as supported by the installed Vite version
- npm, included with Node.js
- Visual Studio Code or another editor

## Run locally

1. Open the `QuantumAtlas` folder in Visual Studio Code.
2. Open **Terminal → New Terminal**.
3. Install the locked project dependencies and start the development server:

   ```powershell
   npm ci
   npm run dev
   ```

4. Open the local URL printed in the terminal, usually `http://localhost:5173/`.
5. Select **Enter the Atlas** to move through the brief black-hole opening and into the home page.

To stop the development server, focus its terminal and press **Ctrl+C**. The site honors reduced-motion preferences; the entry screen remains usable without its animation.

## Build and preview

Create a production build:

```powershell
npm run build
```

The build creates the client assets in `dist/client/` and prepares the Site deployment files in `dist/server/` and `dist/.openai/`. Preview the built site locally with:

```powershell
npm run preview
```

## Publish with GitHub Pages

The repository includes a GitHub Actions workflow that builds and deploys the site whenever a commit is pushed to `main`. It uses the repository path `/quantum-atlas/` so images, styles, scripts, and the favicon resolve correctly on a project Pages site.

To enable the first deployment, open the repository on GitHub, go to **Settings → Pages**, and set **Build and deployment → Source** to **GitHub Actions**. Then push to `main` or run **Deploy Quantum Atlas to GitHub Pages** from the repository's **Actions** tab. The published address is `https://riyaan-uni.github.io/quantum-atlas/` once the workflow succeeds.

The workflow publishes only `dist/client`. The separate Cloudflare Worker/Sites packaging output is not needed for GitHub Pages.

## Verification commands

Run the Sites packaging and Worker routing checks:

```powershell
npm run test:sites
```

Run the existing Bell simulation and story-state tests:

```powershell
node --test src/sim/bell.test.js src/story/state.test.js
```

## Technology

| Technology | Use |
|---|---|
| React 19 | User interface and component state |
| Vite 6 | Development server and production build |
| Motion for React | Page transitions, controls, and interaction animation |
| Anime.js | Selected celebration and story effects |
| Atkinson Hyperlegible and Space Grotesk | Interface and heading typography, loaded through Google Fonts |
| JavaScript, HTML, and CSS | Application behavior, structure, and styling |
| Cloudflare Worker static-asset adapter | Static asset delivery and client-route fallback for the Sites package |

The project does not currently include a ratings feature or a ratings API.

## Repository layout

```text
QuantumAtlas/
├── public/assets/          Images, icons, concept art, and story art
├── src/
│   ├── content/             Artwork metadata and episode transcripts
│   ├── sim/                 CHSH simulation and tests
│   ├── story/               Story scenes, state, and interactive experience
│   ├── App.jsx              Main pages, navigation, and shared interface
│   └── styles.css           Responsive styling and visual system
├── worker/index.js          Static asset and application-route fallback
├── scripts/                 Sites build preparation
├── tests/                   Sites and Worker checks
├── design-qa.md             Current visual/accessibility review record
└── README.md                Project documentation
```

Design decisions and the science/media review are maintained in the sibling `Design/` and `Reference/` folders in the team's project workspace; those course materials are not included in this website repository.

## Content maintenance

- **Episode links and topic summaries:** update the `videos` and `topics` data in `src/App.jsx`. The fourth video uses YouTube ID `Zwxx9Q6Vo10`.
- **Episode transcripts:** edit the supplied-script text files in `src/content/transcripts/`. The page presents those files as readable text; captions in the embedded YouTube player are requested when available.
- **Artwork:** update image metadata, prompts, descriptions, and tool attribution in `src/content/artworks.js`. Store the corresponding images under `public/assets/concept-art/`.
- **Story content:** update `src/story/scenes.js`; keep scene copy and state rules aligned.
- **Qubi:** use the supplied mascot assets and expression sheet in `public/assets/`.

The project team reviewed the supplied episode scripts and project materials. The episode pages present the scripts used in the original videos as transcripts and place concise science clarifications beside them rather than silently changing the spoken wording. The course lecture slides remain the primary source for the team's science review.

## Accessibility and visual review

The interface includes keyboard-visible focus, a compact navigation at smaller widths, reduced-motion support, responsive layouts, semantic controls, readable transcripts, and YouTube caption requests. The current status and remaining viewport checks are recorded in [`design-qa.md`](design-qa.md).

## Team and AI-use statement

This project was submitted by **Group 1** for CCST9077.

The reviewed contribution record is shown on the website's **Credits** page. Current-build additions are marked separately from the previous build's roles.

> ChatGPT supported research, design and story brainstorming, website coding and debugging, and language edits; Google NanoBanana Pro generated the concept-art images. The team chose the creative direction and is responsible for reviewing and editing the submitted work.
