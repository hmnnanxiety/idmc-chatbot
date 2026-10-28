export type ChatTransport = (message: string, signal?: AbortSignal) => Promise<string>

export class ChatServiceUnavailableError extends Error {
  constructor() {
    super('Chat service is not configured')
    this.name = 'ChatServiceUnavailableError'
  }
}

interface ChatRequestOptions {
  endpoint: string
  message: string
  signal?: AbortSignal
  timeoutMs?: number
}

/** Existing FastAPI contract, shared by the preview and extension worker. */
export async function requestChatReply({
  endpoint, message, signal, timeoutMs = 60_000,
}: ChatRequestOptions): Promise<string> {
  signal?.throwIfAborted()
  if (!endpoint) throw new ChatServiceUnavailableError()
  const timeout = AbortSignal.timeout(timeoutMs)
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'omit',
    redirect: 'error',
    body: JSON.stringify({ message }),
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  })
  if (!response.ok) throw new Error(`Chat request failed with status ${response.status}`)
  const data: unknown = await response.json()
  const reply = typeof data === 'object' && data !== null && 'reply' in data ? data.reply : undefined
  if (typeof reply !== 'string' || !reply.trim()) {
    throw new Error('Chat response did not contain a reply')
  }
  return reply
}
