import { ConversationView, HomeView } from './components/chatbot'
import type { ChatMessage, ChatUser, TechItem } from './components/chatbot'
import geminiLogo from './assets/figma/tech-gemini.png'
import vercelLogo from './assets/figma/tech-vercel.png'
import supabaseLogo from './assets/figma/tech-supabase.png'
import hostingerLogo from './assets/figma/tech-hostinger.png'
import './App.css'

// Static sample data for the local component showcase only.
const user: ChatUser = { name: 'Hisyam Dimez', role: 'Pengguna' }

const suggestions = ['Dashboard Koperasi', 'Dashboard Koperasi', 'Dashboard Koperasi']

// Logo sizes follow the HiFi: 51px, except the third logo at 44px.
const technologies: TechItem[] = [
  { name: 'Gemini', src: geminiLogo },
  { name: 'Vercel', src: vercelLogo },
  { name: 'Supabase', src: supabaseLogo, size: 44 },
  { name: 'Hostinger', src: hostingerLogo },
]

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
          <HomeView user={user} suggestions={suggestions} technologies={technologies} />
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
