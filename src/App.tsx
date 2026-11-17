import { ChatOverlay } from './components/chatbot'
import { ChatPage } from './web/ChatPage'
import { previewConversationStore } from './web/conversationStorage'

export default function App() {
  if (new URLSearchParams(window.location.search).get('view') === 'overlay') {
    return (
      <ChatOverlay
        user={{ name: 'User', role: 'Pengguna' }}
        suggestions={[
          'Dashboard Koperasi',
          'Data penduduk DIY',
          'Statistik pendidikan',
        ]}
        conversationStore={previewConversationStore}
        expandedUrl={new URL('.', window.location.href).href}
      />
    )
  }
  return <ChatPage />
}
