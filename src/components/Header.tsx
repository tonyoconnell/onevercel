import { SidebarTrigger } from "@/components/ui/sidebar"

interface HeaderProps {
  children: React.ReactNode
}

export function Header({ children }: HeaderProps) {
  return (
    <div className="flex items-center gap-4">
      <SidebarTrigger />
      {children}
    </div>
  )
}