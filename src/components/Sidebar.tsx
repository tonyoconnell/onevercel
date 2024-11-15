import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ModeToggle } from '@/components/ModeToggle'
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
                 bg-[#161616] hover:z-50
                 transition-all duration-200 ease-out z-30
                 flex flex-col"
    >
      {/* Logo */}
      <a 
        href="/"
        className="h-16 flex items-center hover:bg-[#222222] transition-colors"
      >
        <div className="min-w-[64px] flex items-center justify-center">
          <img 
            src="/logo.svg" 
            alt="Logo" 
            className="w-6 h-6"
          />
        </div>
        <span className="sidebar-text font-semibold">
          Brand
        </span>
      </a>

      {/* Nav */}
      <nav className="flex-1 space-y-1 py-4">
        {navigation?.map((item) => {
          const Icon = icons[item.icon]
          const isActive = activePath === item.path
          
          return (
            <a
              key={item.path}
              href={item.path}
              className={cn(
                "group flex items-center h-11 w-full hover:bg-[#222222] relative overflow-hidden",
                "before:absolute before:inset-0 before:bg-white/5 before:translate-x-[-100%] before:hover:translate-x-0 before:transition-transform before:duration-300",
                isActive && "bg-[#1a1a1a]"
              )}
            >
              <div className="min-w-[64px] flex items-center justify-center relative z-10">
                {Icon && <Icon className="sidebar-icon" />}
              </div>
              <span className="sidebar-text relative z-10">
                {item.title}
              </span>
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[hsl(var(--sidebar-fg))]" />
              )}
            </a>
          )
        })}
      </nav>

      {/* Theme Toggle at bottom */}
      <div className="p-4">
        <ModeToggle />
      </div>
    </aside>
  )
} 