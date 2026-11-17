import type { ChatMessage } from './types'

export interface SavedConversation {
  id: string
  messages: ChatMessage[]
  updatedAt: number
}

export function isConversation(value: unknown): value is SavedConversation {
  if (!value || typeof value !== 'object') return false
  const record = value as SavedConversation
  return (
    typeof record.id === 'string' &&
    /^[a-zA-Z0-9-]{1,80}$/.test(record.id) &&
    Number.isFinite(record.updatedAt) &&
    Array.isArray(record.messages) &&
    record.messages.every(
      (message) =>
        message &&
        typeof message.id === 'string' &&
        typeof message.text === 'string' &&
        (message.role === 'user' || message.role === 'assistant') &&
        (message.status === undefined || message.status === 'error'),
    ) &&
    new Set(record.messages.map((message) => message.id)).size ===
      record.messages.length
  )
}

export function newConversation(
  messages: ChatMessage[] = [],
): SavedConversation {
  return { id: crypto.randomUUID(), messages, updatedAt: Date.now() }
}

/** The fragment stays in the browser and is removed as soon as the web app loads. */
export function expandedChatUrl(
  baseUrl: string,
  conversation: SavedConversation,
) {
  const url = new URL(baseUrl)
  if (
    url.protocol !== 'https:' &&
    !(
      url.protocol === 'http:' &&
      ['localhost', '127.0.0.1'].includes(url.hostname)
    )
  ) {
    throw new Error('Alamat web chatbot harus menggunakan HTTPS.')
  }
  url.hash = `conversation=${encodeURIComponent(JSON.stringify(conversation))}`
  if (url.href.length > 1_000_000)
    throw new Error('Percakapan terlalu panjang untuk dibuka di tab baru.')
  return url.href
}
