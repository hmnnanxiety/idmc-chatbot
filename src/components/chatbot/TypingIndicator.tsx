import { MessageBubble } from './MessageBubble'
import './TypingIndicator.css'

export interface TypingIndicatorProps {
  /** Accessible text announced while the assistant is loading. */
  label?: string
}

/**
 * Assistant-side bubble with three animated dots. Pure presentation: it does not
 * know why the assistant is loading, and nothing here fakes a delay or a reply.
 */
export function TypingIndicator({ label = 'Asisten sedang mengetik' }: TypingIndicatorProps) {
  return (
    <MessageBubble role="assistant">
      <span className="idmc-typing" role="status">
        <span className="idmc-typing__dot" aria-hidden="true" />
        <span className="idmc-typing__dot" aria-hidden="true" />
        <span className="idmc-typing__dot" aria-hidden="true" />
        <span className="idmc-visually-hidden">{label}</span>
      </span>
    </MessageBubble>
  )
}
