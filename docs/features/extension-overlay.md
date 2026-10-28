# IDMC portal overlay

Branch: `feature/extension-overlay`

Depends on: `feature/wxt-foundation`

## Behavior

The existing floating launcher appears on HTTPS pages at
`idmc.jogjaprov.go.id`, in the top frame only. It opens the same compact Home,
Conversation and History UI. No portal selectors, login data or page content are
read. Suggestions remain local UI content. History is empty until a separate
persistence feature is implemented; closing still resets the conversation.

## Isolation and lifecycle

- Mount `ChatOverlay` directly; `App.tsx` remains the standalone mock host page.
- Use WXT `createShadowRootUi` with `cssInjectionMode: 'ui'`.
- Export design tokens on `:host` as well as `:root`.
- Keep the preview body reset outside injected CSS.
- Use one transparent viewport anchor with pointer input enabled only on controls.
- Stop keyboard events at the shadow boundary; handle Escape and focus within it.
- Mount via `autoMount` and unmount React on content-script invalidation.
- Package the original font family and Figma assets with the extension.

## Validation

Check launcher, Home, History, pending/error states, close/reopen, Escape, composer
focus, narrow/short viewports and reduced motion. Verify that the portal's body
margin, typography, scroll and keyboard controls remain unchanged. Verify no UI
is injected into other origins or portal iframes.
