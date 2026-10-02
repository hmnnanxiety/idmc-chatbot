import sendCircleSrc from '../../assets/figma/send-circle.svg'
import sendIconSrc from '../../assets/figma/icon-send.svg'
import { Glyph } from './Glyph'
import './SendButton.css'

export interface SendButtonProps {
  /** Accessible name; the artwork is decorative. */
  label?: string
}

/** Submit button: Figma yellow circle (53px) with the send icon (35px) on top. */
export function SendButton({ label = 'Kirim pesan' }: SendButtonProps) {
  return (
    <button type="submit" className="idmc-send-button" aria-label={label}>
      <img className="idmc-send-button__circle" src={sendCircleSrc} alt="" />
      <span className="idmc-send-button__icon">
        <Glyph src={sendIconSrc} size={35} inset="12.5% 8.34% 12.5% 8.33%" />
      </span>
    </button>
  )
}
