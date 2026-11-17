import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ChatOverlay } from '../components/chatbot/ChatOverlay'
import { sendExtensionChatMessage } from './chatTransport'
import { extensionConversationStore } from './conversationStorage'

/** Mount the widget inside the extension's isolated shadow root. */
export function mountChatbot(container: HTMLElement) {
  container.lang = 'id'
  const app = document.createElement('div')
  container.append(app)
  const root = createRoot(app)
  root.render(createElement(ChatOverlay, {
    user: { name: 'User', role: 'Pengguna' },
    suggestions: ['Dashboard Koperasi', 'Data penduduk DIY', 'Statistik pendidikan'],
    conversationStore: extensionConversationStore,
    requestReply: sendExtensionChatMessage,
    expandedUrl: import.meta.env.WXT_WEB_APP_URL || (import.meta.env.DEV ? 'http://localhost:5173' : undefined),
  }))
  return root
}
