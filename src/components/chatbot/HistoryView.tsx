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
  onSelect?: (id: string) => void
  onNewChat?: () => void
  pending?: boolean
  error?: string
  onBack: () => void
  onMaximize?: () => void
  maximizeDisabled?: boolean
  onClose?: () => void
}

/** History state: a compact "Recents" list. An internal widget view, not a sidebar or route. */
export function HistoryView({ items, selectedId, onSelect, onNewChat, pending, error, onBack, onClose, onMaximize, maximizeDisabled }: HistoryViewProps) {
  const labelId = useId()

  return (
    <section
      className={cn('idmc-chatbot idmc-view idmc-history', widgetClasses, viewClasses)}
      aria-label="Riwayat chat"
    >
      <ChatHeader onMaximize={onMaximize} maximizeDisabled={maximizeDisabled} title="Riwayat Chat" onBack={onBack} onClose={onClose} />
      {onNewChat && (
        <button
          type="button"
          onClick={onNewChat}
          disabled={pending}
          className="flex-none self-start rounded-lg border-0 px-3 py-2 text-sm font-medium cursor-pointer [background:var(--idmc-color-primary-10-a10)] [color:var(--idmc-color-primary-500)] disabled:opacity-50 disabled:cursor-wait"
        >
          Chat baru
        </button>
      )}
      {pending && <p role="status" className="text-sm">Tunggu jawaban selesai untuk berpindah chat.</p>}
      {error && <p role="status" className="text-sm">{error}</p>}

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
              '[animation:idmc-view-in_var(--idmc-motion-duration-content)_var(--idmc-motion-ease-out)_60ms_backwards]',
            )}
            id={labelId}
          >
            Terbaru
          </h2>
          <ul
            className={cn(
              'idmc-history__list',
              'flex [flex:1_1_0] flex-col [gap:var(--idmc-space-0)] [min-block-size:0] [margin:0] [padding:0]',
              'overflow-x-hidden overflow-y-auto [overscroll-behavior:contain] [scrollbar-width:thin] list-none',
            )}
            aria-labelledby={labelId}
          >
            {items.map((item, index) => (
              <HistoryItem
                key={item.id}
                item={item}
                selected={item.id === selectedId}
                onSelect={onSelect}
                disabled={pending}
                entranceIndex={index}
              />
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
