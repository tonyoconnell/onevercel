import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ModeToggle } from '@/components/ModeToggle'
import {
  Home,
  Code2,
  MessageSquare,
  FileText,
  Scale,
  Menu
} from 'lucide-react'

// Configuration
const MOBILE_BREAKPOINT = 768

const navigation = [
  { title: "Home", path: "/", icon: Home },
  { title: "Software", path: "/software", icon: Code2 },
  { title: "Chat", path: "/chat", icon: MessageSquare },
  { title: "README", path: "/readme", icon: FileText },
  { title: "License", path: "/mit-license", icon: Scale },
] as const

// Components
const DesktopSidebar = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [activePath, setActivePath] = useState('')

  useEffect(() => {
    setActivePath(window.location.pathname)
    const handleRouteChange = () => setActivePath(window.location.pathname)
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  return (
    <aside
      className={cn(
        "fixed left-0 h-screen bg-[var(--sidebar-bg)] z-[60]",
        "transition-all duration-300 ease-out flex flex-col group",
        "w-[64px] hover:w-64" // Fixed width for non-open state
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-16 flex items-center justify-center">
        <img
          src={isHovered ? "/logo.svg" : "/icon.svg"}
          alt="Logo"
          className="h-8 transition-opacity duration-300"
        />
      </div>

      <nav className="flex-1 pl-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center h-12 px-4 gap-4",
                "hover:bg-[var(--sidebar-hover)] text-[hsl(var(--sidebar-fg))]",
                "transition-colors duration-200",
                activePath === item.path && "bg-[var(--sidebar-active)]"
              )}
            >
              <Icon className="w-5 h-5 min-w-[20px]" />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.title}
              </span>
            </a>
          )
        })}
      </nav>

      <div className="p-4">
        <div className="flex items-center gap-4">
          <ModeToggle />
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Toggle Theme
          </span>
        </div>
      </div>
    </aside>
  )
}

const MobileHeader = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activePath, setActivePath] = useState('')

  useEffect(() => {
    setActivePath(window.location.pathname)
    const handleRouteChange = () => {
      setActivePath(window.location.pathname)
      setIsOpen(false)
    }
    window.addEventListener('popstate', handleRouteChange)
    return () => window.removeEventListener('popstate', handleRouteChange)
  }, [])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-[var(--sidebar-bg)] z-40 flex items-center px-4 border-b border-[var(--sidebar-border)]">
        <button
          onClick={() => setIsOpen(true)}
          className="text-[hsl(var(--sidebar-fg))] p-2"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 flex justify-center">
          <img src="/icon.svg" alt="Logo" className="h-6" />
        </div>

        <ModeToggle />
      </header>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsOpen(false)}>
          <div
            className="w-[64px] h-full bg-[var(--sidebar-bg)] p-4 animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "flex items-center h-12 px-4 gap-3",
                      "hover:bg-[var(--sidebar-hover)] text-[hsl(var(--sidebar-fg))]",
                      activePath === item.path && "bg-[var(--sidebar-active)]"
                    )}
                  >
                    <Icon className="w-5 h-5 pl-1" />
                    <span>{item.title}</span>
                  </a>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}

export function Sidebar() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile ? <MobileHeader /> : <DesktopSidebar />
}