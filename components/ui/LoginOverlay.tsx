"use client"
import { useState } from "react"
import { useStore } from "@/lib/store"
import { getMemberByPin, MEMBERS } from "@/lib/members"
import { cn } from "@/lib/utils"
export function LoginOverlay() {
  const { setMe, addOnline } = useStore()
  const [pin, setPin] = useState("")
  const [shake, setShake] = useState(false)
  const [hint, setHint] = useState("")
  const press = (d: string) => {
    if (pin.length >= 4) return
    const next = pin + d
    setPin(next)
    if (next.length === 4) {
      const found = getMemberByPin(next)
      if (found) { setMe(found); addOnline(found.id) }
      else { setShake(true); setHint("PIN gresit!"); setTimeout(()=>{setPin("");setShake(false);setHint("")},700) }
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06070a]/97 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-yellow-500/4 blur-3xl" />
      </div>
      <div className="relative flex flex-col items-center gap-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-500/50" />
            <span style={{fontFamily:"Bebas Neue,sans-serif"}} className="text-5xl tracking-[6px] text-white">AGENTIE<span className="text-yellow-500">SEO</span></span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-500/50" />
          </div>
          <p className="text-[11px] tracking-[4px] text-white/25 font-mono">VIRTUAL OFFICE · INTERN</p>
        </div>
        <div className={cn("flex flex-col items-center gap-3", shake && "pin-shake")}>
          <p className="font-mono text-[11px] text-white/30 tracking-widest">INTRODU CODUL TAU</p>
          <div className="flex gap-3">
            {[0,1,2,3].map(i=>(
              <div key={i} className={cn("w-4 h-4 rounded-full border-2 transition-all duration-200", i < pin.length ? "bg-yellow-500 border-yellow-500 shadow-[0_0_12px_rgba(201,168,76,.6)]" : "bg-transparent border-white/15")} />
            ))}
          </div>
          {hint && <p className="font-mono text-[10px] text-red-400 animate-bounce">{hint}</p>}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k,i)=>(
            <button key={i} onClick={()=>k==="⌫"?setPin(p=>p.slice(0,-1)):k!==""?press(k):undefined} disabled={k===""} className={cn("w-16 h-16 rounded-xl text-2xl transition-all duration-150 active:scale-90 font-bold", k===""&&"invisible", k==="⌫"?"bg-[#141820] border border-white/10 text-white/40 hover:text-red-400":"bg-[#141820] border border-white/10 text-white hover:border-yellow-500/50 hover:bg-yellow-500/8")}>
              {k}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3 mt-2">
          {MEMBERS.map(m=>(
            <div key={m.id} className="flex flex-col items-center gap-1 opacity-50">
              <span className="text-2xl">{m.emoji}</span>
              <span className="font-mono text-[8px] text-white/30">{m.name}</span>
              <span className="font-mono text-[10px] text-yellow-500/40">{m.pin}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
