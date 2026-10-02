import { ChatInput } from './ChatInput'
import { MessageList } from './MessageList'
import { TopBar, TopBarActions } from './TopBar'
import type { ChatMessage, ChatUser } from './types'
import './chatbot.css'
import './ConversationView.css'

export interface ConversationViewProps {
  user: ChatUser
  messages: ChatMessage[]
  /** Shows the typing indicator after the last message. UI only: the host owns this state. */
  isAssistantLoading?: boolean
  /** Called with the typed text when the composer is submitted. */
  onSend?: (text: string) => void
  /** Shows the header close button when provided. */
  onClose?: () => void
  /** Shows the header history button when provided. */
  onOpenHistory?: () => void
}

/** Chat state (HiFi node 1:20907). The sidebar is hidden in the HiFi and not implemented. */
export function ConversationView({
  messages,
  isAssistantLoading = false,
  onSend,
  onClose,
  onOpenHistory,
}: ConversationViewProps) {
  return (
    <section className="idmc-chatbot idmc-view idmc-conversation" aria-label="Percakapan">
      <TopBar
        title="Chatbot Data Publik"
        actions={<TopBarActions onOpenHistory={onOpenHistory} onClose={onClose} />}
      />
      <MessageList messages={messages} isAssistantLoading={isAssistantLoading} />
      <div className="idmc-view__footer idmc-conversation__footer">
        <ChatInput variant="chat" onSubmit={onSend} autoFocus />
      </div>
    </section>
  )
}
