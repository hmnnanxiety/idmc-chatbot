import settingsIconSrc from '../../assets/figma/icon-settings.svg'
import { IconButton } from './IconButton'
import type { ChatUser } from './types'
import { UserBadge } from './UserBadge'
import './TopBar.css'

export type TopBarVariant = 'home' | 'chat'

export interface TopBarProps {
  user: ChatUser
  /** The HiFi spaces the Home and Chat top bars differently. */
  variant?: TopBarVariant
  onSettingsClick?: () => void
}

export function TopBar({ user, variant = 'home', onSettingsClick }: TopBarProps) {
  return (
    <header className={`idmc-top-bar idmc-top-bar--${variant}`}>
      <UserBadge {...user} />
      <IconButton
        label="Pengaturan"
        iconSrc={settingsIconSrc}
        onClick={onSettingsClick}
      />
    </header>
  )
}
