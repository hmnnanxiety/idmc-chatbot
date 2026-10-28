import type { Browser } from 'wxt/browser'
import { requestChatReply } from '../api/chatRequest'
import { PORTAL_ORIGIN } from '../config/extension'
import { isChatPortRequest, WORKER_REQUEST_TIMEOUT_MS } from './chatProtocol'
import type { ChatPortResponse } from './chatProtocol'

export function isPortalSender(sender: Browser.runtime.MessageSender | undefined, extensionId: string): boolean {
  if (sender?.id !== extensionId || sender.frameId !== 0 || sender.tab?.id === undefined) return false
  try { return new URL(sender.url ?? '').origin === PORTAL_ORIGIN } catch { return false }
}

/** One request per port; disconnect aborts a closing or navigating tab's request. */
export function handleChatPort(port: Browser.runtime.Port, endpoint: string) {
  const controller = new AbortController()
  let handled = false
  port.onDisconnect.addListener(() => controller.abort())
  const respond = (response: ChatPortResponse) => {
    if (controller.signal.aborted) return
    try { port.postMessage(response) } catch { controller.abort() }
  }
  port.onMessage.addListener((value: unknown) => {
    if (handled) return
    handled = true
    if (!isChatPortRequest(value)) { respond({ ok: false, code: 'invalid' }); return }
    if (!endpoint) { respond({ ok: false, code: 'unavailable' }); return }
    void requestChatReply({
      endpoint, message: value.message.trim(), signal: controller.signal,
      timeoutMs: WORKER_REQUEST_TIMEOUT_MS,
    }).then(
      reply => respond({ ok: true, reply }),
      () => respond({ ok: false, code: 'failed' }),
    )
  })
}
