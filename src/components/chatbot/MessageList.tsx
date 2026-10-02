import type { ChatMessage } from './types'
import { MessageBubble } from './MessageBubble'
import './MessageList.css'

export interface MessageListProps {
  messages: ChatMessage[]
  label?: string
}

export function MessageList({ messages, label = 'Percakapan' }: MessageListProps) {
  return (
    <ul className="idmc-message-list" aria-label={label}>
      {messages.map(({ id, role, text }) => (
        <MessageBubble key={id} role={role}>
          {text}
        </MessageBubble>
      ))}
    </ul>
  )
}
