import type { ReactNode } from 'react'
import closeIconSrc from '../../assets/icon-close.svg'
import historyIconSrc from '../../assets/figma/history-chat.svg'
// import settingsIconSrc from '../../assets/figma/icon-settings.svg'
import { IconButton } from './IconButton'
// import { UserBadge } from './UserBadge'
import './TopBar.css'

export interface TopBarProps {
  /** Left-most slot, e.g. a back button. Rendered before the title. */
  leading?: ReactNode
  /** Compact heading shown on the left. Omit it (Home) to leave the left side empty. */
  title?: string
  /** Right-aligned slot, e.g. <TopBarActions />. Stays on the right even with no left content. */
  actions?: ReactNode
}

/**
 * Layout-only header: [leading][title] ........ [actions]. It knows nothing
 * about views; each view decides what to put in the three slots.
 * The hidden UserBadge / settings button can be re-added to `leading` / `actions` later.
 */
export function TopBar({ leading, title, actions }: TopBarProps) {
  return (
    <header className="idmc-top-bar">
      {(leading || title) && (
        <div className="idmc-top-bar__leading">
          {leading}
          {title && <h1 className="idmc-top-bar__title">{title}</h1>}
        </div>
      )}
      {actions && <div className="idmc-top-bar__actions">{actions}</div>}
    </header>
  )
}

export interface TopBarActionsProps {
  /** When provided, the header shows the history button, immediately left of close. */
  onOpenHistory?: () => void
  /** When provided, the header shows a close button (the overlay's only close control). */
  onClose?: () => void
}

/** The standard right-hand header buttons: [history] [close]. */
export function TopBarActions({ onOpenHistory, onClose }: TopBarActionsProps) {
  return (
    <>
      {onOpenHistory && (
        // Existing Figma asset, not redrawn. Inset matches the close icon so both
        // buttons draw their artwork in the same 20px box.
        <IconButton
          label="Riwayat chat"
          iconSrc={historyIconSrc}
          iconInset="8.33%"
          onClick={onOpenHistory}
        />
      )}
      {onClose && (
        // Figma has no close icon: assets/icon-close.svg reuses the settings icon's
        // palette and is centered in the icon box (equal inset on every side).
        <IconButton
          label="Tutup chatbot"
          iconSrc={closeIconSrc}
          iconInset="8.33%"
          onClick={onClose}
        />
      )}
    </>
  )
}
