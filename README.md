# IDMC Chatbot Frontend

Frontend widget for the IDMC / Portal Data Publik DIY RAG chatbot.

**Project root**  
`E:\UGM - TRPL\Semester 5\idmc-chatbot`

**Figma**  
https://www.figma.com/design/xN5zluS2lWIxKY4VwZXMHL/Frontend-Dev-IDMC-Chatbot?node-id=0-1&p=f&t=w1S0htUCnyRUayeD-0

## Stack

- Vite
- React
- TypeScript
- ESLint
- CSS / CSS Variables

Keep dependencies minimal. Do not add Next.js, React Router, Redux/Zustand, Tailwind, shadcn, Bootstrap, or animation libraries unless explicitly requested.

## Current task — Phase 1 only

Use the connected **Figma MCP** before coding.

Inspect:
- `Design System` → **Color** and **Typography**
- `HiFi` → chatbot UI states/components

Use the Figma design as source of truth. Prefer exact existing values over invented colors, type scales, radii, spacing, or effects.

Create:
- reusable CSS color/type tokens
- reusable React + TypeScript components required by the HiFi
- a static `App.tsx` development preview for Home and Conversation states

Suggested structure:

```text
src/
├─ components/chatbot/
├─ design-system/
│  ├─ tokens.css
│  └─ typography.css
├─ App.tsx
└─ main.tsx
```

## Rules

- Do **not** redesign the Figma.
- Do **not** implement the sidebar.
- Treat Home and Chat as UI states, not routes.
- No `/chat/[slug]` and no router.
- No backend/RAG/API integration yet.
- No persistent chat history/auth.
- No floating overlay/launcher/maximize behavior yet.
- No Shadow DOM/dashboard injection yet.
- Keep components small, typed, semantic, and reusable.
- Keep CSS scoped/namespaced; avoid global element selectors.
- If Figma values are inconsistent, use the value actually used by the HiFi and note it.
- Reuse exact Figma assets/components when available; do not redraw or substitute them arbitrarily.
- `App.tsx` is only a local component showcase, not final production architecture.

## Figma workflow

Before implementation:
1. Read the current repo/code first.
2. Fetch structured Figma design context for the relevant HiFi/design-system nodes.
3. Fetch/render screenshots as the visual reference.
4. Implement from structured design context; do not use screenshots as assets.
5. Compare the local result with the Figma target.

## Validate

```bash
npm run lint
npm run build
```

Stop after Phase 1 is complete.

Report only:
- tokens extracted
- components created
- Figma inconsistencies found
- files changed
- lint/build result
