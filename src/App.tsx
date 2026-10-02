import { ChatOverlay } from './components/chatbot'
import type { ChatHistoryItem, ChatUser } from './components/chatbot'
import './App.css'

// Static sample data for the local host page only.
const user: ChatUser = { name: 'User', role: 'Pengguna' }

const suggestions = ['Dashboard Koperasi', 'Dashboard Koperasi', 'Dashboard Koperasi']

// Mock History list. Not persisted; selecting a row only changes its highlight.
const historyItems: ChatHistoryItem[] = [
  { id: '1', title: 'Data penduduk DIY' },
  { id: '2', title: 'Statistik pendidikan' },
  { id: '3', title: 'Indikator ekonomi DIY' },
  { id: '4', title: 'Data kesehatan Yogyakarta' },
]

// Empty host page standing in for the dashboard the widget will float over.
function App() {
  return (
    <div className="idmc-host">
      <ChatOverlay user={user} suggestions={suggestions} historyItems={historyItems} />
    </div>
  )
}

export default App
