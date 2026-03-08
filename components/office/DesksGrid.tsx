"use client"
import { DeskCard } from "./DeskCard"
export function DesksGrid() {
  return (
    <main className="flex-1 relative overflow-hidden hall-bg">
      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-500/35 to-transparent" />
        {[15,28,42,58,72,85].map((pct,i)=>(
          <div key={i} className="absolute top-0 w-px" style={{left:`${pct}%`,height:"180px",background:"linear-gradient(180deg, rgba(201,168,76,.5) 0%, rgba(201,168,76,.06) 55%, transparent 100%)",filter:"blur(1px)"}}/>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[42%] floor-grid border-t border-white/[.04]" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[480px] h-[320px] rounded-full blur-3xl" style={{background:"rgba(201,168,76,.03)"}}/>
      </div>
      <div className="relative z-10 h-full flex flex-col justify-center gap-4 px-6 py-4 max-w-3xl mx-auto">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2"><DeskCard memberId="lucian"/></div>
          <DeskCard memberId="liviu"/>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <DeskCard memberId="catalin"/>
          <DeskCard memberId="saitama"/>
          <DeskCard memberId="beleaua"/>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <DeskCard memberId="vlad"/>
          <DeskCard memberId="cosmin"/>
          <DeskCard memberId="ioana"/>
        </div>
      </div>
      <div className="absolute bottom-[72px] left-1/2 -translate-x-1/2 flex gap-16 pointer-events-none z-0 opacity-40">
        <div className="flex flex-col items-center gap-1 car-bob">
          <div className="relative w-[100px] h-[44px]">
            <div className="absolute top-0" style={{left:"20%",right:"20%",height:20,borderRadius:"10px 10px 0 0",background:"linear-gradient(135deg,#cc0000,#ff3333)"}}/>
            <div className="absolute bottom-0 left-0 right-0" style={{height:24,borderRadius:4,background:"linear-gradient(180deg,#990000,#cc0000)",boxShadow:"0 0 22px rgba(200,0,0,.45)"}}/>
          </div>
          <p style={{fontFamily:"Bebas Neue,sans-serif"}} className="text-[10px] tracking-[3px] text-red-500">FERRARI 488</p>
          <p className="font-mono text-[7px] text-white/20">50 LEADS / LUNA</p>
        </div>
        <div className="flex flex-col items-center gap-1 car-bob-2">
          <div className="relative w-[100px] h-[48px]">
            <div className="absolute top-0" style={{left:"8%",right:"8%",height:26,background:"linear-gradient(135deg,#4a4a4a,#606060)",borderRadius:"3px 3px 0 0"}}/>
            <div className="absolute bottom-0 left-0 right-0" style={{height:26,background:"linear-gradient(180deg,#3a3a3a,#1a1a1a)",borderRadius:3,boxShadow:"0 0 18px rgba(100,100,100,.25)"}}/>
          </div>
          <p style={{fontFamily:"Bebas Neue,sans-serif"}} className="text-[10px] tracking-[3px] text-stone-400">MERCEDES G63</p>
          <p className="font-mono text-[7px] text-white/20">100K RON / LUNA</p>
        </div>
      </div>
    </main>
  )
}
