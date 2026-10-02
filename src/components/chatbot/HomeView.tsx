import { ChatInput } from './ChatInput'
import { HeroTitle } from './HeroTitle'
import { SuggestionList } from './SuggestionList'
import { TopBar, TopBarActions } from './TopBar'
import type { ChatUser } from './types'
import './chatbot.css'
import './HomeView.css'

export interface HomeViewProps {
  user: ChatUser
  suggestions: string[]
  /** Called with the typed text when the input is submitted. */
  onSubmit?: (text: string) => void
  /** Called with the chip label when a suggestion is clicked. */
  onSelectSuggestion?: (text: string) => void
  /** Shows the header close button when provided. */
  onClose?: () => void
  /** Shows the header history button when provided. */
  onOpenHistory?: () => void
}

/** Home state (HiFi node 1:20867). The sidebar is intentionally not implemented. */
export function HomeView({
  suggestions,
  onSubmit,
  onSelectSuggestion,
  onClose,
  onOpenHistory,
}: HomeViewProps) {
  return (
    <section className="idmc-chatbot idmc-view idmc-home" aria-label="Beranda">
      <TopBar actions={<TopBarActions onOpenHistory={onOpenHistory} onClose={onClose} />} />

      <main className="idmc-home__main">
        <HeroTitle
          title="Chatbot Data Publik"
          tagline="Jelajahi Data, Kenali Yogyakarta."
        />
      </main>

      <div className="idmc-view__footer">
        <SuggestionList
          items={suggestions}
          onSelect={onSelectSuggestion}
        />

        <ChatInput
          variant="home"
          placeholder="Tanyakan sesuatu..."
          onSubmit={onSubmit}
        />
      </div>
    </section>
  )
}
