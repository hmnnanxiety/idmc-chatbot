# IDMC Chatbot Browser Extension

React + TypeScript + Tailwind chatbot, packaged with WXT as a Chromium Manifest V3
extension for **https://idmc.jogjaprov.go.id/**. The original Figma widget design
and standalone Vite preview are retained.

## Requirements

- Node.js 22 or newer and npm.
- Chrome or Microsoft Edge 120 or newer.

## Install and try

```powershell
npm ci
npm run build
```

Open `chrome://extensions` or `edge://extensions`, enable Developer mode, choose
**Load unpacked**, and select `.output/chrome-mv3`. Refresh an IDMC portal tab.
The floating launcher appears at the bottom right. Only the exact HTTPS hostname
is matched, in the top frame; other sites, HTTP URLs and subdomains are excluded.

The backend is a **placeholder**. Sending a question currently shows a service
unavailable message. No fake answer is generated. The AI engineer's endpoint can
be connected later without rebuilding the UI.

## Development and builds

| Command | Purpose |
| --- | --- |
| `npm run dev` | WXT development/reload workflow for Chrome |
| `npm run dev:edge` | WXT development workflow targeting Edge |
| `npm run build` | Typecheck and build `.output/chrome-mv3` |
| `npm run zip` | Build and create an extension ZIP in `.output` |
| `npm run dev:web` | Original standalone Vite preview |
| `npm run build:web` | Build the standalone preview to `dist` |
| `npm run preview:web` | Serve the built standalone preview |
| `npm run lint` | ESLint |
| `npm run typecheck` | Generate WXT types and check app/config types |
| `npm test` | UI and extension API tests |
| `npm run test:browser` | Build and test real extensions with a local mock |

For browser tests, install the matching Chromium runtime once with
`npx playwright install chromium`. The test uses temporary isolated profiles and
does not install anything in your everyday browser profile. Screenshots are saved
under `.output/qa`. Automated portal fixtures verify isolation; they do not replace
a manual check against the live portal.

## Backend placeholder

```powershell
Copy-Item .env.example .env.local
```

Leave `WXT_CHAT_API_URL` blank until the endpoint is agreed. Then set it to the
full chat URL and rebuild/reload. Production requires HTTPS. WXT development/test
builds also permit `http://127.0.0.1:8000/chat` or localhost. If testing a local
backend through an unpacked build, use `npx wxt build --mode development` and load
`.output/chrome-mv3-dev`.

The existing contract is POST `{ "message": "..." }`, response
`{ "reply": "..." }`. Confirm it with the AI engineer before real integration.
The extension fetches through its background worker using narrowly scoped host
permissions. Its request timeout is 25 seconds; slower RAG responses need an
agreed streaming/job API. Never bundle model provider keys in `WXT_` variables.
See [AI handoff](docs/AI_HANDOFF.md) and [API feature](docs/features/extension-api.md).

The Vite preview separately retains `/api/chat` proxied to `127.0.0.1:8000/chat`.

## Architecture

- `wxt.config.ts`: extension configuration, React/Tailwind and API host permission.
- `src/entrypoints/chatbot.content.ts`: scoped portal injection and Shadow DOM lifecycle.
- `src/entrypoints/background.ts`: validated, cancelable chat requests.
- `src/extension/`: mount, isolated styles/fonts and runtime messaging.
- `src/components/chatbot/`: existing Home, Conversation and History components.
- `src/api/`: shared HTTP adapter and preview transport.
- `src/App.tsx`, `src/main.tsx`, `vite.config.ts`: standalone development preview.

Fonts and icons are bundled locally. The extension does not scrape portal data,
read portal authentication or persist chats. Only submitted questions are sent to
the configured backend. History is empty in the extension; closing the panel
clears the current conversation. Authentication, streaming, persistent history and
Firefox support remain separate features.

## Feature documentation

Use the complete extension from `main`. The migration retains separate
`feature/wxt-foundation`, `feature/extension-overlay` and `feature/extension-api`
branches and commits; see [feature index](docs/features/README.md) for migration history.

The merged `feature/overlay-elevation-motion` feature refines the overlay's border,
shadow, white/yellow gradient, capsules and motion across Home, Conversation and
History with the existing palette and components.
See [overlay refinement](docs/features/overlay-elevation-motion.md) for details and
review instructions. This refinement is available on `main`; the feature branch
is retained for documentation.

Styling rules remain in [styling architecture](docs/STYLING_ARCHITECTURE.md).
The original [frontend polish](docs/FRONTEND_POLISH.md) is historical validation;
extension-specific behavior is described in the feature docs.

Design source: [Figma frontend](https://www.figma.com/design/xN5zluS2lWIxKY4VwZXMHL/Frontend-Dev-IDMC-Chatbot?node-id=0-1).
