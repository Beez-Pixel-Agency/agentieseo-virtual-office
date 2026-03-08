"use client"
import { useStore } from "@/lib/store"
import { LoginOverlay } from "@/components/ui/LoginOverlay"
import { TopBar } from "@/components/ui/TopBar"
import { LeadsPanel } from "@/components/ui/LeadsPanel"
import { DesksGrid } from "@/components/office/DesksGrid"
import { FinancialPanel } from "@/components/financial/FinancialPanel"
import { KanbanModal } from "@/components/kanban/KanbanModal"
import { ChatBar } from "@/components/chat/ChatBar"
export default function Page() {
  const { me, kanbanOpen } = useStore()
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {!me && <LoginOverlay />}
      <TopBar />
      <div className="flex h-full pt-[52px] pb-[64px]">
        <LeadsPanel />
        <DesksGrid />
        <FinancialPanel />
      </div>
      <ChatBar />
      {kanbanOpen && <KanbanModal />}
    </div>
  )
}
