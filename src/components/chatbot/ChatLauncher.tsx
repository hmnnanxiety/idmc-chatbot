import { forwardRef } from 'react'
import chatbotIcon from '../../assets/figma/chatbot-icon.svg'
import './ChatLauncher.css'

export interface ChatLauncherProps {
  onOpen: () => void
}

export const ChatLauncher = forwardRef<HTMLButtonElement, ChatLauncherProps>(
  function ChatLauncher({ onOpen }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className="idmc-launcher"
        aria-label="Buka chatbot"
        aria-haspopup="dialog"
        onClick={onOpen}
      >
        <img
          src={chatbotIcon}
          alt=""
          aria-hidden="true"
          className="idmc-launcher__icon"
        />
      </button>
    )
  },
)