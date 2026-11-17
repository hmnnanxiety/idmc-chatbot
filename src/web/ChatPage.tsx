import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, MessageSquare, Plus, Trash2 } from 'lucide-react'
import idmcIcon from '../assets/figma/idmc-logo.svg'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '../components/ui/sidebar'
import { ChatInput } from '../components/chatbot/ChatInput'
import { HeroTitle } from '../components/chatbot/HeroTitle'
import { MessageList } from '../components/chatbot/MessageList'
import { SuggestionList } from '../components/chatbot/SuggestionList'
import { widgetClasses } from '../components/chatbot/layout'
import { useChatSession } from '../components/chatbot/useChatSession'
import { conversationTitle, newConversation } from '../components/chatbot/conversation'
import type { SavedConversation } from '../components/chatbot/conversation'
import {
  CONVERSATION_PREFIX,
  initialConversation,
  readConversations,
} from './conversationStorage'

const suggestions = [
  'Data penduduk DIY',
  'Statistik pendidikan',
  'Dashboard Koperasi',
]

function Conversation({
  conversation,
  onSave,
}: {
  conversation: SavedConversation
  onSave: (conversation: SavedConversation) => void
}) {
  const { messages, isAssistantLoading, sendMessage } = useChatSession(
    undefined,
    conversation.messages,
  )
  const latest = useRef({ messages, isAssistantLoading })
  useEffect(() => {
    latest.current = { messages, isAssistantLoading }
  }, [messages, isAssistantLoading])
  useEffect(
    () => () => {
      if (latest.current.isAssistantLoading) {
        onSave({
          id: conversation.id,
          updatedAt: Date.now(),
          messages: [
            ...latest.current.messages,
            {
              id: crypto.randomUUID(),
              role: 'assistant',
              status: 'error',
              text: 'Jawaban dihentikan saat berpindah percakapan. Kirim ulang pertanyaan untuk mencoba lagi.',
            },
          ],
        })
      }
    },
    [conversation.id, onSave],
  )
  useEffect(() => {
    if (messages.length)
      onSave({ id: conversation.id, messages, updatedAt: Date.now() })
  }, [messages, conversation.id, onSave])
  const hasMessages = messages.length > 0
  return (
    <div
      className={`web-conversation ${hasMessages ? 'web-conversation-active' : 'web-conversation-home'}`}
    >
      {hasMessages ? (
        <MessageList
          messages={messages}
          isAssistantLoading={isAssistantLoading}
        />
      ) : (
        <div className="web-welcome">
          <HeroTitle
            title="Chatbot Data Publik"
            tagline="Jelajahi Data, Kenali Yogyakarta."
          />
        </div>
      )}
      <div className="web-composer">
        <ChatInput
          variant={hasMessages ? 'chat' : 'home'}
          placeholder="Tanyakan sesuatu tentang data DIY..."
          onSubmit={sendMessage}
          submitDisabled={isAssistantLoading}
          autoFocus
        />
        {!hasMessages && (
          <SuggestionList items={suggestions} onSelect={sendMessage} />
        )}
        {hasMessages && (
          <p className="web-composer-note">
            Periksa kembali jawaban dengan sumber data terkait.
          </p>
        )}
      </div>
    </div>
  )
}

function ChatWorkspace() {
  const [initial] = useState(initialConversation)
  const [active, setActive] = useState(initial.conversation)
  const [records, setRecords] = useState<SavedConversation[]>(() => {
    try {
      return readConversations()
    } catch {
      return []
    }
  })
  const [notice, setNotice] = useState(initial.error ?? '')
  const deletedIds = useRef(new Set<string>())
  const { setOpenMobile } = useSidebar()
  useEffect(() => {
    if (window.location.hash.startsWith('#conversation=')) {
      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      )
    }
    const refresh = (event: StorageEvent) => {
      if (event.key === null || event.key.startsWith(CONVERSATION_PREFIX)) {
        try {
          setRecords(readConversations())
        } catch {
          /* Keep the current session usable. */
        }
      }
    }
    window.addEventListener('storage', refresh)
    return () => window.removeEventListener('storage', refresh)
  }, [])
  const save = useCallback((conversation: SavedConversation) => {
    if (deletedIds.current.has(conversation.id)) return
    setRecords((previous) => [
      conversation,
      ...previous.filter((item) => item.id !== conversation.id),
    ])
    try {
      localStorage.setItem(
        CONVERSATION_PREFIX + conversation.id,
        JSON.stringify(conversation),
      )
    } catch {
      setNotice(
        'Riwayat belum dapat disimpan di browser ini. Percakapan tetap tersedia selama tab terbuka.',
      )
    }
  }, [])
  const select = (conversation: SavedConversation) => {
    // Ignore selecting the current row so pending requests keep their lifecycle.
    if (conversation.id !== active.id) setActive(conversation)
    setOpenMobile(false)
  }
  const remove = (conversation: SavedConversation) => {
    try {
      localStorage.removeItem(CONVERSATION_PREFIX + conversation.id)
    } catch {
      setNotice('Riwayat gagal dihapus dari penyimpanan browser.')
      return
    }
    deletedIds.current.add(conversation.id)
    setRecords((previous) =>
      previous.filter((item) => item.id !== conversation.id),
    )
    if (active.id === conversation.id) select(newConversation())
  }
  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <a
            className="web-brand"
            href="https://idmc.jogjaprov.go.id/"
            target="_blank"
            rel="noreferrer"
          >
            <img src={idmcIcon} alt="" />
            <span>
              IDMC
              <span className="web-brand-caption">
                Daerah Istimewa Yogyakarta
              </span>
            </span>
          </a>
          <button
            className="web-new-chat"
            type="button"
            onClick={() => select(newConversation())}
          >
            <Plus size={18} />
            Chat baru
          </button>
        </SidebarHeader>
        <SidebarContent>
          <h2 className="web-history-label">Riwayat percakapan</h2>
          {records.length === 0 && (
            <p className="web-empty-history">
              Percakapanmu akan muncul di sini.
            </p>
          )}
          <SidebarMenu>
            {records.map((record) => (
              <SidebarMenuItem key={record.id}>
                <SidebarMenuButton
                  isActive={active.id === record.id}
                  onClick={() => select(record)}
                  title={conversationTitle(record)}
                >
                  <MessageSquare size={16} />
                  <span>{conversationTitle(record)}</span>
                </SidebarMenuButton>
                <button
                  type="button"
                  className="web-delete-chat"
                  aria-label={`Hapus percakapan ${conversationTitle(record)}`}
                  onClick={() => remove(record)}
                >
                  <Trash2 size={15} />
                </button>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <span className="web-local-note">
            Riwayat tersimpan di browser ini
          </span>
          <a
            href="https://idmc.jogjaprov.go.id/"
            target="_blank"
            rel="noreferrer"
          >
            Buka portal IDMC
            <ArrowUpRight size={16} />
          </a>
        </SidebarFooter>
      </Sidebar>
      <main className="web-main">
        <header className="web-header">
          <SidebarTrigger />
          <span>Chatbot Data Publik</span>
          {/* <button
            className="web-icon-button web-header-new"
            type="button"
            aria-label="Chat baru"
            onClick={() => select(newConversation())}
          >
            <Plus size={20} />
          </button> */}
        </header>
        {notice && (
          <div className="web-notice" role="status">
            {notice}
            <button type="button" onClick={() => setNotice('')}>
              Tutup
            </button>
          </div>
        )}
        <Conversation key={active.id} conversation={active} onSave={save} />
      </main>
    </>
  )
}

export function ChatPage() {
  return (
    <SidebarProvider className={`idmc-chatbot ${widgetClasses}`}>
      <ChatWorkspace />
    </SidebarProvider>
  )
}
