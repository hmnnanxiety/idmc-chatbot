// Adapted from shadcn/ui Base UI sidebar (MIT).
// https://ui.shadcn.com/docs/components/base/sidebar
// Retains the provider, responsive sheet and composition with IDMC styling.
import { createContext, useContext, useEffect, useState } from 'react'
import type { ComponentProps } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { PanelLeft, X } from 'lucide-react'
import { cn } from '../../lib/utils'

type SidebarContextValue = {
  open: boolean
  openMobile: boolean
  isMobile: boolean
  setOpenMobile: (open: boolean) => void
  toggleSidebar: () => void
}
const SidebarContext = createContext<SidebarContextValue | null>(null)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) throw new Error('Sidebar requires SidebarProvider')
  return context
}

export function SidebarProvider({
  children,
  className,
  ...props
}: ComponentProps<'div'>) {
  const [open, setOpen] = useState(true)
  const [openMobile, setOpenMobile] = useState(false)
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 767px)').matches,
  )
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const update = () => {
      setIsMobile(media.matches)
      setOpenMobile(false)
    }
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  const toggleSidebar = () =>
    isMobile ? setOpenMobile((value) => !value) : setOpen((value) => !value)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'b' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        if (isMobile) setOpenMobile((value) => !value)
        else setOpen((value) => !value)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobile])
  return (
    <SidebarContext.Provider
      value={{ open, openMobile, isMobile, setOpenMobile, toggleSidebar }}
    >
      <div
        data-slot="sidebar-wrapper"
        className={cn('web-layout', className)}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

export function Sidebar({ children }: ComponentProps<'aside'>) {
  const { open, openMobile, isMobile, setOpenMobile } = useSidebar()
  if (isMobile)
    return (
      <Dialog.Root open={openMobile} onOpenChange={setOpenMobile}>
        <Dialog.Portal>
          <Dialog.Backdrop className="web-sidebar-backdrop" />
          <Dialog.Popup
            className="idmc-chatbot web-sidebar web-sidebar-mobile"
            aria-describedby={undefined}
          >
            <Dialog.Title className="sr-only">Navigasi percakapan</Dialog.Title>
            <Dialog.Close
              className="web-icon-button web-sidebar-close"
              aria-label="Tutup sidebar"
            >
              <X size={18} />
            </Dialog.Close>
            {children}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    )
  return (
    <aside
      data-slot="sidebar"
      data-state={open ? 'expanded' : 'collapsed'}
      className="web-sidebar"
      inert={!open}
    >
      {children}
    </aside>
  )
}

export function SidebarTrigger() {
  const { open, openMobile, isMobile, toggleSidebar } = useSidebar()
  return (
    <button
      type="button"
      className="web-icon-button"
      aria-label="Buka atau tutup sidebar"
      aria-expanded={isMobile ? openMobile : open}
      onClick={toggleSidebar}
    >
      <PanelLeft size={20} />
    </button>
  )
}

export function SidebarHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn('web-sidebar-header', className)}
      {...props}
    />
  )
}
export function SidebarContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn('web-sidebar-content', className)}
      {...props}
    />
  )
}
export function SidebarFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn('web-sidebar-footer', className)}
      {...props}
    />
  )
}
export function SidebarMenu(props: ComponentProps<'ul'>) {
  return <ul data-slot="sidebar-menu" className="web-sidebar-menu" {...props} />
}
export function SidebarMenuItem(props: ComponentProps<'li'>) {
  return <li data-slot="sidebar-menu-item" {...props} />
}
export function SidebarMenuButton({
  isActive,
  ...props
}: ComponentProps<'button'> & { isActive?: boolean }) {
  return (
    <button
      type="button"
      data-slot="sidebar-menu-button"
      className="web-history-button"
      aria-current={isActive ? 'page' : undefined}
      {...props}
    />
  )
}
