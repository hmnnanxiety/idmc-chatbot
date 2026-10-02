import { ConversationView, HomeView } from './components/chatbot'
import type { ChatMessage, ChatUser } from './components/chatbot'
import './App.css'

// Static sample data for the local component showcase only.
const user: ChatUser = { name: 'Hisyam Dimez', role: 'Pengguna' }

const suggestions = ['Dashboard Koperasi', 'Dashboard Koperasi', 'Dashboard Koperasi']

const messages: ChatMessage[] = [
  { id: 'm1', role: 'user', text: 'Contoh pertanyaan dari pengguna.' },
  { id: 'm2', role: 'assistant', text: 'Contoh jawaban dari chatbot.' },
  { id: 'm3', role: 'user', text: 'Contoh pertanyaan lanjutan dari pengguna.' },
  { id: 'm4', role: 'assistant', text: 'Contoh jawaban lanjutan dari chatbot.' },
]

function App() {
  return (
    <div className="idmc-preview">
      <section className="idmc-preview__section">
        <p className="idmc-preview__label">Home (HiFi 1:20867, 1140 x 1078)</p>
        <div className="idmc-preview__frame idmc-preview__frame--home">
          <HomeView user={user} suggestions={suggestions} />
        </div>
      </section>

      <section className="idmc-preview__section">
        <p className="idmc-preview__label">Conversation (HiFi 1:20907, 1440 x 1080)</p>
        <div className="idmc-preview__frame idmc-preview__frame--chat">
          <ConversationView user={user} messages={messages} />
        </div>
      </section>
    </div>
  )
}

export default App
