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
