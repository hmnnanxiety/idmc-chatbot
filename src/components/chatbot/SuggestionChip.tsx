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
        'inline-flex [flex:0_1_auto] items-center justify-center [gap:var(--idmc-space-1)] [max-inline-size:100%]',
        '[min-block-size:var(--idmc-space-7)] [padding:var(--idmc-space-1)_var(--idmc-space-2)]',
        '[border:var(--idmc-stroke-0)_solid_var(--idmc-color-primary-10-a10)] [border-radius:var(--idmc-radius-full)]',
        '[background:var(--idmc-color-primary-10-a10)] [color:var(--idmc-color-primary-700)] [font:var(--idmc-type-b4)]',
        '[&]:[font-weight:500] [letter-spacing:0] text-start [overflow-wrap:anywhere] cursor-pointer',
        '[transition:background-color_var(--idmc-motion-duration-fast)_var(--idmc-motion-ease-out),_transform_var(--idmc-motion-duration-fast)_var(--idmc-motion-ease-out)]',
        '[@media(hover:_hover)]:[&:hover]:[background:var(--idmc-color-primary-100)]',
        '[&:active]:[transform:scale(0.97)]',
        '[&:focus-visible]:[outline:var(--idmc-stroke-1)_solid_var(--idmc-color-primary-500)]',
        '[&:focus-visible]:[outline-offset:calc(-1_*_var(--idmc-stroke-1))]',
      )}
      onClick={onClick}
    >
      <Glyph src={fileIconSrc} size={14} inset="8.33%" bleed="-4.5%" />
      <span>{label}</span>
    </button>
  )
}
