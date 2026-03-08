"use client"
import { useStore } from "@/lib/store"
import { MEMBERS } from "@/lib/members"
import { cn } from "@/lib/utils"
import type { MemberId } from "@/types"
export function LeadsPanel() {
  const { scores, cards, incScore, me } = useStore()
  const totalSetate = scores.reduce((s,x)=>s+x.leadsSetate,0)
  const totalSunate = scores.reduce((s,x)=>s+x.leadsSunate,0)
  const activeTasks = cards.filter(c=>c.column==="inProgress").length
  const doneTasks = cards.filter(c=>c.column==="done").length
  return (
    <aside className="w-[240px] flex-shrink-0 flex flex-col bg-[#0b0d13] border-r border-white/[.05] overflow-hidden slide-up">
      <div className="px-4 py-3 border-b border-white/[.05]">
        <div className="flex items-center gap-2">
          <span className="text-yellow-500 text-sm">📈</span>
          <span style={{fontFamily:"Bebas Neue,sans-serif"}} className="text-sm tracking-widest">PRODUCTIVITATE</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {[{icon:"🎯",label:"LEADS SETATE",value:totalSetate,color:"text-yellow-500"},{icon:"📞",label:"LEADS SUNATE",value:totalSunate,color:"text-sky-400"},{icon:"⚙️",label:"IN LUCRU",value:activeTasks,color:"text-orange-400"},{icon:"✅",label:"FINALIZATE",value:doneTasks,color:"text-green-400"}].map((item,i)=>(
            <div key={i} className="bg-[#141820] border border-white/[.06] rounded-xl p-3 flex flex-col items-center gap-1">
              <span className="text-lg">{item.icon}</span>
              <span style={{fontFamily:"Bebas Neue,sans-serif"}} className={cn("text-3xl leading-none",item.color)}>{item.value}</span>
              <span className="font-mono text-[7px] text-white/25 tracking-wider text-center">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="bg-[#141820] rounded-xl p-3 border border-white/[.05]">
          <div className="flex justify-between mb-1"><span className="font-mono text-[9px] text-white/30">GOAL ZILNIC</span><span className="font-mono text-[9px] text-yellow-500">{totalSetate}/10</span></div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300 rounded-full transition-all" style={{width:`${Math.min((totalSetate/10)*100,100)}%`}} /></div>
          <div className="flex justify-between mt-2 mb-1"><span className="font-mono text-[9px] text-white/30">GOAL LUNAR</span><span className="font-mono text-[9px] text-yellow-500">{totalSetate}/50</span></div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all" style={{width:`${Math.min((totalSetate/50)*100,100)}%`}} /></div>
        </div>
        <p className="font-mono text-[9px] text-white/20 tracking-[3px] px-1">CALLERS</p>
        {scores.map(sc=>{
          const m=MEMBERS.find(x=>x.id===sc.memberId)
          if(!m) return null
          const isMine=me?.id===sc.memberId
          return (
            <div key={sc.memberId} className={cn("bg-[#141820] border rounded-xl p-2.5",isMine?"border-yellow-500/30":"border-white/[.05]")}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5"><span className="text-base">{m.emoji}</span><span className="text-xs font-semibold text-white/80">{m.name}</span></div>
                {isMine&&<span className="font-mono text-[8px] text-yellow-500/60 border border-yellow-500/20 px-1.5 rounded">YOU</span>}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-mono text-yellow-400 bg-yellow-500/10 border-yellow-500/20"><span>🎯</span><span className="opacity-60">Setate</span><span className="ml-auto font-bold">{sc.leadsSetate}</span></div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-mono text-sky-400 bg-sky-500/10 border-sky-500/20"><span>📞</span><span className="opacity-60">Sunate</span><span className="ml-auto font-bold">{sc.leadsSunate}</span></div>
              </div>
              {isMine&&(
                <div className="flex gap-1.5 mt-2">
                  <button onClick={()=>incScore(sc.memberId as MemberId,"leadsSunate")} className="flex-1 font-mono text-[9px] py-1 rounded-lg border border-sky-500/30 text-sky-400 hover:bg-sky-500/10 transition-all">+1 Sunat</button>
                  <button onClick={()=>incScore(sc.memberId as MemberId,"leadsSetate")} className="flex-1 font-mono text-[9px] py-1 rounded-lg border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 transition-all">+1 Setat</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
