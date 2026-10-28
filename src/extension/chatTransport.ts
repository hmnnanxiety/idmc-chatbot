import { browser } from 'wxt/browser'
import { ChatServiceUnavailableError } from '../api/chatRequest'
import type { ChatTransport } from '../api/chatRequest'
import { CHAT_PORT_NAME, CLIENT_REQUEST_TIMEOUT_MS, isChatPortResponse } from './chatProtocol'

export const sendExtensionChatMessage: ChatTransport = (message, signal) => new Promise((resolve, reject) => {
  if (signal?.aborted) { reject(signal.reason); return }
  const port = browser.runtime.connect({ name: CHAT_PORT_NAME })
  let settled = false
  const finish = (error?: unknown, reply?: string) => {
    if (settled) return
    settled = true
    clearTimeout(timeout)
    signal?.removeEventListener('abort', onAbort)
    try { port.disconnect() } catch { /* An invalidated extension is already disconnected. */ }
    if (error) reject(error)
    else resolve(reply!)
  }
  const onAbort = () => finish(signal?.reason ?? new DOMException('Aborted', 'AbortError'))
  const timeout = setTimeout(() => finish(new Error('Chat response timed out')), CLIENT_REQUEST_TIMEOUT_MS)
  signal?.addEventListener('abort', onAbort, { once: true })
  port.onDisconnect.addListener(() => {
    const error = browser.runtime.lastError
    finish(new Error(error?.message ?? 'Chat service disconnected'))
  })
  port.onMessage.addListener((value: unknown) => {
    if (!isChatPortResponse(value)) { finish(new Error('Invalid chat response')); return }
    if (value.ok) finish(undefined, value.reply)
    else finish(value.code === 'unavailable' ? new ChatServiceUnavailableError() : new Error('Chat request failed'))
  })
  try { port.postMessage({ type: 'chat', message }) } catch (error) { finish(error) }
})
