import { widgetClasses, viewClasses, footerClasses } from './layout'
import { cn } from '../../lib/utils'
import { ChatInput } from './ChatInput'
import { MessageList } from './MessageList'
import { ChatHeader } from './ChatHeader'
import type { ChatMessage, ChatUser } from './types'

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
    <section
      className={cn(
        'idmc-chatbot idmc-view idmc-conversation',
        widgetClasses,
        viewClasses,
        '[animation:idmc-view-in_var(--idmc-motion-duration-base)_var(--idmc-motion-ease-out)]',
        '[@media(prefers-reduced-motion:_reduce)]:[animation:none]',
      )}
      aria-label="Percakapan"
    >
      <ChatHeader title="Chatbot Data Publik" onOpenHistory={onOpenHistory} onClose={onClose} />
      <MessageList messages={messages} isAssistantLoading={isAssistantLoading} />
      <div
        className={cn(
          'idmc-view__footer idmc-conversation__footer',
          footerClasses,
          '[padding-block-start:var(--idmc-content-gap)] short:[padding-block-start:var(--idmc-space-1)]',
        )}
      >
        <ChatInput
          variant="chat"
          placeholder="Tanyakan sesuatu..."
          onSubmit={onSend}
          submitDisabled={isAssistantLoading}
          autoFocus
        />
      </div>
    </section>
  )
}
