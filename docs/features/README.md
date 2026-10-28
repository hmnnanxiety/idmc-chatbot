# Feature branches

The migration is split into feature branches and commits. No changes are
merged into `main`. The branches are stacked so each review can show only its own
feature relative to its parent.

| Branch | Parent / suggested PR base | Documentation |
| --- | --- | --- |
| `feature/wxt-foundation` | `main` | [WXT foundation](wxt-foundation.md) |
| `feature/extension-overlay` | `feature/wxt-foundation` | [Portal overlay](extension-overlay.md) |
| `feature/extension-api` | `feature/extension-overlay` | [API bridge](extension-api.md) |

Use `feature/extension-api` to run the complete extension. Review/merge in the order
shown above. Once a parent lands, update the next PR's base to `main` as appropriate
for the chosen merge strategy. New independent features should start from updated
`main`; do not append unrelated work to these migration branches.

For each feature, document the user-visible result, scope, architecture decisions,
configuration and validation. Keep screenshots, dependency caches and unpacked
extension output out of Git. Push branches and create PRs when ready for team review;
branch creation and local commits do not publish them automatically.
