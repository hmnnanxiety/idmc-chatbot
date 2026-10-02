import { ChatInput } from './ChatInput'
import { MessageList } from './MessageList'
import { TopBar } from './TopBar'
import type { ChatMessage, ChatUser } from './types'
import './chatbot.css'
import './ConversationView.css'

export interface ConversationViewProps {
  user: ChatUser
  messages: ChatMessage[]
}

/** Chat state (HiFi node 1:20907). The sidebar is hidden in the HiFi and not implemented. */
export function ConversationView({ user, messages }: ConversationViewProps) {
  return (
    <section className="idmc-chatbot idmc-conversation" aria-label="Percakapan">
      <TopBar user={user} variant="chat" />
      <MessageList messages={messages} />
      <div className="idmc-conversation__composer">
        <ChatInput variant="chat" />
      </div>
    </section>
  )
}
