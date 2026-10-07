import { cn } from '../../lib/utils'
import defaultAvatarSrc from '../../assets/figma/avatar.svg'
import type { ChatUser } from './types'

export type UserBadgeProps = ChatUser

export function UserBadge({ name, role, avatarSrc = defaultAvatarSrc }: UserBadgeProps) {
  return (
    <div
      className={cn(
        'idmc-user-badge',
        'inline-flex [flex:0_1_auto] [min-inline-size:0] items-center [gap:var(--idmc-space-1)] [padding:3px]',
        'overflow-clip [border-radius:63px] [background:var(--idmc-color-neutral-100)]',
        '[color:var(--idmc-color-primary-700)]',
      )}
    >
      <img
        className={cn(
          'idmc-user-badge__avatar',
          'block flex-none [inline-size:47px] [block-size:47px]',
        )}
        src={avatarSrc}
        alt=""
      />
      <div
        className={cn(
          'idmc-user-badge__text',
          'flex [flex:0_1_auto] flex-col justify-center [min-inline-size:0] [inline-size:129px]',
          '[block-size:34px] overflow-hidden whitespace-nowrap',
        )}
      >
        <p
          className={cn(
            'idmc-user-badge__name',
            '[margin:0] [margin-block-end:-3px] overflow-hidden text-ellipsis',
            '[font:700_18px/27px_var(--idmc-font-family)]',
          )}
        >
          {name}
        </p>
        <p
          className={cn(
            'idmc-user-badge__role',
            '[margin:0] overflow-hidden text-ellipsis [font:var(--idmc-type-b5)]',
          )}
        >
          {role}
        </p>
      </div>
    </div>
  )
}
