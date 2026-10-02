import { ChatInput } from './ChatInput'
import { HeroTitle } from './HeroTitle'
import { SuggestionList } from './SuggestionList'
import { TopBar } from './TopBar'
import type { ChatUser } from './types'
import './chatbot.css'
import './HomeView.css'

export interface HomeViewProps {
  user: ChatUser
  suggestions: string[]
}

/** Home state (HiFi node 1:20867). The sidebar is intentionally not implemented. */
export function HomeView({ user, suggestions }: HomeViewProps) {
  return (
    <section className="idmc-chatbot idmc-home" aria-label="Beranda">
      <TopBar user={user} variant="home" />
      <div className="idmc-home__hero">
        <HeroTitle
          title="Chatbot Data Publik"
          tagline="Jelajahi Data, Kenali Yogyakarta."
        />
        <ChatInput variant="home" />
        <SuggestionList items={suggestions} />
      </div>
    </section>
  )
}
