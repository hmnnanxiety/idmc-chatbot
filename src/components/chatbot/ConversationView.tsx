import { ChatInput } from './ChatInput'
import { MessageList } from './MessageList'
import { TopBar, TopBarActions } from './TopBar'
import type { ChatMessage, ChatUser } from './types'
import './chatbot.css'
import './ConversationView.css'

export interface ConversationViewProps {
  user: ChatUser
  messages: ChatMessage[]
  /** Called with the typed text when the composer is submitted. */
  onSend?: (text: string) => void
  /** Shows the header close button when provided. */
  onClose?: () => void
  /** Shows the header history button when provided. */
  onOpenHistory?: () => void
}

/** Chat state (HiFi node 1:20907). The sidebar is hidden in the HiFi and not implemented. */
export function ConversationView({ messages, onSend, onClose, onOpenHistory }: ConversationViewProps) {
  return (
    <section className="idmc-chatbot idmc-conversation" aria-label="Percakapan">
      <TopBar
        title="Chatbot Data Publik"
        actions={<TopBarActions onOpenHistory={onOpenHistory} onClose={onClose} />}
      />
      <MessageList messages={messages} />
      <div className="idmc-conversation__composer">
        <ChatInput variant="chat" onSubmit={onSend} autoFocus />
      </div>
    </section>
  )
}
