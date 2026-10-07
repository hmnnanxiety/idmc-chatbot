# Styling architecture

This migration changes styling ownership, not the UI or chat API. Keep the current
compact Home / Chat / History widget as the baseline; the Figma reference does not
authorize adding its full-page controls or changing the widget layout.

## Editing styles

- Component utilities live next to JSX in `src/components/chatbot/*.tsx`.
- `layout.ts` shares only the widget shell, view shell, footer and hidden-label
  utilities. It prevents the three views from drifting apart.
- `src/lib/utils.ts` exposes `cn()` (`clsx` + `tailwind-merge`). Use ordinary
  conditions for variants such as message role, composer shape and selected history.
- Keep the existing `--idmc-*` tokens. Arbitrary-property utilities deliberately
  preserve exact logical dimensions, font shorthands and safe-area calculations;
  do not round them to the nearest Tailwind spacing value.
- Markdown descendant utilities stay in `MarkdownContent.tsx`; no typography plugin,
  raw HTML, remote reply images or extra rendering dependencies were added.
- Remaining `idmc-*` markers support browser checks and the scoped reset; component
  appearance no longer depends on separate component stylesheets.

## Global stylesheet boundaries

`src/index.css` imports Tailwind theme/utilities and the existing design-system
tokens. It retains the body margin reset, scoped box-sizing reset, reduced-motion
policy, inclusive breakpoint definitions and shared animation keyframes only.
Tailwind Preflight is intentionally **not** imported, to preserve browser defaults
and Markdown rendering. `tokens.css` and `typography.css` retain global token
definitions; obsolete typography helper selectors were removed. Font loading and
SVG assets are unchanged. No Radix, shadcn component library or CVA was introduced.

Responsive variants keep the original inclusive CSS conditions:
`tablet` <= 800px width, `mobile` <= 600px width, `short` <= 520px height,
`narrow` <= 400px width. Their declaration order retains overlapping-condition
precedence, including mobile landscape.

## Verification

Run `npm ci`, then `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`
and `git diff --check`. UI tests also check class composition, shared responsive
tokens, stylesheet removal and the absence of Preflight.

Migration QA compares launcher, Home, selected History, Markdown conversation and
request-error states at identical 1280x800, 390x844, 320x568, 844x390, 600x520,
800x700 and 400x700 viewports. The browser behavior checks additionally exercise
pending drafts, duplicate-submit protection, loading, table/code overflow, history
navigation, cancellation/reset, Escape and focus return. Chat responses are mocked;
no backend contract or request implementation is changed.

Per-component CSS and the local host `App.css` are removed only after their rules
have been migrated. Global fonts/tokens, safe-area handling, dynamic viewport
height, reduced motion and motion timings remain intentional.

Final migration results: typecheck, lint, production build and all 11 UI tests pass.
32 of 35 screenshot pairs are byte-identical. The other three (844x390 Home, Chat,
error) differ only in text-width/subpixel rendering up to 0.03125px; the sampled
colors, fonts, spacing, dimensions, borders, animations and responsive layout remain
the same. Browser interaction checks pass at all four device-sized viewports.
Baseline screenshots and original stylesheets are retained outside the repository
in the Codex verification workspace, rather than committed as runtime assets.
