import { defineContentScript } from 'wxt/utils/define-content-script'
import { PORTAL_MATCH } from '../config/extension'

export default defineContentScript({
  matches: [PORTAL_MATCH],
  allFrames: false,
  runAt: 'document_idle',
  main() {
    // The overlay feature mounts the existing React UI here.
  },
})
