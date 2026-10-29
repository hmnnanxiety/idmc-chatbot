# Overlay separation and motion

Branch: `feature/overlay-elevation-motion`

Base: `main` (`a34ae8e`)

Status: implemented on the feature branch; not merged into `main`.

## Problem and result

On the light IDMC dashboard, the chatbot's gray surface and faint shadow made its
boundary hard to recognize. This feature gives the existing compact widget a
clearer perimeter and a smooth entrance, using its existing components and palette.

- The panel has a 1px Neutral/400 border, a 20px corner radius and two stronger
  shadow layers derived from Neutral/1000 at 24% and 18% opacity.
- Its existing gray surface, red greeting, pink capsules and yellow send artwork
  are retained. Color tokens and Figma assets are unchanged.
- Suggestion capsules wrap onto additional rows and use the existing 12px body
  type token. All three portal suggestions are visible without sideways scrolling.
  Extra items can scroll vertically within a bounded list.
- The question box has a subtle border and shadow, plus the existing primary-color
  focus treatment. Header controls and capsules have gentle hover/press feedback.

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
| Closing panel | 180ms | 0ms | Fades down 16px toward scale 0.98 |

Opening settles in about 700ms for the three portal suggestions. Delayed content
uses backwards fill, so it starts hidden without retaining a transform afterward.
The panel can close during entrance. Child animation events do not close it early;
the existing 300ms exit fallback remains. Focus returns to the launcher on close.

The existing scoped `prefers-reduced-motion: reduce` policy removes all animations
and transitions. Content is visible immediately and closing skips the exit delay.
Chat requests, history and reset-on-close behavior are unchanged.

## Implementation

Component utilities remain beside JSX. Shared durations live in
`src/components/chatbot/layout.ts`; keyframes stay in `src/index.css`. Shadow colors
use `color-mix()` with existing neutral tokens instead of adding palette values.
The standalone preview and WXT content script use the same components and motion.

## Validation and review

Run `npm run lint`, `npm test`, `npm run build`, `npm run test:browser`,
`npm run build:web`, `npm run zip` and `git diff --check`.

Browser coverage includes normal and reduced motion, closing during entrance,
focus return, readable/reachable wrapped suggestions, mobile/landscape fitting and
the existing extension isolation and API checks. Automated tests use a portal
fixture with a local mock backend. Screenshots live in ignored `.output/qa/`.

Validated on 2026-10-29: lint, typecheck, all 20 UI/API tests, all 11 Chromium
extension tests, extension and web production builds, ZIP packaging and whitespace
checks pass. The extension was also inspected on the fully loaded live IDMC
dashboard in an isolated Chromium profile. The captured desktop view and short
animation preview are `.output/qa/overlay-live-desktop.png` and
`.output/qa/overlay-motion-preview.webm`; generated review artifacts stay out of Git.

To review the animation on IDMC:

1. Check out this branch and run `npm run build`.
2. Reload the unpacked extension from `.output/chrome-mv3`, then refresh the portal.
3. Open the launcher and watch the greeting, capsules and input settle into place.
4. Close with the button or Escape, including immediately after opening; reopen.
5. Check a narrow window and enable the OS reduced-motion setting to compare.

The backend is still unconfigured, so submitting a question shows the existing
service-unavailable message.
