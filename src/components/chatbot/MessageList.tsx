import { useEffect, useRef } from 'react'
import type { ChatMessage } from './types'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import './MessageList.css'

export interface MessageListProps {
  messages: ChatMessage[]
  label?: string
  /** Renders the typing indicator after the last message. */
  isAssistantLoading?: boolean
}

export function MessageList({
  messages,
  label = 'Percakapan',
  isAssistantLoading = false,
}: MessageListProps) {
  const listRef = useRef<HTMLUListElement>(null)

  // Keep the newest message (or the typing indicator) in view.
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages, isAssistantLoading])

  return (
    <ul ref={listRef} className="idmc-message-list" aria-label={label}>
      {messages.map(({ id, role, text }) => (
        <MessageBubble key={id} role={role}>
          {text}
        </MessageBubble>
      ))}
      {isAssistantLoading && <TypingIndicator />}
    </ul>
  )
}
