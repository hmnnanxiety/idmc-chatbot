import type { FormEvent } from 'react'
import { SendButton } from './SendButton'
import './ChatInput.css'

export type ChatInputVariant = 'home' | 'chat'

export interface ChatInputProps {
  variant?: ChatInputVariant
  label?: string
  placeholder?: string
  onSubmit?: (text: string) => void
  autoFocus?: boolean
}

export function ChatInput({
  variant = 'home',
  label = 'Tulis pesan',
  placeholder,
  onSubmit,
  autoFocus,
}: ChatInputProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const text = String(new FormData(form).get('message') ?? '').trim()
    if (!text) return
    onSubmit?.(text)
    form.reset()
  }

  return (
    <form
      className={`idmc-chat-input idmc-chat-input--${variant}`}
      onSubmit={handleSubmit}
    >
      <input
        className="idmc-chat-input__field"
        type="text"
        name="message"
        aria-label={label}
        placeholder={placeholder}
        autoComplete="off"
        autoFocus={autoFocus}
      />
      <SendButton />
    </form>
  )
}
