# Feature branches

The three migration features are merged into `main`. Their separate branches and
commits are retained for documentation. They were implemented and merged in the
dependency order shown below.

| Branch | Original base | Documentation |
| --- | --- | --- |
| `feature/wxt-foundation` | `main` | [WXT foundation](wxt-foundation.md) |
| `feature/extension-overlay` | `feature/wxt-foundation` | [Portal overlay](extension-overlay.md) |
| `feature/extension-api` | `feature/extension-overlay` | [API bridge](extension-api.md) |

## Overlay refinement

| Branch | Base | Documentation | Status |
| --- | --- | --- | --- |
| `feature/overlay-elevation-motion` | `main` | [Overlay separation and motion](overlay-elevation-motion.md) | Merged into `main` on 2026-10-31 |

Use `main` to run the complete extension, including the overlay refinement. The
feature branch is retained for documentation. New independent features should start
from updated `main` using a new `feature/` branch; do not append unrelated work to
these completed feature branches. The overlay refinement is authorized to reuse
the existing palette and components; record visual decisions in its feature doc.

For each feature, document the user-visible result, scope, architecture decisions,
configuration and validation. Keep screenshots, dependency caches and unpacked
extension output out of Git. Push branches and create PRs when ready for team review;
branch creation and local commits do not publish them automatically.
