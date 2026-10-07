import { visuallyHiddenClasses } from './layout'
import { cn } from '../../lib/utils'
import { MessageBubble } from './MessageBubble'

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
      <span
        className={cn(
          'idmc-typing',
          'relative inline-flex items-center [gap:var(--idmc-space-1)] [--idmc-typing-dot-size:6px]',
          '[block-size:24px]',
        )}
        role="status"
      >
        <span
          className={cn(
            'idmc-typing__dot',
            'flex-none [inline-size:var(--idmc-typing-dot-size)] [block-size:var(--idmc-typing-dot-size)]',
            '[border-radius:var(--idmc-radius-full)] [background:var(--idmc-color-neutral-600)]',
            '[animation:idmc-typing-dot_1200ms_ease-in-out_infinite] [&:nth-of-type(2)]:[animation-delay:160ms]',
            '[&:nth-of-type(3)]:[animation-delay:320ms]',
          )}
          aria-hidden="true"
        />
        <span
          className={cn(
            'idmc-typing__dot',
            'flex-none [inline-size:var(--idmc-typing-dot-size)] [block-size:var(--idmc-typing-dot-size)]',
            '[border-radius:var(--idmc-radius-full)] [background:var(--idmc-color-neutral-600)]',
            '[animation:idmc-typing-dot_1200ms_ease-in-out_infinite] [&:nth-of-type(2)]:[animation-delay:160ms]',
            '[&:nth-of-type(3)]:[animation-delay:320ms]',
          )}
          aria-hidden="true"
        />
        <span
          className={cn(
            'idmc-typing__dot',
            'flex-none [inline-size:var(--idmc-typing-dot-size)] [block-size:var(--idmc-typing-dot-size)]',
            '[border-radius:var(--idmc-radius-full)] [background:var(--idmc-color-neutral-600)]',
            '[animation:idmc-typing-dot_1200ms_ease-in-out_infinite] [&:nth-of-type(2)]:[animation-delay:160ms]',
            '[&:nth-of-type(3)]:[animation-delay:320ms]',
          )}
          aria-hidden="true"
        />
        <span className={cn('idmc-visually-hidden', visuallyHiddenClasses)}>{label}</span>
      </span>
    </MessageBubble>
  )
}
