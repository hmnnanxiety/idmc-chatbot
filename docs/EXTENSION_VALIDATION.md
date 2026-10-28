# Extension validation

Validated on 2026-10-28 (Asia/Jakarta), using Node 24.20.0, WXT 0.21.5,
Vite 8.3.5 and Playwright 1.62.1 with its Chromium runtime.

| Check | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npm run typecheck` | Passed (also part of production build) |
| `npm test` | 20 passed: 11 existing UI tests and 9 API/worker/configuration tests |
| `npm run test:browser` | 9 passed with actual compiled Manifest V3 extensions |
| `npm run build` | Passed; `.output/chrome-mv3` |
| `npm run build:web` | Passed; original Vite preview in `dist` |
| `npm run zip` | Passed; `.output/idmc-chatbot-0.1.0-chrome.zip` |

The installation audit reported two pre-existing/transitive build-tool advisories.
Compatible Vite and Zod updates resolved them; the subsequent install audit reported
zero vulnerabilities. No forced audit upgrade was used.

Browser fixtures are served at `https://idmc.jogjaprov.go.id/` with deliberately
conflicting global button styles, a different root font size and nonzero body margin.
They verify actual manifest-based injection, Shadow DOM isolation, pointer input,
keyboard focus/Escape, placeholder errors, cross-origin background requests,
Markdown replies, pending drafts, duplicate-submit protection and cancellation.
Viewport checks cover 1280x900, 390x844, 320x568 and 844x390. Other origins and
same-origin subframes receive no extension UI.

The backend URL is blank in the production output. Only the separate test build
uses a temporary local mock server. No RAG endpoint was contacted and mock replies
are not part of the shipped extension. Screenshots are generated in `.output/qa/`.

## Live portal limitation

A separate live navigation to `https://idmc.jogjaprov.go.id/` timed out after 30
seconds from the development environment. The website lookup also returned a 502.
These results do not establish the site's availability to the user's browser.
The actual portal DOM/layout therefore still needs a manual check after loading
the unpacked extension. No authentication, TLS bypass or website changes were used.
