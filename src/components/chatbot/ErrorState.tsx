import { cn } from '../../lib/utils'
import type { ReactNode } from 'react'

export interface ErrorStateProps {
  children: ReactNode
}

/** The existing request failure message, announced and styled explicitly. */
export function ErrorState({ children }: ErrorStateProps) {
  return (
    <p
      className={cn(
        'idmc-error-state',
        '[margin:0] [color:var(--idmc-color-primary-700)] whitespace-pre-wrap',
      )}
      role="alert"
    >
      {children}
    </p>
  )
}
