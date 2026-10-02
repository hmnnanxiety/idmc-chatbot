export interface ChatUser {
  name: string
  role: string
  /** Optional avatar image. Falls back to the Figma placeholder avatar. */
  avatarSrc?: string
}

export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  text: string
}

export interface TechItem {
  name: string
  src: string
  /** Rendered logo size in px. The HiFi uses 51 for most logos and 44 for one. */
  size?: number
}
