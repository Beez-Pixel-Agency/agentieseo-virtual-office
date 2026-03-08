"use client"
import { useEffect, useRef, useState } from "react"
import { useStore } from "@/lib/store"
import { getMember, DESK_BORDER } from "@/lib/members"
import { cn } from "@/lib/utils"
import type { MemberId } from "@/types"
const GearSVG = ({ size=36, color="rgba(201,168,76,.18)" }: { size?: number; color?: string }) => {
  const r=size/2,ir=r*0.55,toothH=r*0.22,pts:string[]=[]
  const teeth=8
  for(let i=0;i<teeth;i++){
    const a1=(i/teeth)*2*Math.PI,a2=((i+0.35)/teeth)*2*Math.PI,a3=((i+0.65)/teeth)*2*Math.PI,a4=((i+1)/teeth)*2*Math.PI
    pts.push(`${r+ir*Math.cos(a1)},${r+ir*Math.sin(a1)}`)
    pts.push(`${r+(ir+toothH)*Math.cos(a2)},${r+(ir+toothH)*Math.sin(a2)}`)
    pts.push(`${r+(ir+toothH)*Math.cos(a3)},${r+(ir+toothH)*Math.sin(a3)}`)
    pts.push(`${r+ir*Math.cos(a4)},${r+ir*Math.sin(a4)}`)
  }
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{overflow:"visible"}}><polygon points={pts.join(" ")} fill={color}/><circle cx={r} cy={r} r={r*0.28} fill="none" stroke={color} strokeWidth="1.5"/></svg>
}
export function DeskCard({ memberId }: { memberId: MemberId }) {
  const { me, onlineIds, bubbles, clearBubble, liviuFlash, triggerFlash, setKanbanOpen } = useStore()
  const member = getMember(memberId)!
  const isMe = me?.id === memberId
  const online = onlineIds.includes(memberId) || isMe
  const bubble = bubbles[memberId]
  const [showBubble, setShowBubble] = useState(false)
  const timer = useRef<NodeJS.Timeout>()
  useEffect(()=>{ if(bubble){setShowBubble(true);clearTimeout(timer.current);timer.current=setTimeout(()=>{setShowBubble(false);clearBubble(memberId)},8000)} },[bubble])
  const isCeo = member.role==="ceo"
  const isLiviu = member.role==="multimedia"
  const isDev = member.role==="dev"
  const gearColor = isMe ? "rgba(201,168,76,.32)" : "rgba(255,255,255,.09)"
  return (
    <div onClick={()=>setKanbanOpen(true)} className={cn("relative flex flex-col items-center gap-2 rounded-xl border px-3 py-3.5 cursor-pointer transition-all duration-300 group hover:-translate-y-0.5", DESK_BORDER[member.role], isCeo&&"bg-gradient-to-br from-[#141820] via-[#1a1e30] to-[#141820] animate-glow-ceo", !isCeo&&"bg-[#141820]", isMe&&"ring-1 ring-yellow-500/30")}>
      <div className={cn("gear-wrap", online&&"active")}>
        <div className="gear-svg-a" style={{position:"absolute",top:-4,left:-4}}><GearSVG size={28} color={gearColor}/></div>
        <div className="gear-svg-b" style={{position:"absolute",bottom:-4,right:-4}}><GearSVG size={20} color={gearColor}/></div>
      </div>
      <div className="absolute top-2.5 right-2.5 z-10">
        <span className={cn("block w-2 h-2 rounded-full transition-all", online?"bg-green-400 shadow-[0_0_7px_#22c55e] dot-pulse":"bg-white/10")} />
      </div>
      {showBubble && bubble && (
        <div className="absolute -top-12 left-1/2 z-20 bubble-animate bg-white text-[#06070a] text-[11px] font-semibold px-3 py-1.5 rounded-xl rounded-bl-sm shadow-lg whitespace-nowrap max-w-[160px] truncate" style={{transform:"translateX(-50%)"}}>
          {bubble.text}<span className="absolute -bottom-[7px] left-3.5 border-4 border-transparent border-t-white" />
        </div>
      )}
      <div className={cn("relative z-10 rounded-full border-2 flex items-center justify-center bg-white/[.04] transition-all group-hover:scale-105", isCeo?"w-16 h-16 text-4xl border-yellow-500/60":"w-12 h-12 text-2xl border-white/10", online&&!isCeo&&"border-green-400/50")}>
        {member.emoji}
        {isMe&&<span className="absolute -bottom-1 -right-1 text-[10px] font-mono text-yellow-500/80 bg-yellow-500/15 border border-yellow-500/30 px-1 rounded leading-tight">YOU</span>}
      </div>
      <div className="text-center z-10">
        <p className="font-bold text-[12px] text-white leading-none">{member.name}</p>
        <p className="font-mono text-[8px] text-white/25 mt-0.5 leading-snug">{member.title}</p>
      </div>
      {isDev&&<div className="flex gap-1 mt-1 z-10 justify-center">{[48,32].map((w,i)=><div key={i} className="bg-[#06070a] border border-cyan-500/20 rounded" style={{width:w,height:24,padding:3}}>{[...Array(3)].map((_,j)=><div key={j} className="h-0.5 bg-cyan-500/30 rounded mb-0.5" style={{width:`${50+j*15}%`}}/>)}</div>)}</div>}
      {(member.role==="sales"||member.role==="setter")&&<div className="z-10 mt-1"><span className="font-mono text-[8px] text-sky-400/60 border border-sky-500/20 bg-sky-500/5 px-2 py-0.5 rounded-full">🎧 ON CALL</span></div>}
      {member.role==="emergency"&&<div className="z-10 mt-1"><span className="font-mono text-[8px] text-red-400/70 border border-red-500/30 bg-red-500/5 px-2 py-0.5 rounded-full animate-pulse">🚨 EMERGENCY</span></div>}
      {isLiviu&&isMe&&<button onClick={e=>{e.stopPropagation();triggerFlash()}} className="z-10 w-full font-mono text-[9px] text-violet-400 border border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/15 py-1 rounded-lg transition-all mt-1">📸 ACTIVITATE</button>}
      {isLiviu&&liviuFlash&&<div className="absolute inset-0 rounded-xl bg-white pointer-events-none z-30 flash-liviu"/>}
    </div>
  )
}
