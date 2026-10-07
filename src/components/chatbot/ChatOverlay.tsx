import { widgetClasses } from './layout'
import { cn } from '../../lib/utils'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { AnimationEvent } from 'react'
import { ChatLauncher } from './ChatLauncher'
import { ConversationView } from './ConversationView'
import { HistoryView } from './HistoryView'
import { HomeView } from './HomeView'
import type { ChatHistoryItem, ChatUser } from './types'
import { useChatSession } from './useChatSession'

type ChatView = 'home' | 'chat' | 'history'

/** `closing` keeps the panel mounted just long enough to play its exit animation. */
type OverlayPhase = 'closed' | 'open' | 'closing'

/** Safety net in case the exit animation never reports its end (hidden tab, interrupted). */
const CLOSE_FALLBACK_MS = 300

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export interface ChatOverlayProps {
  user: ChatUser
  suggestions: string[]
  /** Mock list for the History view. Omit or pass [] to see the empty state. */
  historyItems?: ChatHistoryItem[]
}

/**
 * Floating chatbot. One bottom-right anchor is shared by both states: while
 * closed only the launcher is rendered, while open only the panel is (it grows
 * from the same corner and has its own close button in the header). The views
 * are plain React state, not routes, and nothing is persisted: once the panel
 * has closed, the conversation is discarded and the next open starts at Home.
 * Submitted text is shown immediately as the user's message and sent to the
 * FastAPI `/chat` endpoint; the typing indicator shows while that request is
 * pending, then the reply (or a simple error message) is appended.
 */
export function ChatOverlay({ user, suggestions, historyItems = [] }: ChatOverlayProps) {
  const [phase, setPhase] = useState<OverlayPhase>('closed')
  const [view, setView] = useState<ChatView>('home')
  const { messages, isAssistantLoading, sendMessage, resetConversation } = useChatSession()
  // Visual selection in History only; no conversation is restored.
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null)

  const panelRef = useRef<HTMLDivElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const wasActiveRef = useRef(false)
  // The view History was opened from, so Back returns to it. Written only when History opens.
  const previousViewRef = useRef<Exclude<ChatView, 'history'>>('home')

  // Final step of closing: unmount the panel and reset to Home with no messages.
  const finishClose = useCallback(() => {
    resetConversation()
    setPhase('closed')
    setView('home')
    setSelectedHistoryId(null)
    previousViewRef.current = 'home'
  }, [resetConversation])

  // Start closing: play the exit animation first, or skip it for reduced motion.
  const requestClose = useCallback(() => {
    if (prefersReducedMotion()) finishClose()
    else setPhase((current) => (current === 'open' ? 'closing' : current))
  }, [finishClose])

  // Home submit or suggestion click: send the text and switch to Conversation.
  const startConversation = (text: string) => {
    void sendMessage(text)
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
    <div
      className={cn(
        'idmc-chatbot idmc-overlay',
        widgetClasses,
        '[--idmc-overlay-gutter:var(--idmc-space-5)] [--idmc-overlay-launcher-size:var(--idmc-space-10)]',
        '[--idmc-overlay-panel-width:380px] [--idmc-overlay-panel-height:600px]',
        '[--idmc-overlay-inset-inline:max(_var(--idmc-overlay-gutter),_env(safe-area-inset-left,_0px),_env(safe-area-inset-right,_0px)_)]',
        '[--idmc-overlay-inset-start:max(var(--idmc-overlay-gutter),_env(safe-area-inset-top,_0px))]',
        '[--idmc-overlay-inset-end:max(var(--idmc-overlay-gutter),_env(safe-area-inset-bottom,_0px))]',
        'tablet:[--idmc-overlay-gutter:var(--idmc-space-4)] mobile:[--idmc-overlay-gutter:var(--idmc-space-3)]',
        'mobile:[--idmc-overlay-launcher-size:var(--idmc-space-9)] mobile:[--idmc-overlay-panel-width:100%]',
        'mobile:[--idmc-overlay-panel-height:100%] short:[--idmc-overlay-gutter:var(--idmc-space-2)]',
        'short:[--idmc-overlay-launcher-size:var(--idmc-space-9)]',
      )}
    >
      {phase === 'closed' ? (
        <ChatLauncher ref={launcherRef} onOpen={() => setPhase('open')} />
      ) : (
        <div
          ref={panelRef}
          className={cn(
            'idmc-overlay__panel',
            'fixed [inset-inline-end:var(--idmc-overlay-inset-inline)]',
            '[inset-block-end:var(--idmc-overlay-inset-end)] [z-index:1000]',
            '[inline-size:min(_var(--idmc-overlay-panel-width),_calc(100%_-_2_*_var(--idmc-overlay-inset-inline))_)]',
            '[block-size:min(_var(--idmc-overlay-panel-height),_calc(100%_-_var(--idmc-overlay-inset-start)_-_var(--idmc-overlay-inset-end))_)]',
            'overflow-hidden [border-radius:var(--idmc-radius-4)] [background:var(--idmc-color-neutral-200)]',
            '[box-shadow:var(--idmc-shadow-e3)] [transform-origin:100%_100%]',
            '[animation:idmc-panel-in_var(--idmc-motion-duration-base)_var(--idmc-motion-ease-out)]',
            'supports-[block-size:_100dvh]:[block-size:min(_var(--idmc-overlay-panel-height),_calc(100dvh_-_var(--idmc-overlay-inset-start)_-_var(--idmc-overlay-inset-end))_)]',
            '[&:focus-visible]:[outline:var(--idmc-stroke-2)_solid_var(--idmc-color-primary-300)]',
            '[&:focus-visible]:[outline-offset:calc(-1_*_var(--idmc-stroke-2))]',
            "[&[data-state='closing']]:[animation:idmc-panel-out_var(--idmc-motion-duration-fast)_var(--idmc-motion-ease-out)_forwards]",
            "[&[data-state='closing']]:pointer-events-none",
          )}
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
              onSend={sendMessage}
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
