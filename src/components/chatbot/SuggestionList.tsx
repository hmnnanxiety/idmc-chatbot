import { SuggestionChip } from './SuggestionChip'
import './SuggestionList.css'

export interface SuggestionListProps {
  items: string[]
  onSelect?: (item: string) => void
}

export function SuggestionList({ items, onSelect }: SuggestionListProps) {
  return (
    <ul className="idmc-suggestion-list">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="idmc-suggestion-list__item">
          <SuggestionChip label={item} onClick={() => onSelect?.(item)} />
        </li>
      ))}
    </ul>
  )
}
