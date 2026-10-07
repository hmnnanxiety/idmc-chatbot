import { cn } from '../../lib/utils'
import { forwardRef } from 'react'
import chatbotIcon from '../../assets/figma/chatbot-icon.svg'

export interface ChatLauncherProps {
  onOpen: () => void
}

export const ChatLauncher = forwardRef<HTMLButtonElement, ChatLauncherProps>(function ChatLauncher(
  { onOpen },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'idmc-launcher',
        'fixed [inset-block-end:var(--idmc-overlay-inset-end)]',
        '[inset-inline-end:var(--idmc-overlay-inset-inline)] [z-index:1001] inline-flex items-center',
        'justify-center [inline-size:var(--idmc-overlay-launcher-size)]',
        '[block-size:var(--idmc-overlay-launcher-size)] [padding:0] [border:0]',
        '[border-radius:var(--idmc-radius-full)] [background:var(--idmc-color-neutral-100)]',
        '[box-shadow:var(--idmc-shadow-e3)] cursor-pointer',
        '[transition:background-color_var(--idmc-motion-duration-fast)_var(--idmc-motion-ease-out),_transform_var(--idmc-motion-duration-fast)_var(--idmc-motion-ease-out)]',
        '[animation:idmc-launcher-in_var(--idmc-motion-duration-fast)_var(--idmc-motion-ease-out)]',
        '[&:hover]:[background:var(--idmc-color-neutral-200)]',
        '[@media(hover:_hover)]:[&:hover]:[transform:translateY(calc(-1_*_var(--idmc-space-0)))]',
        '[&:active]:[transform:scale(0.97)]',
        '[&:focus-visible]:[outline:var(--idmc-stroke-2)_solid_var(--idmc-color-primary-700)]',
        '[&:focus-visible]:[outline-offset:var(--idmc-stroke-1)]',
        '[@media(prefers-reduced-motion:_reduce)]:[animation:none]',
        '[@media(prefers-reduced-motion:_reduce)]:[transition:background-color_var(--idmc-motion-duration-fast)_var(--idmc-motion-ease-out)]',
        '[@media(prefers-reduced-motion:_reduce)]:[&:hover]:[transform:none]',
        '[@media(prefers-reduced-motion:_reduce)]:[&:active]:[transform:none]',
      )}
      aria-label="Buka chatbot"
      aria-haspopup="dialog"
      onClick={onOpen}
    >
      <img
        src={chatbotIcon}
        alt=""
        aria-hidden="true"
        className={cn(
          'idmc-launcher__icon',
          'block [inline-size:28px] [block-size:28px] pointer-events-none',
        )}
      />
    </button>
  )
})
