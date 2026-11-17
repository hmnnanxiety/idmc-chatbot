import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { ChatOverlay } from '../components/chatbot/ChatOverlay'
import { sendExtensionChatMessage } from './chatTransport'

/** Mount the widget directly: App.tsx is a full-page development preview. */
export function mountChatbot(container: HTMLElement) {
  container.lang = 'id'
  const app = document.createElement('div')
  container.append(app)
  const root = createRoot(app)
  root.render(createElement(ChatOverlay, {
    user: { name: 'User', role: 'Pengguna' },
    suggestions: ['Dashboard Koperasi', 'Data penduduk DIY', 'Statistik pendidikan'],
    // No sample history is presented as an actual saved conversation.
    historyItems: [],
    requestReply: sendExtensionChatMessage,
    expandedUrl: import.meta.env.WXT_WEB_APP_URL || (import.meta.env.DEV ? 'http://localhost:5173' : undefined),
  }))
  return root
}
