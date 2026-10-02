import { useId } from 'react'
import backIconSrc from '../../assets/icon-back.svg'
import { IconButton } from './IconButton'
import { TopBar, TopBarActions } from './TopBar'
import type { ChatHistoryItem } from './types'
import './chatbot.css'
import './HistoryView.css'

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
    <section className="idmc-chatbot idmc-history" aria-label="Riwayat chat">
      <TopBar
        leading={
          <IconButton label="Kembali" iconSrc={backIconSrc} iconInset="8.33%" onClick={onBack} />
        }
        title="Riwayat Chat"
        actions={<TopBarActions onClose={onClose} />}
      />

      {items.length === 0 ? (
        <p className="idmc-history__empty">Belum ada riwayat percakapan.</p>
      ) : (
        <div className="idmc-history__body">
          <h2 className="idmc-history__label" id={labelId}>
            Recents
          </h2>
          <ul className="idmc-history__list" aria-labelledby={labelId}>
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="idmc-history__item"
                  aria-current={item.id === selectedId ? 'true' : undefined}
                  onClick={() => onSelect?.(item.id)}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
