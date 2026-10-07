import { cn } from '../../lib/utils'
import fileIconSrc from '../../assets/figma/icon-file.svg'
import { Glyph } from './Glyph'

export interface SuggestionChipProps {
  label: string
  onClick?: () => void
}

/** The HiFi `button` component (node 1:20940): file icon + label on a tinted pill. */
export function SuggestionChip({ label, onClick }: SuggestionChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'idmc-suggestion-chip',
        'inline-flex [flex:0_0_auto] items-center justify-center [gap:4px] [max-inline-size:max-content]',
        '[padding:3px_7px] overflow-clip [border:0] [border-radius:var(--idmc-radius-full)]',
        '[background:var(--idmc-color-primary-10-a10)] [color:var(--idmc-color-primary-700)] [font-size:11px]',
        '[line-height:1.2] [font-weight:500] [letter-spacing:0] text-center whitespace-nowrap cursor-pointer',
        '[&:focus-visible]:[outline:var(--idmc-stroke-1)_solid_var(--idmc-color-primary-500)]',
        '[&:focus-visible]:[outline-offset:var(--idmc-stroke-1)]',
      )}
      onClick={onClick}
    >
      <Glyph src={fileIconSrc} size={14} inset="8.33%" bleed="-4.5%" />
      <span>{label}</span>
    </button>
  )
}
