import { Glyph } from './Glyph'
import './IconButton.css'

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
      className="idmc-icon-button"
      aria-label={label}
      onClick={onClick}
    >
      <Glyph src={iconSrc} size={47} inset={iconInset} />
    </button>
  )
}
