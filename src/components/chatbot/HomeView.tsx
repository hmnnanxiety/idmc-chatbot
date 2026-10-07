import { widgetClasses, viewClasses, footerClasses } from './layout'
import { cn } from '../../lib/utils'
import { ChatInput } from './ChatInput'
import { HeroTitle } from './HeroTitle'
import { SuggestionList } from './SuggestionList'
import { ChatHeader } from './ChatHeader'
import type { ChatUser } from './types'

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
    <section
      className={cn('idmc-chatbot idmc-view idmc-home', widgetClasses, viewClasses)}
      aria-label="Beranda"
    >
      <ChatHeader onOpenHistory={onOpenHistory} onClose={onClose} />

      <main
        className={cn(
          'idmc-home__main',
          '[flex:1_1_auto] [min-block-size:0] flex items-center [inline-size:100%] overflow-y-auto',
          '[overscroll-behavior:contain] short:items-start short:[padding-block-start:var(--idmc-space-3)]',
        )}
      >
        <HeroTitle title="Chatbot Data Publik" tagline="Jelajahi Data, Kenali Yogyakarta." />
      </main>

      <div className={cn('idmc-view__footer', footerClasses)}>
        <SuggestionList items={suggestions} onSelect={onSelectSuggestion} />

        <ChatInput variant="home" placeholder="Tanyakan sesuatu..." onSubmit={onSubmit} />
      </div>
    </section>
  )
}
