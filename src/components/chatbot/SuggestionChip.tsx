import fileIconSrc from '../../assets/figma/icon-file.svg'
import { Glyph } from './Glyph'
import './SuggestionChip.css'

export interface SuggestionChipProps {
  label: string
  onClick?: () => void
}

/** The HiFi `button` component (node 1:20940): file icon + label on a tinted pill. */
export function SuggestionChip({ label, onClick }: SuggestionChipProps) {
  return (
    <button type="button" className="idmc-suggestion-chip" onClick={onClick}>
      <Glyph src={fileIconSrc} size={14} inset="8.33%" bleed="-4.5%" />
      <span>{label}</span>
    </button>
  )
}
