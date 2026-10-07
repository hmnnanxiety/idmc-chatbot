import backIconSrc from '../../assets/icon-back.svg'
import { IconButton } from './IconButton'
import { TopBar, TopBarActions } from './TopBar'

export interface ChatHeaderProps {
  title?: string
  onBack?: () => void
  onOpenHistory?: () => void
  onClose?: () => void
}

/** Shared view controls; TopBar remains the reusable layout primitive. */
export function ChatHeader({ title, onBack, onOpenHistory, onClose }: ChatHeaderProps) {
  return (
    <TopBar
      title={title}
      leading={onBack && (
        <IconButton label="Kembali" iconSrc={backIconSrc} iconInset="8.33%" onClick={onBack} />
      )}
      actions={<TopBarActions onOpenHistory={onOpenHistory} onClose={onClose} />}
    />
  )
}
