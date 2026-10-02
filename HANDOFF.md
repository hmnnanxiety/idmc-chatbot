# HANDOFF

## Current state
Phase 1 is partially implemented.

Completed:
- Figma Design System Color + Typography inspected
- HiFi Home and Chat inspected
- design tokens created
- reusable chatbot components created
- static preview structure created

## Remaining
1. Resolve missing Figma assets (exact SVG exports, not redrawn). Source nodes:
   - avatar.svg (Ellipse 1, Home 1:20870 / Chat 1:20910)
   - icon-settings.svg (solar:settings-bold-duotone Group, 1:20875 / 1:20915)
   - send-circle.svg (Ellipse 2, 1:20882 / 1:20928)
   - icon-send.svg (solar:map-arrow-right-bold-duotone Group, 1:20883 / 1:20929)
   - icon-file.svg (solar:file-line-duotone Group, I1:20885;1:20941;1:11560)
   Target folder: src/assets/figma/ (currently empty, so build fails until filled).
   The TechStack section and its tech-* logo assets were removed; do not re-add.

2. Do not redraw or substitute these assets.
3. Verify local preview against Figma.
4. Run:
   - npm run lint
   - npm run build
5. Fix only Phase 1 issues.
6. Do not start Phase 2.

## Figma nodes
- HiFi page: 1:20793
- Home: 1:20867
- Chat: 1:20907
- Button: 1:20940

## Notes
Some values in the HiFi are outside the documented design-system scale.
Use the HiFi values where required.

There are also assumptions currently present in (the HiFi shows only empty
placeholder boxes there, so Figma cannot verify them):
- message bubble typography/padding/text color and user/assistant mapping
- chat input typography/padding/placeholder

_removed-techstack/ holds the former TechStack files as .bak for manual deletion.