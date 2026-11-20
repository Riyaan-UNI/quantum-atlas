# Quantum Atlas

**Chart the unknown. Keep asking why.**

A sci-fi game-based learning website prototype for the CCST9077 final project. It introduces quantum information through short films, an 11-topic Atlas, optional prediction activities, and project artwork.

## Run it in Visual Studio Code

1. Install [Node.js](https://nodejs.org/) if it is not already installed. The current Vite version requires a modern Node.js release.
2. In VS Code, choose **File → Open Folder…** and open this `QuantumAtlas` folder.
3. Open **Terminal → New Terminal**.
4. Run these commands:

   ```powershell
   npm install
   npm run dev
   ```

5. Open the local address Vite prints in the terminal (usually `http://localhost:5173/`).
6. To stop the local server, focus the terminal and press **Ctrl+C**.

The site opens with an interactive black-hole themed entry screen. Select **Enter the Atlas** to continue; with reduced motion enabled, the scene stays still and the same button remains available. Topic progress is saved in the browser on that device.

## Build the site

```powershell
npm run build
```

The production output is written to `dist/`. Generated output and installed dependencies are excluded from Git; the source, lockfile, and media assets are included.

## Project notes

- The fourth episode has a supplied script but still needs its video link.
- Check captions and provide transcripts for released videos before submission.
- The lecture explanations are prototype drafts and should be checked against the CCST9077 lecture slides by the team.
- Add real team member names and substantial contribution descriptions to the credits before submission.
- See [`design-qa.md`](design-qa.md) for the visual review status and remaining checks.
- See [`AGENTS.md`](AGENTS.md) for project-specific design and implementation constraints.

## AI use

AI tools assisted with this website prototype and interface visuals. The team should complete the final disclosure to accurately cover every tool used for submitted writing, videos, and artwork.
