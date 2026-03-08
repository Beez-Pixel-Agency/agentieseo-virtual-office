"use client"
import { useState } from "react"
import { useStore } from "@/lib/store"
import { statusCfg, cn } from "@/lib/utils"
import type { Payment } from "@/types"
export function FinancialPanel() {
  const { me, payments, addPayment, collectPayment } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [client, setClient] = useState("")
  const [amount, setAmount] = useState("")
  const [dueDate, setDueDate] = useState("")
  const pending = payments.filter(p=>p.status!=="collected")
  const collected = payments.filter(p=>p.status==="collected")
  const totalPending = pending.reduce((s,p)=>s+p.amount,0)
  const totalCollected = collected.reduce((s,p)=>s+p.amount,0)
  const totalRulaj = payments.reduce((s,p)=>s+p.amount,0)
  const handleAdd = () => {
    if(!client.trim()||!amount) return
    const p: Payment = { id:Math.random().toString(36).slice(2), clientName:client.trim(), amount:Number(amount), currency:"RON", dueDate:dueDate||new Date().toISOString().split("T")[0], status:"pending", createdAt:new Date().toISOString() }
    addPayment(p); setClient(""); setAmount(""); setDueDate(""); setShowForm(false)
  }
  const isCeo = me?.role==="ceo"
  const sorted = [...payments].sort((a,b)=>["due","overdue","pending","collected"].indexOf(a.status)-["due","overdue","pending","collected"].indexOf(b.status))
  return (
    <aside className="w-[252px] flex-shrink-0 flex flex-col bg-[#0b0d13] border-l border-white/[.05] overflow-hidden slide-up">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[.05]">
        <div className="flex items-center gap-2"><span className="text-yellow-500 text-sm">💰</span><span style={{fontFamily:"Bebas Neue,sans-serif"}} className="text-sm tracking-widest">FINANCIAR</span></div>
        {isCeo&&<button onClick={()=>setShowForm(!showForm)} className={cn("p-1.5 rounded-lg border transition-all text-sm",showForm?"text-red-400 border-red-400/40":"text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/10")}>{showForm?"✕":"+"}</button>}
      </div>
      <div className="grid grid-cols-2 gap-px bg-white/[.04] border-b border-white/[.05]">
        <div className="bg-[#0b0d13] px-3 py-3"><p className="font-mono text-[8px] text-white/25 mb-1">DE INCASAT</p><p style={{fontFamily:"Bebas Neue,sans-serif"}} className="text-xl text-yellow-500 leading-none">{totalPending.toLocaleString("ro-RO")}</p><p className="font-mono text-[8px] text-white/20">RON</p></div>
        <div className="bg-[#0b0d13] px-3 py-3"><p className="font-mono text-[8px] text-white/25 mb-1">INCASAT</p><p style={{fontFamily:"Bebas Neue,sans-serif"}} className="text-xl text-green-400 leading-none">{totalCollected.toLocaleString("ro-RO")}</p><p className="font-mono text-[8px] text-white/20">RON</p></div>
      </div>
      <div className="px-4 py-2.5 border-b border-white/[.05] bg-yellow-500/[.04]">
        <div className="flex items-center justify-between"><span className="font-mono text-[9px] text-yellow-500/60 tracking-wider">RULAJ TOTAL</span><span style={{fontFamily:"Bebas Neue,sans-serif"}} className="text-lg text-yellow-500">{totalRulaj.toLocaleString("ro-RO")} RON</span></div>
        <div className="mt-1.5"><div className="h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full transition-all duration-500" style={{width:`${totalRulaj>0?Math.min((totalCollected/totalRulaj)*100,100):0}%`}}/></div>
        <p className="font-mono text-[7px] text-white/15 mt-1 text-right">{totalRulaj>0?Math.round((totalCollected/totalRulaj)*100):0}% colectat</p></div>
      </div>
      {showForm&&isCeo&&(
        <div className="px-3 py-3 border-b border-white/[.05] bg-[#141820]/60 space-y-2">
          <input value={client} onChange={e=>setClient(e.target.value)} placeholder="Nume client *" className="w-full bg-[#06070a] border border-white/8 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder:text-white/15 outline-none focus:border-yellow-500/40"/>
          <div className="flex gap-2">
            <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Suma RON *" type="number" className="flex-1 bg-[#06070a] border border-white/8 rounded-lg px-2.5 py-1.5 text-[11px] text-white placeholder:text-white/15 outline-none focus:border-yellow-500/40"/>
            <input value={dueDate} onChange={e=>setDueDate(e.target.value)} type="date" className="flex-1 bg-[#06070a] border border-white/8 rounded-lg px-2.5 py-1.5 text-[11px] text-white outline-none focus:border-yellow-500/40"/>
          </div>
          <button onClick={handleAdd} className="w-full bg-yellow-500 text-[#06070a] font-mono text-[10px] font-bold py-2 rounded-lg hover:opacity-85 transition-opacity">✅ ADAUGA</button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {sorted.map((p,i)=>{
          const cfg=statusCfg(p.status)
          return (
            <div key={p.id} className={cn("bg-[#141820] border border-white/[.05] rounded-xl p-3 transition-all pay-entry",p.status==="collected"&&"opacity-40")}>
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <p className="font-bold text-[11px] text-white/90 leading-tight truncate">{p.clientName}</p>
                <span className={cn("font-mono text-[7px] px-1.5 py-0.5 rounded border flex-shrink-0",cfg.cls)}>{cfg.label}</span>
              </div>
              <p style={{fontFamily:"Bebas Neue,sans-serif"}} className="text-xl text-yellow-500 leading-none mb-1">{p.amount.toLocaleString("ro-RO")}<span className="text-xs ml-1 text-yellow-500/50">RON</span></p>
              <div className="flex items-center justify-between">
                <p className="font-mono text-[8px] text-white/20">📅 {p.dueDate}</p>
                {p.status!=="collected"&&isCeo&&<button onClick={()=>collectPayment(p.id)} className="font-mono text-[8px] text-green-400 border border-green-400/30 bg-green-500/5 hover:bg-green-500/15 px-2 py-1 rounded-lg transition-all">✓ INCASAT</button>}
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
