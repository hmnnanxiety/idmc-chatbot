import { browser } from 'wxt/browser'
import { defineBackground } from 'wxt/utils/define-background'
import { CHAT_PORT_NAME } from '../extension/chatProtocol'
import { handleChatPort, isPortalSender } from '../extension/handleChatPort'

export default defineBackground(() => {
  // Synchronous registration lets Chromium wake the worker for a new request.
  browser.runtime.onConnect.addListener(port => {
    if (port.name !== CHAT_PORT_NAME) return
    if (!isPortalSender(port.sender, browser.runtime.id)) { port.disconnect(); return }
    handleChatPort(port, import.meta.env.WXT_CHAT_API_URL?.trim() ?? '')
  })
})
