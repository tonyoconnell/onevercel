import { SidebarProvider } from "@/components/ui/sidebar"
import Header from "./Header"

interface HeaderProps {
  showLeft?: boolean
  showRight?: boolean
}

export function HeaderWithProvider({ showLeft = true, showRight = true }: HeaderProps) {
  return (
    <SidebarProvider>
      <Header showLeft={showLeft} showRight={showRight} />
    </SidebarProvider>
  )
} 