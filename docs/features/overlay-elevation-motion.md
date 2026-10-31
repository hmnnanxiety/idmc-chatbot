# Overlay separation and motion

Branch: `feature/overlay-elevation-motion`

Base: `main` (`a34ae8e`)

Status: merged into `main` on 2026-10-31. The feature branch is retained for documentation.

## Problem and result

On the light IDMC dashboard, the chatbot's gray surface and faint shadow made its
boundary hard to recognize. This feature gives the existing compact widget a
clearer perimeter and a smooth entrance, using its existing components and palette.

- The panel has a 1px Neutral/400 border, a 20px corner radius and two stronger
  shadow layers derived from Neutral/1000 at 24% and 18% opacity.
- Home, Conversation and History share a stationary white-to-pale-yellow gradient
  (Neutral/100 to Secondary/100, at 155 degrees). The upper 38% remains white;
  warmth builds toward the lower edge. Color tokens and Figma assets are unchanged.
- The red greeting, pink capsules and yellow send artwork are retained. The
  conversation reading area stays solid white with a subtle neutral border so
  messages, tables and code remain readable against the warm shell.
- Suggestion capsules wrap onto additional rows and use the existing 12px body
  type token. All three portal suggestions are visible without sideways scrolling.
  Extra items can scroll vertically within a bounded list.
- The question box has a subtle border and shadow, plus the existing primary-color
  focus treatment. Header controls and capsules have gentle hover/press feedback.
- History selection and the enabled send button also have subtle interaction
  feedback. The history empty state uses Neutral/700 for clear text on the gradient.

The dashboard stays interactive. The panel still measures 380 x 600px at desktop
sizes and uses the existing mobile/safe-area rules. No new UI components, runtime
dependencies, expanded view or navigation behavior were introduced.

## Motion

Only opacity and transforms animate during entrances; layout dimensions stay fixed.

| Element | Duration | Delay | Movement |
| --- | --- | --- | --- |
| Panel | 420ms | 0ms | Rises 24px and settles from scale 0.98 |
| Greeting heading | 420ms | 80ms | Rises 12px |
| Greeting tagline | 420ms | 140ms | Rises 12px |
| Capsules | 420ms | 180ms + 45ms per item | Rise 12px; delay capped after item 6 |
| Home question box | 420ms | 260ms | Rises 12px |
| Shared header | 320ms | 0ms | Rises 4px |
| Conversation reading area | 320ms | 60ms | Rises 4px |
| Conversation question box | 320ms | 120ms | Rises 12px |
| New messages, errors and loading bubble | 320ms | 0ms | Rise 8px |
| History section label | 320ms | 60ms | Rises 4px |
| History rows | 320ms | 100ms + 40ms per item | Rise 4px; delay capped after item 6 |
| Empty states | 320ms | 80ms | Rise 12px |
| Closing panel | 180ms | 0ms | Fades down 16px toward scale 0.98 |

Opening settles in about 700ms for the three portal suggestions. Delayed content
uses backwards fill, so it starts hidden without retaining a transform afterward.
The panel can close during entrance. Child animation events do not close it early;
the existing 300ms exit fallback remains. Focus returns to the launcher on close.

Internal view changes animate their content without moving or fading the gradient.
Entrances run on mount; selecting a history row or appending a reply does not
replay entrances on existing rows/messages. Returning from History remounts the
conversation view and gives it its normal entrance. The existing typing dots are
the only continuous animation, and only while a reply is pending.

The existing scoped `prefers-reduced-motion: reduce` policy removes all animations
and transitions. Content is visible immediately and closing skips the exit delay.
Chat requests, history and reset-on-close behavior are unchanged.

## Implementation

Component utilities remain beside JSX. Shared durations live in
`src/components/chatbot/layout.ts`, along with the shared gradient surface;
keyframes stay in `src/index.css`. Shadow colors
use `color-mix()` with existing neutral tokens instead of adding palette values.
The standalone preview and WXT content script use the same components and motion.

## Validation and review

Run `npm run lint`, `npm test`, `npm run build`, `npm run test:browser`,
`npm run build:web`, `npm run zip` and `git diff --check`.

Browser coverage includes normal and reduced motion across views, closing during
entrance, focus return, readable/reachable wrapped suggestions, mobile/landscape
fitting and the existing extension isolation and API checks. It checks that
messages survive History navigation, existing message animations do not replay
on append, and populated preview history rows stagger without replay on selection.
Automated tests use a portal fixture with a local mock backend and the standalone
preview's sample history. Screenshots live in ignored `.output/qa/`.

Validated on 2026-10-29: lint, typecheck, all 20 UI/API tests, all 13 Chromium
browser tests, extension and web production builds, ZIP packaging and whitespace
checks pass. The extension was also inspected on the fully loaded live IDMC
dashboard in an isolated Chromium profile. The captured desktop view and short
animation preview are `.output/qa/gradient-live-desktop.png` and
`.output/qa/gradient-motion-preview.webm`. Conversation/History captures and the
populated preview history are saved alongside them. Generated review artifacts
stay out of Git.

To review the animation on IDMC:

1. Check out updated `main` and run `npm run build`.
2. Reload the unpacked extension from `.output/chrome-mv3`, then refresh the portal.
3. Open the launcher and watch the greeting, capsules and input settle into place.
4. Submit a question and visit History, then return. Compare the stationary
   gradient and the header, message and composer entrances in each view.
5. Use `npm run dev:web` to review the populated sample history and row selection.
6. Close with the button or Escape, including immediately after opening; reopen.
7. Check a narrow window and enable the OS reduced-motion setting to compare.

The backend is still unconfigured, so submitting a question shows the existing
service-unavailable message.
