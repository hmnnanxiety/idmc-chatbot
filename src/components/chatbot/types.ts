export interface ChatUser {
  name: string
  role: string
  /** Optional avatar image. Falls back to the Figma placeholder avatar. */
  avatarSrc?: string
}

export type MessageRole = 'user' | 'assistant'

/** One row of the History view. Mock data only: nothing is persisted or restored yet. */
export interface ChatHistoryItem {
  id: string
  title: string
}

export interface ChatMessage {
  id: string
  role: MessageRole
  text: string
}
