import { cn } from '../../lib/utils'
import type { CSSProperties } from 'react'
import { SuggestionChip } from './SuggestionChip'

export interface SuggestionListProps {
  items: string[]
  onSelect?: (item: string) => void
}

export function SuggestionList({ items, onSelect }: SuggestionListProps) {
  return (
    <ul
      className={cn(
        'idmc-suggestion-list',
        'flex flex-wrap items-center justify-start [gap:var(--idmc-space-2)] [inline-size:100%] [margin:0]',
        '[padding:var(--idmc-space-1)_0] [max-block-size:144px] overflow-x-hidden overflow-y-auto',
        'list-none [scrollbar-width:thin] [overscroll-behavior:contain]',
      )}
    >
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className={cn(
            'idmc-suggestion-list__item',
            'flex [flex:0_1_auto] [min-inline-size:0] [max-inline-size:100%] [margin:0] [padding:0]',
            '[animation:idmc-content-in_var(--idmc-motion-duration-enter)_var(--idmc-motion-ease-out)_var(--idmc-suggestion-delay)_backwards]',
          )}
          style={{ '--idmc-suggestion-delay': `${180 + Math.min(index, 5) * 45}ms` } as CSSProperties}
        >
          <SuggestionChip label={item} onClick={() => onSelect?.(item)} />
        </li>
      ))}
    </ul>
  )
}
