import { useEffect, useRef } from 'react'
import type { ChatMessage } from './types'
import { MessageBubble } from './MessageBubble'
import './MessageList.css'

export interface MessageListProps {
  messages: ChatMessage[]
  label?: string
}

export function MessageList({ messages, label = 'Percakapan' }: MessageListProps) {
  const listRef = useRef<HTMLUListElement>(null)

  // Keep the newest message in view.
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages])

  return (
    <ul ref={listRef} className="idmc-message-list" aria-label={label}>
      {messages.map(({ id, role, text }) => (
        <MessageBubble key={id} role={role}>
          {text}
        </MessageBubble>
      ))}
    </ul>
  )
}
