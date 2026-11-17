import { widgetClasses, surfaceClasses } from './layout'
import { cn } from '../../lib/utils'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { AnimationEvent } from 'react'
import { ChatLauncher } from './ChatLauncher'
import { ConversationView } from './ConversationView'
import { HistoryView } from './HistoryView'
import { HomeView } from './HomeView'
import type { ChatUser } from './types'
import { useChatSession } from './useChatSession'
import type { ChatTransport } from '../../api/chatRequest'
import { conversationTitle, expandedChatUrl, newConversation } from './conversation'
import type { ConversationStore, SavedConversation } from './conversation'

type ChatView = 'home' | 'chat' | 'history'

/** `closing` keeps the panel mounted just long enough to play its exit animation. */
type OverlayPhase = 'closed' | 'open' | 'closing'

/** Safety net in case the exit animation never reports its end (hidden tab, interrupted). */
const CLOSE_FALLBACK_MS = 300

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export interface ChatOverlayProps {
  user: ChatUser
  suggestions: string[]
  conversationStore: ConversationStore
  /** Extension transport; the standalone preview defaults to its Vite API proxy. */
  requestReply?: ChatTransport
  expandedUrl?: string
}

/** Floating chatbot with a conversation that survives closing the panel. */
export function ChatOverlay({ user, suggestions, conversationStore, requestReply, expandedUrl }: ChatOverlayProps) {
  const [phase, setPhase] = useState<OverlayPhase>('closed')
  const [view, setView] = useState<ChatView>('home')
  const [active, setActive] = useState(newConversation)
  const { messages, isAssistantLoading, sendMessage, cancelReply, replaceMessages } = useChatSession(requestReply, active.messages)
  const [history, setHistory] = useState<SavedConversation[]>([])
  const [historyError, setHistoryError] = useState('')

  useEffect(() => {
    if (isAssistantLoading || !messages.length || messages === active.messages) return
    const record = { id: active.id, messages, updatedAt: Date.now() }

    async function saveConversation() {
      try {
        await conversationStore.save(record)
      } catch {
        setHistoryError('Riwayat gagal disimpan di browser.')
      } finally {
        setHistory((previous) => {
          if (previous.some((item) => item.id === record.id && item.updatedAt > record.updatedAt)) {
            return previous
          }
          return [record, ...previous.filter((item) => item.id !== record.id)]
            .sort((left, right) => right.updatedAt - left.updatedAt)
        })
      }
    }
    void saveConversation()
  }, [active, messages, isAssistantLoading, conversationStore])
  const [expandError, setExpandError] = useState('')
  const maximize = expandedUrl ? () => {
    try {
      window.open(expandedChatUrl(expandedUrl, newConversation(messages)), '_blank', 'noopener,noreferrer')
      setExpandError('')
    } catch (error) {
      setExpandError(error instanceof Error ? error.message : 'Tab baru gagal dibuka.')
    }
  } : undefined

  const panelRef = useRef<HTMLDivElement>(null)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const wasActiveRef = useRef(false)
  // The view History was opened from, so Back returns to it. Written only when History opens.
  const previousViewRef = useRef<Exclude<ChatView, 'history'>>('home')

  // Unmount the panel after its exit animation. Keep the active transcript.
  const finishClose = useCallback(() => {
    setExpandError('')
    setPhase('closed')
  }, [])

  // Start closing: play the exit animation first, or skip it for reduced motion.
  const requestClose = useCallback(() => {
    cancelReply('Jawaban dihentikan saat chatbot ditutup. Kirim ulang pertanyaan untuk mencoba lagi.')
    if (prefersReducedMotion()) finishClose()
    else setPhase((current) => (current === 'open' ? 'closing' : current))
  }, [cancelReply, finishClose])

  // Home submit or suggestion click: send the text and switch to Conversation.
  const startConversation = (text: string) => {
    void sendMessage(text)
    setView('chat')
  }

  const openHistory = async () => {
    if (view !== 'history') previousViewRef.current = view
    setView('history')
    try {
      const saved = await conversationStore.list()
      setHistory((previous) => {
        const records = new Map(saved.map((record) => [record.id, record]))
        for (const record of previous) {
          if ((records.get(record.id)?.updatedAt ?? 0) < record.updatedAt) records.set(record.id, record)
        }
        return Array.from(records.values()).sort((left, right) => right.updatedAt - left.updatedAt)
      })
    } catch {
      setHistoryError('Riwayat gagal dibuka dari browser.')
    }
  }

  const closeHistory = () => setView(previousViewRef.current)

  const openConversation = (record: SavedConversation) => {
    if (isAssistantLoading) return
    if (record.id !== active.id) {
      setActive(record)
      replaceMessages(record.messages)
    }
    setView(record.messages.length ? 'chat' : 'home')
  }

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
    // Listen inside the shadow tree so portal shortcuts do not receive our keys.
    const root = panelRef.current?.getRootNode() ?? document
    root.addEventListener('keydown', handleKeyDown as EventListener)
    return () => root.removeEventListener('keydown', handleKeyDown as EventListener)
  }, [phase, requestClose])

  // Move focus into the panel when it opens so keyboard users land inside it.
  useEffect(() => {
    if (phase === 'open') panelRef.current?.focus()
  }, [phase])

  // Switching views unmounts the focused button (history / back); hand focus back to the
  // panel instead of dropping it on <body>. A view that autofocuses (the composer) wins.
  useEffect(() => {
    const panel = panelRef.current
    const root = panel?.getRootNode()
    const activeElement = root instanceof ShadowRoot ? root.activeElement : document.activeElement
    if (phase === 'open' && panel && !panel.contains(activeElement)) panel.focus()
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
            'overflow-hidden [border-radius:var(--idmc-radius-5)]',
            surfaceClasses,
            '[border:var(--idmc-stroke-0)_solid_var(--idmc-color-neutral-400)]',
            '[box-shadow:0_24px_64px_-12px_color-mix(in_srgb,_var(--idmc-color-neutral-1000)_24%,_transparent),_0_8px_24px_-8px_color-mix(in_srgb,_var(--idmc-color-neutral-1000)_18%,_transparent)]',
            '[transform-origin:100%_100%]',
            '[animation:idmc-panel-in_var(--idmc-motion-duration-enter)_var(--idmc-motion-ease-out)_both]',
            'supports-[block-size:_100dvh]:[block-size:min(_var(--idmc-overlay-panel-height),_calc(100dvh_-_var(--idmc-overlay-inset-start)_-_var(--idmc-overlay-inset-end))_)]',
            '[&:focus-visible]:[outline:var(--idmc-stroke-2)_solid_var(--idmc-color-primary-300)]',
            '[&:focus-visible]:[outline-offset:calc(-1_*_var(--idmc-stroke-2))]',
            "[&[data-state='closing']]:[animation:idmc-panel-out_var(--idmc-motion-duration-exit)_ease-in_forwards]",
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
              onMaximize={maximize}
              maximizeDisabled={isAssistantLoading}
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
              onMaximize={maximize}
              maximizeDisabled={isAssistantLoading}
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
              onMaximize={maximize}
              maximizeDisabled={isAssistantLoading}
              items={history.map((record) => ({ id: record.id, title: conversationTitle(record) }))}
              selectedId={active.id}
              onSelect={(id) => {
                const record = history.find((item) => item.id === id)
                if (record) openConversation(record)
              }}
              onNewChat={() => openConversation(newConversation())}
              pending={isAssistantLoading}
              error={historyError}
              onBack={closeHistory}
              onClose={requestClose}
            />
          )}
          {expandError && <div role="alert" className="absolute bottom-0 inset-x-0 bg-white p-3 text-sm">{expandError}</div>}
        </div>
      )}
    </div>
  )
}
