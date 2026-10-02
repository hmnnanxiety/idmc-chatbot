import type { ReactNode } from 'react'
import type { MessageRole } from './types'
import './MessageBubble.css'

export interface MessageBubbleProps {
  role: MessageRole
  children: ReactNode
}

/**
 * One chat message. The HiFi only shows empty placeholder boxes: right-aligned
 * Primary/100 (400px) and left-aligned Secondary/100 (530px). Mapping them to
 * user and assistant respectively is an assumption.
 */
export function MessageBubble({ role, children }: MessageBubbleProps) {
  return (
    <li className={`idmc-message idmc-message--${role}`}>
      <div className="idmc-message__bubble">{children}</div>
    </li>
  )
}
