import { visuallyHiddenClasses } from './layout'
import { cn } from '../../lib/utils'
import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { SendButton } from './SendButton'

// The sizing text uses the same wrapping and padding as the editable field.
const fieldLayout = [
  'box-border [inline-size:100%] [padding-inline:var(--idmc-space-3)_var(--idmc-space-1)]',
  '[padding-block:0]',
  '[font:var(--idmc-type-b2)] [letter-spacing:0] whitespace-pre-wrap [overflow-wrap:anywhere]',
  'overflow-y-auto [scrollbar-width:thin] [scrollbar-gutter:stable]',
].join(' ')

export type ChatInputVariant = 'home' | 'chat'

export interface ChatInputProps {
  variant?: ChatInputVariant
  label?: string
  placeholder?: string
  onSubmit?: (text: string) => void
  /** Disable sending while preserving/editing the draft during a pending reply. */
  submitDisabled?: boolean
  autoFocus?: boolean
}

export function ChatInput({
  variant = 'home',
  label = 'Tulis pesan',
  placeholder,
  onSubmit,
  submitDisabled = false,
  autoFocus,
}: ChatInputProps) {
  const [draft, setDraft] = useState('')
  const loadingLabelId = useId()
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitDisabled) return
    const text = draft.trim()
    if (!text) return
    onSubmit?.(text)
    setDraft('')
  }

  return (
    <form
      className={cn(
        `idmc-chat-input idmc-chat-input--${variant}`,
        'flex flex-none items-end [inline-size:100%] [gap:var(--idmc-space-2)]',
        '[margin:0] [padding:6px] [border-radius:var(--idmc-radius-5)]',
        '[background:var(--idmc-color-neutral-100)]',
        '[border:var(--idmc-stroke-0)_solid_var(--idmc-color-neutral-300)] [box-shadow:var(--idmc-shadow-e1)]',
        '[transition:border-color_var(--idmc-motion-duration-fast)_var(--idmc-motion-ease-out),_box-shadow_var(--idmc-motion-duration-fast)_var(--idmc-motion-ease-out)]',
        '[&:focus-within]:[border-color:var(--idmc-color-primary-300)]',
        '[&:focus-within]:[box-shadow:0_0_0_2px_var(--idmc-color-primary-10-a10)]',
        variant === 'chat'
          ? '[animation:idmc-content-in_var(--idmc-motion-duration-content)_var(--idmc-motion-ease-out)_120ms_backwards]'
          : '[animation:idmc-content-in_var(--idmc-motion-duration-enter)_var(--idmc-motion-ease-out)_260ms_backwards]',
      )}
      onSubmit={handleSubmit}
      aria-busy={submitDisabled}
    >
      <div className="relative min-w-0 grow [--idmc-composer-field-inset:calc((var(--idmc-composer-height)_-_38px)_/_2)] [padding-block:var(--idmc-composer-field-inset)]">
        <div
          aria-hidden="true"
          className={cn(fieldLayout, 'invisible [max-block-size:120px] short:[max-block-size:72px]')}
        >
          {draft + ' '}
        </div>
        <textarea
          className={cn(
            fieldLayout,
            'idmc-chat-input__field absolute start-0 resize-none border-0 bg-transparent outline-none',
            '[inset-block-start:var(--idmc-composer-field-inset)] [block-size:calc(100%_-_2_*_var(--idmc-composer-field-inset))]',
            '[color:var(--idmc-color-neutral-900)] [&::placeholder]:[color:var(--idmc-color-neutral-600)]',
            '[scrollbar-color:var(--idmc-color-neutral-400)_transparent] [overscroll-behavior:contain]',
          )}
          rows={1}
          name="message"
          aria-label={label}
          aria-describedby={submitDisabled ? loadingLabelId : undefined}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return
            event.preventDefault()
            event.currentTarget.form?.requestSubmit()
          }}
          placeholder={placeholder}
          autoComplete="off"
          autoFocus={autoFocus}
        />
      </div>
      <div className="flex flex-none [margin-block-end:calc((var(--idmc-composer-height)_-_58px)_/_2)]">
        <SendButton disabled={submitDisabled || !draft.trim()} />
      </div>
      {submitDisabled && (
        <span id={loadingLabelId} className={cn('idmc-visually-hidden', visuallyHiddenClasses)}>
          Menunggu jawaban asisten. Anda tetap dapat menulis pesan.
        </span>
      )}
    </form>
  )
}
