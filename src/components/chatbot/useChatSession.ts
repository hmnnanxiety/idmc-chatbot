import { useCallback, useEffect, useRef, useState } from 'react'
import { sendChatMessage } from '../../api/chatApi'
import type { ChatMessage, MessageRole } from './types'

const CHAT_ERROR_MESSAGE =
  'Maaf, terjadi kesalahan saat menghubungi server. Silakan coba lagi.'

/** In-memory request lifecycle only; closing still discards the conversation. */
export function useChatSession() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isAssistantLoading, setIsAssistantLoading] = useState(false)
  const nextMessageId = useRef(0)
  const requestRef = useRef<AbortController | null>(null)

  const appendMessage = useCallback((role: MessageRole, text: string, status?: 'error') => {
    const id = `m${nextMessageId.current++}`
    setMessages((previous) => [...previous, { id, role, text, status }])
  }, [])

  const resetConversation = useCallback(() => {
    requestRef.current?.abort()
    requestRef.current = null
    setIsAssistantLoading(false)
    setMessages([])
  }, [])

  const sendMessage = useCallback(async (value: string) => {
    const text = value.trim()
    // A synchronous ref guard also blocks two submits before React rerenders.
    if (!text || requestRef.current) return
    const controller = new AbortController()
    requestRef.current = controller
    appendMessage('user', text)
    setIsAssistantLoading(true)

    try {
      const reply = await sendChatMessage(text, controller.signal)
      if (!controller.signal.aborted) appendMessage('assistant', reply)
    } catch {
      if (!controller.signal.aborted) appendMessage('assistant', CHAT_ERROR_MESSAGE, 'error')
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null
        setIsAssistantLoading(false)
      }
    }
  }, [appendMessage])

  useEffect(() => () => requestRef.current?.abort(), [])

  return { messages, isAssistantLoading, sendMessage, resetConversation }
}
