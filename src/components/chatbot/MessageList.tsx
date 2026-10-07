import { cn } from '../../lib/utils'
import { useEffect, useRef } from 'react'
import type { ChatMessage } from './types'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { EmptyState } from './EmptyState'
import { MarkdownContent } from './MarkdownContent'

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
    <ul
      ref={listRef}
      className={cn(
        'idmc-message-list',
        'flex [flex:1_1_0] flex-col items-stretch [gap:10px] [inline-size:100%] [min-block-size:0]',
        '[min-inline-size:0] [margin:0] [padding:var(--idmc-space-4)_var(--idmc-space-3)] overflow-x-hidden',
        'overflow-y-auto [overscroll-behavior:contain] [background:var(--idmc-color-neutral-100)]',
        '[border-radius:var(--idmc-radius-4)] list-none [scrollbar-width:thin]',
      )}
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      aria-label={label}
    >
      {messages.length === 0 && !isAssistantLoading && (
        <li>
          <EmptyState message="Belum ada pesan. Mulai dengan pertanyaan tentang data DIY." />
        </li>
      )}
      {messages.map(({ id, role, text, status }) => (
        <MessageBubble key={id} role={role} status={status}>
          {role === 'assistant' && status !== 'error' ? (
            <MarkdownContent text={text} />
          ) : (
            <span className={cn('idmc-message__plain-text', 'whitespace-pre-wrap')}>{text}</span>
          )}
        </MessageBubble>
      ))}
      {isAssistantLoading && <TypingIndicator />}
    </ul>
  )
}
