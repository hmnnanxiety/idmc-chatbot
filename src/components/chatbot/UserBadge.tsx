import defaultAvatarSrc from '../../assets/figma/avatar.svg'
import type { ChatUser } from './types'
import './UserBadge.css'

export type UserBadgeProps = ChatUser

export function UserBadge({ name, role, avatarSrc = defaultAvatarSrc }: UserBadgeProps) {
  return (
    <div className="idmc-user-badge">
      <img className="idmc-user-badge__avatar" src={avatarSrc} alt="" />
      <div className="idmc-user-badge__text">
        <p className="idmc-user-badge__name">{name}</p>
        <p className="idmc-user-badge__role">{role}</p>
      </div>
    </div>
  )
}
