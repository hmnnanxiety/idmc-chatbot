import { requestChatReply } from './chatRequest'

/** Web endpoint, or same-origin /api proxy to FastAPI /chat. */
export function sendChatMessage(message: string, signal?: AbortSignal): Promise<string> {
  return requestChatReply({ endpoint: import.meta.env.VITE_CHAT_API_URL || '/api/chat', message, signal })
}
