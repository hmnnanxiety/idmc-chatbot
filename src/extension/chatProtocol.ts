export const CHAT_PORT_NAME = 'idmc-chat-v1'
export const MAX_CHAT_MESSAGE_LENGTH = 20_000
// Finish before Chromium's 30-second service-worker fetch response limit.
export const WORKER_REQUEST_TIMEOUT_MS = 25_000
export const CLIENT_REQUEST_TIMEOUT_MS = 30_000

export interface ChatPortRequest {
  type: 'chat'
  message: string
}

export type ChatPortResponse =
  | { ok: true; reply: string }
  | { ok: false; code: 'unavailable' | 'failed' | 'invalid' }

export function isChatPortRequest(value: unknown): value is ChatPortRequest {
  return typeof value === 'object' && value !== null &&
    'type' in value && value.type === 'chat' &&
    'message' in value && typeof value.message === 'string' &&
    value.message.trim().length > 0 && value.message.length <= MAX_CHAT_MESSAGE_LENGTH
}

export function isChatPortResponse(value: unknown): value is ChatPortResponse {
  if (typeof value !== 'object' || value === null || !('ok' in value)) return false
  if (value.ok === true) return 'reply' in value && typeof value.reply === 'string' && !!value.reply.trim()
  return value.ok === false && 'code' in value &&
    ['unavailable', 'failed', 'invalid'].includes(String(value.code))
}
