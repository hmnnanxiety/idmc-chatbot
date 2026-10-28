import { defineContentScript } from 'wxt/utils/define-content-script'
import { createShadowRootUi } from 'wxt/utils/content-script-ui/shadow-root'
import { PORTAL_MATCH } from '../config/extension'
import { mountChatbot } from '../extension/mountChatbot'
import '../extension/overlay.css'

export default defineContentScript({
  matches: [PORTAL_MATCH],
  allFrames: false,
  runAt: 'document_idle',
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowRootUi(ctx, {
      name: 'idmc-chatbot-extension',
      // Own the reset so all:initial!important does not reset our positioning.
      inheritStyles: true,
      position: 'inline',
      anchor: 'body',
      isolateEvents: ['keydown', 'keyup', 'keypress'],
      onMount: mountChatbot,
      onRemove: (root) => root?.unmount(),
    })
    ui.autoMount()
    ctx.onInvalidated(() => ui.remove())
  },
})
