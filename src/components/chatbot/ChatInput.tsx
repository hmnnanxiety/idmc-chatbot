import type { FormEvent } from 'react'
import { SendButton } from './SendButton'
import './ChatInput.css'

export type ChatInputVariant = 'home' | 'chat'

export interface ChatInputProps {
  /** The HiFi sizes the Home and Chat inputs differently. */
  variant?: ChatInputVariant
  /** Accessible name of the text field. */
  label?: string
  placeholder?: string
}

export function ChatInput({
  variant = 'home',
  label = 'Tulis pesan',
  placeholder,
}: ChatInputProps) {
  // Phase 1 is UI only: submitting must not reload the preview page.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
      />
      <SendButton />
    </form>
  )
}
