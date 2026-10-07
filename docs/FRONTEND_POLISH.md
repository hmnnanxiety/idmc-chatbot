# Frontend polish boundary

Visual references: existing Figma Home `1:20867` and Conversation `1:20907` in
`xN5zluS2lWIxKY4VwZXMHL`. The existing color/type tokens and local Figma assets
are reused; the white conversation surface and 16px bubble/chat-composer radii
follow those frames. Widget sizing, launcher, header actions and Home placement
are retained. The full-frame Figma badge/settings/sidebar/technology footer are
pre-existing differences outside this polish, not newly implemented features.

- `ChatHeader` composes existing `TopBar`/`IconButton` controls for all views.
- `useChatSession` owns transient messages, one-request guard, cancellation,
  loading and failure presentation. Overlay remains responsible for view/focus/
  open-close animation. History remains mock visual selection, not persistence.
- `MarkdownContent` uses `react-markdown` and `remark-gfm`; no raw HTML parsing,
  custom URL-transform bypass or remote images. User input stays plain text.
  Tables/code scroll inside the bubble instead of widening the widget.
- `HistoryItem`, `EmptyState` and `ErrorState` isolate repeated presentation.
  Existing `TypingIndicator` is retained rather than adding a duplicate loader.
- Composer blocks empty/pending submits, keeps editable pending drafts and avoids
  premature Enter submission during IME composition.

The Markdown renderer follows the library's [safe rendering guidance](https://github.com/remarkjs/react-markdown#security)
and uses [remark-gfm](https://github.com/remarkjs/remark-gfm) for tables/lists.

API remains `/api/chat`, POST `{ message }`, response `{ reply }`, with the same
timeout/proxy and no new backend features. Existing local API edits are preserved.

```powershell
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Tests use Node's runner, Vite TSX loading and React static rendering; no extra test
framework. For browser verification, mock `/api/chat` and check Home → Chat,
pending draft preservation, Markdown/table overflow, errors, History selection/
Back, close cancellation, reopen reset, keyboard and small/landscape viewports.

## Files changed by this polish

All component paths below are under `src/components/chatbot/`:

| Group | Files |
| --- | --- |
| New components/hook | `ChatHeader.tsx`, `HistoryItem.tsx`, `EmptyState.tsx`/`.css`, `ErrorState.tsx`/`.css`, `MarkdownContent.tsx`/`.css`, `useChatSession.ts` |
| Views and orchestration | `ChatOverlay.tsx`, `HomeView.tsx`/`.css`, `ConversationView.tsx`, `HistoryView.tsx`/`.css` |
| Existing shared presentation | `TopBar.tsx`, `MessageBubble.tsx`/`.css`, `MessageList.tsx`/`.css`, `ChatInput.tsx`/`.css`, `SendButton.tsx`/`.css` |
| Types/exports | `types.ts`, `index.ts` |
| Project-level | `package.json`, `package-lock.json`, `scripts/ui.test.mjs`, `docs/FRONTEND_POLISH.md` |

Pre-existing changes in `src/api/chatApi.ts`, `vite.config.ts` and `HANDOFF.md`
were left untouched. No design assets or tokens were replaced; no commit/push was
performed.

Verification on 2026-10-07: typecheck, lint, production build and all eight static
UI tests passed; `git diff --check` was clean. Mocked browser checks passed at
1280×800, 390×844, 320×568 and 844×390, including pending drafts/single requests,
Markdown security, local table/code overflow, History navigation/selection, failure
presentation, close cancellation/reset and Escape/focus return. Screenshots were
reviewed against the relevant Figma references. No live backend request was needed.
