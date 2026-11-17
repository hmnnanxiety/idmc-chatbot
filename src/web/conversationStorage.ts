import {
  CONVERSATION_PREFIX,
  isConversation,
  newConversation,
} from '../components/chatbot/conversation'
import type { ConversationStore, SavedConversation } from '../components/chatbot/conversation'

export { CONVERSATION_PREFIX }

export function readConversations(prefix = CONVERSATION_PREFIX): SavedConversation[] {
  const records: SavedConversation[] = []
  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index)
    if (!key?.startsWith(prefix)) continue
    try {
      const record: unknown = JSON.parse(localStorage.getItem(key) ?? 'null')
      if (isConversation(record) && record.messages.length) records.push(record)
    } catch {
      /* A damaged record must not prevent opening other conversations. */
    }
  }
  return records.sort((left, right) => right.updatedAt - left.updatedAt)
}

const PREVIEW_PREFIX = 'idmc-preview-conversation-v1:'

export const previewConversationStore: ConversationStore = {
  list: () => readConversations(PREVIEW_PREFIX),
  save: (conversation) => localStorage.setItem(
    PREVIEW_PREFIX + conversation.id, JSON.stringify(conversation),
  ),
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
