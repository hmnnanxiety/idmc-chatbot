import { cn } from '../../lib/utils'
import type { ReactNode } from 'react'
import closeIconSrc from '../../assets/icon-close.svg'
import historyIconSrc from '../../assets/figma/history-chat.svg'
import { IconButton } from './IconButton'

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
    <header
      className={cn(
        'idmc-top-bar',
        'flex flex-none items-center justify-between [inline-size:100%]',
        '[min-block-size:var(--idmc-header-height)] [padding:0] [gap:var(--idmc-header-gap)]',
      )}
    >
      {(leading || title) && (
        <div
          className={cn(
            'idmc-top-bar__leading',
            'flex [flex:0_1_auto] items-center [gap:var(--idmc-header-gap)] [min-inline-size:0]',
          )}
        >
          {leading}
          {title && (
            <h1
              className={cn(
                'idmc-top-bar__title',
                '[min-inline-size:0] [margin:0] overflow-hidden text-ellipsis whitespace-nowrap',
                '[color:var(--idmc-color-primary-500)] [font:var(--idmc-type-b1)] [&]:[font-weight:700]',
                '[letter-spacing:0]',
              )}
            >
              {title}
            </h1>
          )}
        </div>
      )}
      {actions && (
        <div
          className={cn(
            'idmc-top-bar__actions',
            'flex flex-none items-center [gap:var(--idmc-header-gap)] [margin-inline-start:auto]',
          )}
        >
          {actions}
        </div>
      )}
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
