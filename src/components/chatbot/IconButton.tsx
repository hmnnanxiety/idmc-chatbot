import { cn } from '../../lib/utils'
import { Glyph } from './Glyph'

export interface IconButtonProps {
  /** Accessible name; the icon itself is decorative. */
  label: string
  /** Exported Figma SVG of the icon artwork. */
  iconSrc: string
  /** Icon artwork inset inside the 47px icon box. Defaults to the settings icon inset. */
  iconInset?: string
  onClick?: () => void
}

export function IconButton({
  label,
  iconSrc,
  iconInset = '8.33% 8.33% 8.33% 12.5%',
  onClick,
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'idmc-icon-button',
        'inline-flex flex-none items-center justify-center [inline-size:var(--idmc-header-action-size)]',
        '[block-size:var(--idmc-header-action-size)] [padding:0] overflow-clip [border:0] [border-radius:44px]',
        '[background:var(--idmc-color-neutral-100)] cursor-pointer',
        '[&:focus-visible]:[outline:var(--idmc-stroke-1)_solid_var(--idmc-color-primary-500)]',
        '[&:focus-visible]:[outline-offset:var(--idmc-stroke-1)]',
      )}
      aria-label={label}
      onClick={onClick}
    >
      <Glyph src={iconSrc} size={24} inset={iconInset} />
    </button>
  )
}
