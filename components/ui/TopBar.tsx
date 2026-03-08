"use client"
import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
export function TopBar() {
  const { me, setMe, removeOnline, onlineIds, scores, setKanbanOpen, kanbanOpen } = useStore()
  const [clock, setClock] = useState("")
  const totalSetate = scores.reduce((s,x)=>s+x.leadsSetate,0)
  const totalSunate = scores.reduce((s,x)=>s+x.leadsSunate,0)
  useEffect(()=>{
    const tick=()=>setClock(new Date().toLocaleTimeString("ro-RO",{hour:"2-digit",minute:"2-digit",second:"2-digit"}))
    tick(); const id=setInterval(tick,1000); return()=>clearInterval(id)
  },[])
  return (
    <header className="fixed top-0 left-0 right-0 h-[52px] z-30 flex items-center justify-between px-4 bg-[#06070a]/95 border-b border-white/[.06]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
      <div className="flex items-center gap-2">
        <span className="text-yellow-500 text-sm">⚡</span>
        <span style={{fontFamily:"Bebas Neue,sans-serif"}} className="text-xl tracking-[4px]">AGENTIE<span className="text-yellow-500">SEO</span></span>
      </div>
      <div className="flex items-center gap-3 bg-white/[.03] border border-white/[.06] rounded-full px-4 py-1.5">
        <span className="font-mono text-[9px] text-white/30 tracking-wider">SETATE</span>
        <span style={{fontFamily:"Bebas Neue,sans-serif"}} className="text-xl text-yellow-500 leading-none min-w-[24px] text-center">{totalSetate}</span>
        <span className="w-px h-4 bg-white/10" />
        <span className="font-mono text-[9px] text-white/30 tracking-wider">SUNATE</span>
        <span style={{fontFamily:"Bebas Neue,sans-serif"}} className="text-xl text-sky-400 leading-none min-w-[24px] text-center">{totalSunate}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#22c55e] dot-pulse" />
          <span className="font-mono text-[9px] text-white/25">{onlineIds.length} online</span>
        </div>
        {me && <button onClick={()=>setKanbanOpen(!kanbanOpen)} className={cn("font-mono text-[10px] px-2.5 py-1.5 rounded-lg border transition-all", kanbanOpen?"text-yellow-500 border-yellow-500/50 bg-yellow-500/10":"text-white/30 border-white/8 hover:text-yellow-500 hover:border-yellow-500/30")}>📋 TASKS</button>}
        <span className="font-mono text-xs text-white/30">{clock}</span>
        {me && (
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-yellow-500/70 border border-yellow-500/20 bg-yellow-500/5 px-2 py-1 rounded">{me.emoji} {me.name}</span>
            <button onClick={()=>{removeOnline(me.id);setMe(null)}} className="text-white/20 hover:text-red-400 transition-colors text-xs px-1">✕</button>
          </div>
        )}
      </div>
    </header>
  )
}
