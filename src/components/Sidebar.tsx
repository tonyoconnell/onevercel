import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { 
  MessageSquare, 
  Activity,
  FileText,
  type LucideIcon 
} from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  MessageSquare,
  Activity,
  FileText,
}

interface SidebarProps {
  navigation: {
    title: string
    path: string
    icon: string
  }[]
}

export function Sidebar({ navigation }: SidebarProps) {
  const [activePath, setActivePath] = useState('')

  useEffect(() => {
    setActivePath(window.location.pathname)
  }, [])

  return (
    <aside 
      className="group fixed left-0 h-screen w-16 hover:w-60 
                 bg-[hsl(var(--sidebar-bg))] border-r border-[hsl(var(--sidebar-border))]
                 transition-[width] duration-200 ease-out z-50"
    >
      {/* Logo */}
      <a 
        href="/"
        className="h-16 flex items-center hover:bg-[hsl(var(--sidebar-hover))] transition-colors"
      >
        <div className="min-w-[64px] flex items-center justify-center">
          <img 
            src="/logo.svg" 
            alt="Logo" 
            className="w-8 h-8"
          />
        </div>
        <span className="sidebar-text font-semibold">
          Brand
        </span>
      </a>

      {/* Nav */}
      <nav className="space-y-1 py-4">
        {navigation?.map((item) => {
          const Icon = icons[item.icon]
          const isActive = activePath === item.path
          
          return (
            <a
              key={item.path}
              href={item.path}
              className={cn(
                "group flex items-center h-11 w-full hover:bg-[hsl(var(--sidebar-hover))]",
                isActive && "bg-[hsl(var(--sidebar-active))]"
              )}
            >
              <div className="min-w-[64px] flex items-center justify-center">
                {Icon && <Icon className="sidebar-icon" />}
              </div>
              <span className="sidebar-text">
                {item.title}
              </span>
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[hsl(var(--sidebar-fg))]" />
              )}
            </a>
          )
        })}
      </nav>
    </aside>
  )
} 