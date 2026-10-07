import { cn } from '../../lib/utils'
import type { ReactNode } from 'react'
import type { MessageRole } from './types'
import { ErrorState } from './ErrorState'

export interface MessageBubbleProps {
  role: MessageRole
  children: ReactNode
  status?: 'error'
}

/**
 * One chat message. The HiFi only shows empty placeholder boxes: right-aligned
 * Primary/100 (400px) and left-aligned Secondary/100 (530px). Mapping them to
 * user and assistant respectively is an assumption.
 */
export function MessageBubble({ role, children, status }: MessageBubbleProps) {
  return (
    <li
      className={cn(
        `idmc-message idmc-message--${role}`,
        'flex flex-none [inline-size:100%] [margin:0] [padding:0] list-none',
        '[animation:idmc-message-in_var(--idmc-motion-duration-base)_var(--idmc-motion-ease-out)]',
        role === 'user' ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        className={cn(
          'idmc-message__bubble',
          '[inline-size:fit-content] [min-inline-size:0]',
          '[padding:var(--idmc-space-3)_var(--idmc-space-4)] [border-radius:var(--idmc-radius-4)]',
          '[color:var(--idmc-color-neutral-900)]',
          '[font:var(--idmc-type-b2)] [letter-spacing:0] [overflow-wrap:anywhere]',
          status === 'error' && '[border:var(--idmc-stroke-0)_solid_var(--idmc-color-primary-300)]',
          role === 'assistant'
            ? '[max-inline-size:82%] [background:var(--idmc-color-secondary-100)]'
            : '[max-inline-size:78%] [background:var(--idmc-color-primary-100)]',
        )}
        data-status={status}
      >
        {status === 'error' ? <ErrorState>{children}</ErrorState> : children}
      </div>
    </li>
  )
}
