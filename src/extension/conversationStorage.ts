import { browser } from 'wxt/browser'
import { CONVERSATION_PREFIX, isConversation } from '../components/chatbot/conversation'
import type { ConversationStore } from '../components/chatbot/conversation'

export const extensionConversationStore: ConversationStore = {
  async list() {
    const records = await browser.storage.local.get(null)
    return Object.entries(records)
      .filter(([key]) => key.startsWith(CONVERSATION_PREFIX))
      .map(([, record]) => record)
      .filter(isConversation)
      .filter((record) => record.messages.length > 0)
  },
  async save(conversation) {
    // One key per chat so separate extension tabs can save independently.
    await browser.storage.local.set({
      [CONVERSATION_PREFIX + conversation.id]: conversation,
    })
  },
}
