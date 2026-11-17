import { ChatOverlay } from './components/chatbot'
import { ChatPage } from './web/ChatPage'

export default function App() {
  if (new URLSearchParams(window.location.search).get('view') === 'overlay') {
    const historyItems = [
      'Data penduduk DIY',
      'Statistik pendidikan',
      'Indikator ekonomi DIY',
      'Data kesehatan Yogyakarta',
    ].map((title, index) => ({ id: String(index + 1), title }))
    return (
      <ChatOverlay
        user={{ name: 'User', role: 'Pengguna' }}
        suggestions={[
          'Dashboard Koperasi',
          'Data penduduk DIY',
          'Statistik pendidikan',
        ]}
        historyItems={historyItems}
        expandedUrl={window.location.origin}
      />
    )
  }
  return <ChatPage />
}
