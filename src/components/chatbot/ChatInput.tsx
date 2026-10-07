import { visuallyHiddenClasses } from './layout'
import { cn } from '../../lib/utils'
import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { SendButton } from './SendButton'

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
        'flex flex-none items-center justify-end [inline-size:100%] [block-size:var(--idmc-composer-height)]',
        '[margin:0] [padding:6px_8px] overflow-clip',
        '[background:var(--idmc-color-neutral-100)]',
        '[&:focus-within]:[outline:var(--idmc-stroke-1)_solid_var(--idmc-color-primary-300)]',
        '[&:focus-within]:[outline-offset:-2px]',
        variant === 'chat'
          ? '[border-radius:var(--idmc-radius-4)]'
          : '[border-radius:var(--idmc-radius-full)]',
      )}
      onSubmit={handleSubmit}
      aria-busy={submitDisabled}
    >
      <input
        className={cn(
          'idmc-chat-input__field',
          '[flex:1_1_auto] self-stretch [min-inline-size:0] [padding-inline:var(--idmc-space-5)] [border:0]',
          '[background:transparent] [color:var(--idmc-color-neutral-900)] [font:var(--idmc-type-b2)]',
          '[letter-spacing:0] [outline:0] [&::placeholder]:[color:var(--idmc-color-neutral-500)]',
          'narrow:[padding-inline:var(--idmc-space-3)]',
        )}
        type="text"
        name="message"
        aria-label={label}
        aria-describedby={submitDisabled ? loadingLabelId : undefined}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && event.nativeEvent.isComposing) event.preventDefault()
        }}
        placeholder={placeholder}
        autoComplete="off"
        autoFocus={autoFocus}
      />
      <SendButton disabled={submitDisabled || !draft.trim()} />
      {submitDisabled && (
        <span id={loadingLabelId} className={cn('idmc-visually-hidden', visuallyHiddenClasses)}>
          Menunggu jawaban asisten. Anda tetap dapat menulis pesan.
        </span>
      )}
    </form>
  )
}
