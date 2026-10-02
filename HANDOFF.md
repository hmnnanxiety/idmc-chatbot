# HANDOFF

## Status

Phase 1 complete.
Phase 2 compact overlay working locally.

Stack:
- Vite
- React
- TypeScript
- ESLint
- CSS variables

## Done

- compact bottom-right launcher + overlay
- Home and Conversation internal states
- submit/suggestion -> Conversation
- message auto-scroll
- Escape closes overlay
- launcher returns after close
- TechStack removed
- avatar/settings currently hidden but components are kept
- custom Figma assets added
- lint/build previously passed

## Current UI

Home:
- large `Chatbot Data Publik`
- tagline
- small horizontal suggestion chips
- composer anchored at bottom
- header: history + close

Chat:
- hero/tagline disappear
- compact `Chatbot Data Publik` title moves to top-left header
- history + close on right
- scrollable messages
- composer anchored at bottom

Launcher uses `chatbot-icon.svg`.

History icon:
`src/assets/figma/history-chat.svg`

## Next

Add internal History view:

```ts
type ChatView = "home" | "chat" | "history";