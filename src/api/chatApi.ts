import { requestChatReply } from './chatRequest'

/** Standalone Vite preview only; its /api proxy maps to FastAPI /chat. */
export function sendChatMessage(message: string, signal?: AbortSignal): Promise<string> {
  return requestChatReply({ endpoint: '/api/chat', message, signal })
}
