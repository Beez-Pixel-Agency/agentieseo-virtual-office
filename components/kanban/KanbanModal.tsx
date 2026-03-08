"use client"
import { useState } from "react"
import { useStore } from "@/lib/store"
import { priorityCfg, cn } from "@/lib/utils"
import type { KanbanCard, KanbanCol, CardType, CardPriority } from "@/types"
const COLS: {key:KanbanCol;label:string;color:string}[] = [{key:"todo",label:"TO DO",color:"text-white/35"},{key:"inProgress",label:"IN PROGRESS",color:"text-yellow-500"},{key:"done",label:"✓ DONE",color:"text-green-400"}]
export function KanbanModal() {
  const { setKanbanOpen, cards, addCard, moveCard, me } = useStore()
  const [dragId, setDragId] = useState<string|null>(null)
  const [overCol, setOverCol] = useState<KanbanCol|null>(null)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [type, setType] = useState<CardType>("task")
  const [priority, setPriority] = useState<CardPriority>("medium")
  const handleAdd = () => {
    if(!title.trim()||!me) return
    addCard({id:Math.random().toString(36).slice(2),title:title.trim(),type,priority,column:"todo",createdById:me.id,createdAt:new Date().toISOString()})
    setTitle(""); setShowForm(false)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#06070a]/80 backdrop-blur-lg" onClick={()=>setKanbanOpen(false)}/>
      <div className="relative w-full max-w-3xl max-h-[88vh] flex flex-col bg-[#10131a] border border-white/[.07] rounded-2xl overflow-hidden slide-up shadow-[0_0_80px_rgba(0,0,0,.9)]">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[.06]">
          <div className="flex items-center gap-3"><span style={{fontFamily:"Bebas Neue,sans-serif"}} className="text-xl tracking-widest">TASK BOARD</span><span className="font-mono text-[9px] text-white/20 border border-white/8 px-2 py-0.5 rounded">{cards.length} cards</span></div>
          <div className="flex items-center gap-2">
            {me?.role==="ceo"&&<button onClick={()=>setShowForm(!showForm)} className={cn("font-mono text-[10px] px-3 py-1.5 rounded-lg border transition-all",showForm?"text-red-400 border-red-400/40":"text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/8")}>+ ADAUGA</button>}
            <button onClick={()=>setKanbanOpen(false)} className="text-white/20 hover:text-white p-1 text-lg">✕</button>
          </div>
        </div>
        {showForm&&(
          <div className="px-5 py-3 border-b border-white/[.06] bg-[#141820]/50 flex flex-wrap gap-2 items-end">
            <input value={title} onChange={e=>setTitle(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleAdd()} placeholder="Titlu task / lead..." className="flex-1 min-w-[180px] bg-[#06070a] border border-white/8 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-yellow-500/40"/>
            <select value={type} onChange={e=>setType(e.target.value as CardType)} className="bg-[#06070a] border border-white/8 rounded-lg px-3 py-1.5 text-sm text-white outline-none"><option value="task">📌 Task</option><option value="lead">🎯 Lead</option></select>
            <select value={priority} onChange={e=>setPriority(e.target.value as CardPriority)} className="bg-[#06070a] border border-white/8 rounded-lg px-3 py-1.5 text-sm text-white outline-none"><option value="high">🔴 High</option><option value="medium">🟡 Medium</option><option value="low">🟢 Low</option></select>
            <button onClick={handleAdd} className="bg-yellow-500 text-[#06070a] font-mono text-[10px] font-bold px-4 py-2 rounded-lg hover:opacity-85">✅ ADAUGA</button>
          </div>
        )}
        <div className="flex-1 overflow-hidden grid grid-cols-3 divide-x divide-white/[.05]">
          {COLS.map(col=>{
            const colCards=cards.filter(c=>c.column===col.key)
            return (
              <div key={col.key} onDragOver={e=>{e.preventDefault();setOverCol(col.key)}} onDrop={()=>{if(dragId)moveCard(dragId,col.key);setDragId(null);setOverCol(null)}} onDragLeave={()=>setOverCol(null)} className={cn("flex flex-col transition-colors",overCol===col.key&&"bg-yellow-500/[.03]")}>
                <div className={cn("px-4 py-2.5 border-b border-white/[.05] font-mono text-[9px] tracking-widest bg-[#10131a]/95 flex items-center justify-between",col.color)}>{col.label}<span className="text-white/15">{colCards.length}</span></div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {colCards.map(c=>{
                    const p=priorityCfg(c.priority)
                    return (
                      <div key={c.id} draggable onDragStart={()=>setDragId(c.id)} className={cn("bg-[#141820] border border-l-2 rounded-lg p-2.5 cursor-grab active:cursor-grabbing hover:border-white/10 transition-all",p.border)}>
                        <p className="text-[11px] font-medium text-white/85 leading-snug mb-1.5">{c.title}</p>
                        <div className="flex flex-wrap gap-1">
                          <span className={cn("font-mono text-[8px] px-1.5 py-0.5 rounded border",c.type==="lead"?"text-red-400 bg-red-500/10 border-red-500/20":"text-sky-400 bg-sky-500/10 border-sky-500/20")}>{c.type==="lead"?"🎯 LEAD":"📌 TASK"}</span>
                          <span className="font-mono text-[8px] px-1.5 py-0.5 rounded border text-white/25 bg-white/4 border-white/8">{p.label}</span>
                        </div>
                      </div>
                    )
                  })}
                  {colCards.length===0&&<div className="h-16 border border-dashed border-white/[.07] rounded-lg flex items-center justify-center"><span className="font-mono text-[9px] text-white/10">DROP HERE</span></div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
