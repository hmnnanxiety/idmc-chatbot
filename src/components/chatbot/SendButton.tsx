import { cn } from '../../lib/utils'
import sendCircleSrc from '../../assets/figma/send-circle.svg'
import sendIconSrc from '../../assets/figma/icon-send.svg'
import { Glyph } from './Glyph'

export interface SendButtonProps {
  /** Accessible name; the artwork is decorative. */
  label?: string
  disabled?: boolean
}

/** Submit button: Figma yellow circle (53px) with the send icon (35px) on top. */
export function SendButton({ label = 'Kirim pesan', disabled = false }: SendButtonProps) {
  return (
    <button
      type="submit"
      className={cn(
        'idmc-send-button',
        'relative flex-none [inline-size:44px] [block-size:44px] [padding:0] [margin:0] [border:0]',
        '[border-radius:var(--idmc-radius-full)] [background:none] cursor-pointer',
        '[&:focus-visible]:[outline:var(--idmc-stroke-1)_solid_var(--idmc-color-secondary-500)]',
        '[&:focus-visible]:[outline-offset:var(--idmc-stroke-1)] [&:disabled]:cursor-not-allowed',
        '[&:disabled]:[opacity:0.55]',
      )}
      aria-label={label}
      disabled={disabled}
    >
      <img
        className={cn(
          'idmc-send-button__circle',
          'absolute [inset:0] block [inline-size:100%] [block-size:100%] [max-inline-size:none]',
        )}
        src={sendCircleSrc}
        alt=""
      />
      <span
        className={cn(
          'idmc-send-button__icon',
          'absolute [inset-inline-start:50%] [inset-block-start:calc(50%_-_1px)]',
          '[transform:translate(-50%,_-50%)]',
        )}
      >
        <Glyph src={sendIconSrc} size={22} inset="12.5% 8.34% 12.5% 8.33%" />
      </span>
    </button>
  )
}
