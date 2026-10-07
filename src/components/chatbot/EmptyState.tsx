import { cn } from '../../lib/utils'

export interface EmptyStateProps {
  message: string
}

/** Quiet text-only state; does not add artwork or change view navigation. */
export function EmptyState({ message }: EmptyStateProps) {
  return (
    <p
      className={cn(
        'idmc-empty-state',
        '[margin:0] [padding:var(--idmc-space-4)_var(--idmc-space-3)] [color:var(--idmc-color-neutral-600)]',
        '[font:var(--idmc-type-b3)] [overflow-wrap:anywhere]',
      )}
    >
      {message}
    </p>
  )
}
