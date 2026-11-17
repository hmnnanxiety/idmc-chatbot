import { useCallback, useEffect, useRef, useState } from 'react'
import { sendChatMessage } from '../../api/chatApi'
import { ChatServiceUnavailableError } from '../../api/chatRequest'
import type { ChatTransport } from '../../api/chatRequest'
import type { ChatMessage, MessageRole } from './types'

const CHAT_ERROR_MESSAGE =
  'Maaf, terjadi kesalahan saat menghubungi server. Silakan coba lagi.'

/** Owns the active conversation and its in-flight request. */
export function useChatSession(requestReply: ChatTransport = sendChatMessage, initialMessages: ChatMessage[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [isAssistantLoading, setIsAssistantLoading] = useState(false)
  const requestRef = useRef<AbortController | null>(null)

  const appendMessage = useCallback((role: MessageRole, text: string, status?: 'error') => {
    const id = crypto.randomUUID()
    setMessages((previous) => [...previous, { id, role, text, status }])
  }, [])

  const cancelReply = useCallback((notice?: string) => {
    if (!requestRef.current) return
    requestRef.current.abort()
    requestRef.current = null
    setIsAssistantLoading(false)
    if (notice) appendMessage('assistant', notice, 'error')
  }, [appendMessage])

  const replaceMessages = useCallback((next: ChatMessage[]) => {
    cancelReply()
    setMessages(next)
  }, [cancelReply])

  const sendMessage = useCallback(async (value: string) => {
    const text = value.trim()
    // A synchronous ref guard also blocks two submits before React rerenders.
    if (!text || requestRef.current) return
    const controller = new AbortController()
    requestRef.current = controller
    appendMessage('user', text)
    setIsAssistantLoading(true)

    try {
      const reply = await requestReply(text, controller.signal)
      if (!controller.signal.aborted) appendMessage('assistant', reply)
    } catch (error) {
      if (!controller.signal.aborted) appendMessage('assistant',
        error instanceof ChatServiceUnavailableError
          ? 'Layanan chatbot belum tersedia. Silakan coba lagi nanti.'
          : CHAT_ERROR_MESSAGE, 'error')
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null
        setIsAssistantLoading(false)
      }
    }
  }, [appendMessage, requestReply])

  useEffect(() => () => requestRef.current?.abort(), [])

  return { messages, isAssistantLoading, sendMessage, cancelReply, replaceMessages }
}
