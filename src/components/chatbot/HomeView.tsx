import { ChatInput } from './ChatInput'
import { HeroTitle } from './HeroTitle'
import { SuggestionList } from './SuggestionList'
import { TechStack } from './TechStack'
import { TopBar } from './TopBar'
import type { ChatUser, TechItem } from './types'
import './chatbot.css'
import './HomeView.css'

export interface HomeViewProps {
  user: ChatUser
  suggestions: string[]
  technologies: TechItem[]
}

/** Home state (HiFi node 1:20867). The sidebar is intentionally not implemented. */
export function HomeView({ user, suggestions, technologies }: HomeViewProps) {
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
      <TechStack title="Technology behind the experience" items={technologies} />
    </section>
  )
}
