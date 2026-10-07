import { cn } from '../../lib/utils'
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
        'flex flex-nowrap items-center justify-start [gap:var(--idmc-space-2)] [inline-size:100%] [margin:0]',
        '[padding:0] overflow-x-auto overflow-y-hidden list-none [scrollbar-width:none]',
        '[&::-webkit-scrollbar]:[display:none]',
      )}
    >
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className={cn(
            'idmc-suggestion-list__item',
            'flex [flex:0_0_auto] [min-inline-size:max-content] [margin:0] [padding:0]',
          )}
        >
          <SuggestionChip label={item} onClick={() => onSelect?.(item)} />
        </li>
      ))}
    </ul>
  )
}
