# Extension API bridge

Branch: `feature/extension-api`

Depends on: `feature/extension-overlay`

## Placeholder behavior

The user owns the frontend; their AI engineer supplies the RAG endpoint later.
`WXT_CHAT_API_URL` is deliberately blank by default. Sending a question shows
`Layanan chatbot belum tersedia. Silakan coba lagi nanti.` No fake assistant reply
is generated, no API host permission is granted, and no backend request is made.
Mock answers exist only in automated tests.

## Request path

`ChatOverlay -> useChatSession -> chatTransport -> background worker -> FastAPI`

The standalone Vite preview retains its `/api/chat` development proxy. An injected
widget never calls that relative path; its transport is passed as a prop. The HTTP
adapter is shared and validates the existing `{ message }` / `{ reply }` contract.

Each submission opens one named runtime port. The background listener is registered
synchronously, verifies the sender's extension ID, tab, exact portal origin and top
frame, and accepts one bounded text message per port. It fetches only the configured
URL, omits cookies, rejects redirects and returns a typed result. The content script
cannot provide an arbitrary destination URL. Closing, navigating or invalidating
the UI disconnects the port and aborts its fetch. The UI still prevents duplicate
submits and preserves an editable draft while waiting.

## Configuration and permissions

Copy `.env.example` to `.env.local`. Once the endpoint is agreed, set the full URL
in `WXT_CHAT_API_URL`, rebuild, reload the unpacked extension and refresh the portal.
Production requires HTTPS; development/test additionally allows HTTP on `localhost`
or `127.0.0.1`. The manifest derives permission for only the configured scheme/host.
Browser host permissions cannot restrict that permission to a particular port/path;
the worker itself uses the exact configured endpoint. No general tabs, storage,
scripting or all-sites permission is requested. All `WXT_` values are public build
configuration, so provider secrets must stay on the RAG server.

## Timing boundary

The preview retains its 60-second timeout. The extension worker uses a 25-second
request timeout and the client a 30-second disconnect/response watchdog. Chromium
can terminate a service worker if a fetch response takes more than 30 seconds:
[Chrome lifecycle documentation](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle).
Confirm RAG latency with the AI engineer. If answers exceed this boundary, agree on
streaming or an asynchronous job/polling contract as a separate feature. No infinite
keepalive or automatic POST retry is added.

## Validation

`npm test` checks the HTTP contract, malformed/error responses, deadlines, sender
validation, restricted configuration, duplicate messages and request cancellation.
`npm run test:browser` loads actual compiled extensions in isolated Chromium profiles,
uses a fixture served at the exact portal origin, and a local HTTP mock. It checks
placeholder errors, cross-origin worker requests, Markdown, drafts, cancellation,
focus, portal style/input isolation, viewport fit and excluded origins/iframes.
It creates separate production-placeholder and test-configured builds; the production
output keeps the backend unset. Screenshots go to `.output/qa/`.
