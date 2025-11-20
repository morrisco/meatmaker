```markdown
# Meatmaker — Single-user PWA (IndexedDB) — Deploy to GitHub Pages

This is a lightweight single-user workout planner/tracker called Meatmaker:
- Local-first (IndexedDB via Dexie) — works offline on phone and desktop
- Create/edit exercises (name, muscle group)
- Create workout templates with per-set specs
- Build a weekly plan (assign templates to weekdays) for N weeks (default 4)
- Mark exercises/whole days completed and log actual reps/weights
- Per-exercise weight-over-time chart
- PWA installable and mobile-first UI
- Deploys to GitHub Pages with included GitHub Actions workflow

Getting started (locally)
1. Clone the repo:
   git clone https://github.com/<your-username>/meatmaker.git
   cd meatmaker

2. Install:
   npm install

3. Dev server:
   npm run dev
   Open http://localhost:5173

Build and preview
- npm run build
- npm run preview

Deploy to GitHub Pages
1. Push the repo to GitHub (main branch).
2. The included GitHub Actions workflow will automatically build and publish the `dist` to `gh-pages` branch and enable GitHub Pages.
3. After a successful workflow run you can open: https://<your-username>.github.io/meatmaker

Notes and suggestions
- All data is local. To reset or delete data, go to Admin > Reset Data.
- Starter exercise dataset is included on first run.
- If you later want cloud sync, the codebase includes an obvious DB abstraction (src/db.js) where a remote sync layer could be added.
mangos
```