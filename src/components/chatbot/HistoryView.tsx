import { widgetClasses, viewClasses } from './layout'
import { cn } from '../../lib/utils'
import { useId } from 'react'
import { ChatHeader } from './ChatHeader'
import { EmptyState } from './EmptyState'
import { HistoryItem } from './HistoryItem'
import type { ChatHistoryItem } from './types'

export interface HistoryViewProps {
  items: ChatHistoryItem[]
  /** The current conversation; drawn with the stronger background. */
  selectedId?: string | null
  /** Visual selection only for now: no conversation is restored. */
  onSelect?: (id: string) => void
  onBack: () => void
  onClose?: () => void
}

/** History state: a compact "Recents" list. An internal widget view, not a sidebar or route. */
export function HistoryView({ items, selectedId, onSelect, onBack, onClose }: HistoryViewProps) {
  const labelId = useId()

  return (
    <section
      className={cn('idmc-chatbot idmc-view idmc-history', widgetClasses, viewClasses)}
      aria-label="Riwayat chat"
    >
      <ChatHeader title="Riwayat Chat" onBack={onBack} onClose={onClose} />

      {items.length === 0 ? (
        <EmptyState message="Belum ada riwayat percakapan." />
      ) : (
        <div
          className={cn(
            'idmc-history__body',
            'flex [flex:1_1_0] flex-col [min-block-size:0] [padding-block-start:var(--idmc-content-gap)]',
          )}
        >
          <h2
            className={cn(
              'idmc-history__label',
              'flex-none [margin:0] [padding:var(--idmc-space-1)_var(--idmc-space-3)]',
              '[color:var(--idmc-color-neutral-600)] [font:var(--idmc-type-b4)] [&]:[font-weight:600]',
              '[letter-spacing:0]',
            )}
            id={labelId}
          >
            Recents
          </h2>
          <ul
            className={cn(
              'idmc-history__list',
              'flex [flex:1_1_0] flex-col [gap:var(--idmc-space-0)] [min-block-size:0] [margin:0] [padding:0]',
              'overflow-x-hidden overflow-y-auto [overscroll-behavior:contain] [scrollbar-width:thin] list-none',
            )}
            aria-labelledby={labelId}
          >
            {items.map((item) => (
              <HistoryItem
                key={item.id}
                item={item}
                selected={item.id === selectedId}
                onSelect={onSelect}
              />
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
