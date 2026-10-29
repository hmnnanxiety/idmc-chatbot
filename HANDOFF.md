# Current handoff

The frontend is now a WXT Chromium extension for `https://idmc.jogjaprov.go.id/*`.
The completed migration is available on `main`. Feature branches are retained
to document each part of the migration.

The current `feature/overlay-elevation-motion` branch adds a clearer panel border
and shadow, wrapped capsules and staggered entrance motion. It reuses the existing
palette and components and is not yet merged into `main`. See its
[feature document](docs/features/overlay-elevation-motion.md) for review instructions.

- WXT foundation and portal overlay are separate feature commits/branches.
- The overlay retains the existing Figma UI in an isolated Shadow DOM.
- The backend remains deliberately unconfigured; no fake replies are shipped.
- Request format still needs confirmation from the AI engineer.
- History is empty in the injected widget and conversations reset on close.
- The standalone Vite preview remains available through `npm run dev:web`.

Read [README](README.md) for installation/builds, [feature index](docs/features/README.md)
for migration history and [AI handoff](docs/AI_HANDOFF.md) for endpoint integration.

Validation: `npm run lint`, `npm test`, `npm run build`, `npm run test:browser`,
`npm run build:web`, `npm run zip`, and `git diff --check`.
