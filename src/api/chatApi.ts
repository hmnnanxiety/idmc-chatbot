/**
 * Client for the FastAPI chat endpoint (`POST /chat` -> `{ reply }`).
 * The frontend always calls `/api/chat`; in development the Vite dev server proxies
 * `/api` to FastAPI and strips the prefix (see vite.config.ts).
 */
const CHAT_ENDPOINT = '/api/chat'

/** Upper bound so a hung request cannot leave the loading indicator on forever. */
const CHAT_REQUEST_TIMEOUT_MS = 60_000

/**
 * Sends one message and resolves with the assistant reply text. Rejects on network
 * errors, timeouts, non-2xx responses, and malformed or empty replies. `signal`
 * lets the caller cancel (for example when the panel closes).
 */
export async function sendChatMessage(message: string, signal?: AbortSignal): Promise<string> {
  const timeout = AbortSignal.timeout(CHAT_REQUEST_TIMEOUT_MS)

  const response = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  })

  if (!response.ok) {
    throw new Error(`Chat request failed with status ${response.status}`)
  }

  const data: unknown = await response.json()
  const reply =
    typeof data === 'object' && data !== null && 'reply' in data ? data.reply : undefined

  if (typeof reply !== 'string' || reply.trim() === '') {
    throw new Error('Chat response did not contain a reply')
  }

  return reply
}
