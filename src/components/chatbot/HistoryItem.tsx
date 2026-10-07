import { cn } from '../../lib/utils'
import type { ChatHistoryItem } from './types'

export interface HistoryItemProps {
  item: ChatHistoryItem
  selected?: boolean
  onSelect?: (id: string) => void
}

export function HistoryItem({ item, selected = false, onSelect }: HistoryItemProps) {
  return (
    <li>
      <button
        type="button"
        className={cn(
          'idmc-history__item',
          'block [inline-size:100%] [padding:var(--idmc-space-2)_var(--idmc-space-3)] overflow-hidden [border:0]',
          '[border-radius:var(--idmc-radius-2)] [color:var(--idmc-color-neutral-900)]',
          '[font:var(--idmc-type-b3)] [letter-spacing:0] text-start text-ellipsis whitespace-nowrap',
          'cursor-pointer',
          selected
            ? '[background:var(--idmc-color-neutral-400)] [&:hover]:[background:var(--idmc-color-neutral-400)]'
            : '[background:transparent] [&:hover]:[background:var(--idmc-color-neutral-300)]',
          '[&:focus-visible]:[outline:var(--idmc-stroke-1)_solid_var(--idmc-color-primary-500)]',
          '[&:focus-visible]:[outline-offset:calc(-1_*_var(--idmc-stroke-1))]',
        )}
        title={item.title}
        aria-current={selected ? 'true' : undefined}
        onClick={() => onSelect?.(item.id)}
      >
        {item.title}
      </button>
    </li>
  )
}
