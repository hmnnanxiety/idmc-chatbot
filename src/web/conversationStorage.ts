import {
  isConversation,
  newConversation,
} from '../components/chatbot/conversation'
import type { SavedConversation } from '../components/chatbot/conversation'

export const CONVERSATION_PREFIX = 'idmc-conversation-v1:'

export function readConversations(): SavedConversation[] {
  const records: SavedConversation[] = []
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index)
    if (!key?.startsWith(CONVERSATION_PREFIX)) continue
    try {
      const record: unknown = JSON.parse(localStorage.getItem(key) ?? 'null')
      if (isConversation(record) && record.messages.length) records.push(record)
    } catch {
      /* A damaged record must not prevent opening other conversations. */
    }
  }
  return records.sort((left, right) => right.updatedAt - left.updatedAt)
}

export function initialConversation(): {
  conversation: SavedConversation
  error?: string
} {
  const payload = new URLSearchParams(window.location.hash.slice(1)).get(
    'conversation',
  )
  if (!payload) return { conversation: newConversation() }
  try {
    const record: unknown = JSON.parse(payload)
    if (isConversation(record)) return { conversation: record }
  } catch {
    /* Show an actionable error for invalid handoffs. */
  }
  return {
    conversation: newConversation(),
    error: 'Percakapan gagal dibuka. Coba maximize kembali dari overlay.',
  }
}
