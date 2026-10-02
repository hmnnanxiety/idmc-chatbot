import { useCallback, useEffect, useRef, useState } from 'react'
import type { AnimationEvent } from 'react'
import { ChatLauncher } from './ChatLauncher'
import { ConversationView } from './ConversationView'
import { HistoryView } from './HistoryView'
import { HomeView } from './HomeView'
import type { ChatHistoryItem, ChatMessage, ChatUser, MessageRole } from './types'
import './chatbot.css'
import './ChatOverlay.css'

type ChatView = 'home' | 'chat' | 'history'

/** `closing` keeps the panel mounted just long enough to play its exit animation. */
type OverlayPhase = 'closed' | 'open' | 'closing'

/** Safety net in case the exit animation never reports its end (hidden tab, interrupted). */
const CLOSE_FALLBACK_MS = 300

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export interface ChatOverlayProps {
  user: ChatUser
  suggestions: string[]
  /** Mock list for the History view. Omit or pass [] to see the empty state. */
  historyItems?: ChatHistoryItem[]
  /** Shows the typing indicator in the Conversation view. UI plumbing only: the host owns this state. */
  isAssistantLoading?: boolean
}

/**
 * Floating chatbot. One bottom-right anchor is shared by both states: while
 * closed only the launcher is rendered, while open only the panel is (it grows
 * from the same corner and has its own close button in the header). The views
 * are plain React state, not routes, and nothing is persisted: once the panel
 * has closed, the conversation is discarded and the next open starts at Home.
 * There is no backend yet, so submitted text is only shown as the user's own
 * message.
 */
export function ChatOverlay({
  user,
  suggestions,
  historyItems = [],
  isAssistantLoading = false,
}: ChatOverlayProps) {
  const [phase, setPhase] = useState<OverlayPhase>('closed')
  const [view, setView] = useState<ChatView>('home')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  // Visual selection in History only; no conversation is restored.
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null)

  const panelRef = useRef<HTMLDivElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const wasActiveRef = useRef(false)
  const nextMessageId = useRef(0)
  // The view History was opened from, so Back returns to it. Written only when History opens.
  const previousViewRef = useRef<Exclude<ChatView, 'history'>>('home')

  // Final step of closing: unmount the panel and reset to Home with no messages.
  const finishClose = useCallback(() => {
    setPhase('closed')
    setView('home')
    setMessages([])
    setSelectedHistoryId(null)
    previousViewRef.current = 'home'
  }, [])

  // Start closing: play the exit animation first, or skip it for reduced motion.
  const requestClose = useCallback(() => {
    if (prefersReducedMotion()) finishClose()
    else setPhase((current) => (current === 'open' ? 'closing' : current))
  }, [finishClose])

  const appendMessage = (role: MessageRole, text: string) => {
    const id = `m${nextMessageId.current++}`
    setMessages((previous) => [...previous, { id, role, text }])
  }

  // Home submit or suggestion click: record the text and switch to Conversation.
  const startConversation = (text: string) => {
    appendMessage('user', text)
    setView('chat')
  }

  const openHistory = () => {
    if (view !== 'history') previousViewRef.current = view
    setView('history')
  }

  const closeHistory = () => setView(previousViewRef.current)

  const handlePanelAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    // Ignore bubbled events from children (e.g. a message's entrance animation).
    if (phase === 'closing' && event.target === event.currentTarget) finishClose()
  }

  // Fallback so the panel can never get stuck in `closing`.
  useEffect(() => {
    if (phase !== 'closing') return
    const timeout = window.setTimeout(finishClose, CLOSE_FALLBACK_MS)
    return () => window.clearTimeout(timeout)
  }, [phase, finishClose])

  // Escape closes the panel.
  useEffect(() => {
    if (phase !== 'open') return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') requestClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [phase, requestClose])

  // Move focus into the panel when it opens so keyboard users land inside it.
  useEffect(() => {
    if (phase === 'open') panelRef.current?.focus()
  }, [phase])

  // Switching views unmounts the focused button (history / back); hand focus back to the
  // panel instead of dropping it on <body>. A view that autofocuses (the composer) wins.
  useEffect(() => {
    const panel = panelRef.current
    if (phase === 'open' && panel && !panel.contains(document.activeElement)) panel.focus()
  }, [view, phase])

  // After the panel has closed and the launcher is back, hand focus to the launcher.
  useEffect(() => {
    if (phase === 'closed' && wasActiveRef.current) launcherRef.current?.focus()
    wasActiveRef.current = phase !== 'closed'
  }, [phase])

  return (
    <div className="idmc-chatbot idmc-overlay">
      {phase === 'closed' ? (
        <ChatLauncher ref={launcherRef} onOpen={() => setPhase('open')} />
      ) : (
        <div
          ref={panelRef}
          className="idmc-overlay__panel"
          data-state={phase}
          role="dialog"
          aria-label="Chatbot Data Publik"
          tabIndex={-1}
          inert={phase === 'closing'}
          onAnimationEnd={handlePanelAnimationEnd}
        >
          {view === 'home' && (
            <HomeView
              user={user}
              suggestions={suggestions}
              onSubmit={startConversation}
              onSelectSuggestion={startConversation}
              onOpenHistory={openHistory}
              onClose={requestClose}
            />
          )}
          {view === 'chat' && (
            <ConversationView
              user={user}
              messages={messages}
              isAssistantLoading={isAssistantLoading}
              onSend={(text) => appendMessage('user', text)}
              onOpenHistory={openHistory}
              onClose={requestClose}
            />
          )}
          {view === 'history' && (
            <HistoryView
              items={historyItems}
              selectedId={selectedHistoryId}
              onSelect={setSelectedHistoryId}
              onBack={closeHistory}
              onClose={requestClose}
            />
          )}
        </div>
      )}
    </div>
  )
}
