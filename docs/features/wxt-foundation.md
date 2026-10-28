# WXT foundation

Branch: `feature/wxt-foundation`

Base: `main` at `6116196`

## Purpose

Package the existing React/TypeScript/Tailwind frontend as a Chromium Manifest V3
extension using WXT. Injection is scoped to `https://idmc.jogjaprov.go.id/*`, in
the top frame at `document_idle`. This branch establishes a passive content-script
entrypoint; the next feature mounts the chatbot.

## Decisions

- Keep the existing UI, Figma assets and design tokens.
- Use the official WXT React module and existing Tailwind Vite plugin.
- Keep Vite's standalone widget preview under the `*:web` commands.
- Generate `.wxt/` and `.output/` locally; do not commit build artifacts.
- Use explicit imports and a separate extension TypeScript configuration.
- Require Chrome/Edge 120 or newer for the browser APIs used by the extension.

## Commands

`npm run dev` starts WXT with the IDMC portal as its start URL.
`npm run build` creates `.output/chrome-mv3/`.
`npm run zip` creates an installable source-free extension ZIP in `.output/`.
`npm run dev:web` starts the original Vite preview.

## Validation

Run `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.
Inspect the generated manifest's content-script matches before loading unpacked.

## Next features

`feature/extension-overlay` depends on this branch. `feature/extension-api` then
adds the background request bridge. Each feature has its own document and commit;
branches are stacked until their parent is merged into `main`.
