"use client"
import { useRef, useState } from "react"
import { useStore } from "@/lib/store"
const EMOJIS = ["🔥","✅","👀","💪","🎯","⚡","😅","🚀","💰","📞"]
export function ChatBar() {
  const { me, setBubble, clearBubble } = useStore()
  const [text, setText] = useState("")
  const timer = useRef<NodeJS.Timeout>()
  const send = (msg: string) => {
    if(!me||!msg.trim()) return
    setBubble({memberId:me.id,text:msg.trim(),ts:Date.now()})
    setText("")
    clearTimeout(timer.current)
    timer.current=setTimeout(()=>clearBubble(me.id),8000)
  }
  if(!me) return null
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 h-[64px] flex items-center gap-3 px-4 bg-[#06070a]/96 border-t border-white/[.05] backdrop-blur-sm">
      <span className="flex-shrink-0 text-xl">{me.emoji}</span>
      <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(text)} placeholder={`${me.name} spune ceva...`} maxLength={80} className="flex-1 bg-[#141820] border border-white/8 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/15 outline-none focus:border-yellow-500/35 transition-colors"/>
      <button onClick={()=>send(text)} className="w-9 h-9 flex-shrink-0 bg-yellow-500 rounded-full flex items-center justify-center hover:opacity-85 transition-opacity text-[#06070a] font-bold text-sm">→</button>
      <div className="hidden sm:flex gap-1.5 flex-shrink-0">
        {EMOJIS.map(e=><button key={e} onClick={()=>send(e)} className="w-8 h-8 rounded-lg bg-[#141820] border border-white/8 text-base hover:border-yellow-500/40 hover:scale-110 transition-all flex items-center justify-center">{e}</button>)}
      </div>
    </div>
  )
}
