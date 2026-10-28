# AI engineer integration handoff

The extension UI runs on `https://idmc.jogjaprov.go.id/*`. The RAG URL is currently a
blank placeholder. The frontend preserves its existing contract as an integration
boundary; this is not confirmation of the newly finished RAG server's actual API.

## Contract to confirm

```http
POST <agreed HTTPS chat endpoint>
Content-Type: application/json

{"message":"Data penduduk DIY"}
```

```json
{"reply":"Assistant reply, optionally including Markdown"}
```

- A successful response must be 2xx JSON with a nonempty string `reply`.
- Authentication, citations/metadata, conversation IDs and streaming are not yet
  agreed. The frontend sends no portal login cookies or model provider secrets.
- The current worker aborts after 25 seconds. If RAG commonly needs longer, agree on
  streaming or a job/polling API before replacing that limit.
- Closing the panel aborts the HTTP request. Server-side generation may need its
  own disconnect cancellation if supported by the inference stack.
- Errors and malformed responses render the existing generic chat error state.

## Enable after agreement

1. Copy `.env.example` to `.env.local`.
2. Set `WXT_CHAT_API_URL` to the full endpoint (including `/chat` if applicable).
3. Use `npm run dev` for local HTTP loopback integration, or `npm run build` for an
   HTTPS production endpoint.
4. Reload the extension, refresh the IDMC tab, and test one question, a failure and
   a canceled request against the real server.

WXT derives the required API host permission during the build. The extension
background worker performs the cross-origin fetch; the Vite proxy applies only to
`npm run dev:web`. If the real response contract differs, adapt `chatRequest.ts`
and its tests on a new `feature/` branch.
