"use client"
import { create } from "zustand"
import type { Member, KanbanCard, KanbanCol, CallerScore, Payment, BubbleMsg, MemberId } from "@/types"
const now = () => new Date().toISOString()
const uid = () => Math.random().toString(36).slice(2)
const SEED_CARDS: KanbanCard[] = [
  { id:uid(), title:"Apel prospectare - Fitness Club Nord", type:"lead", priority:"high", column:"todo", createdById:"lucian", createdAt:now() },
  { id:uid(), title:"SEO audit - Restaurant Bella Vista", type:"task", priority:"medium", column:"todo", createdById:"lucian", createdAt:now() },
  { id:uid(), title:"Meniu digital QR - Pizzeria Luna", type:"task", priority:"high", column:"inProgress", assigneeId:"vlad", createdById:"lucian", createdAt:now() },
  { id:uid(), title:"Reels Instagram - Salon Luxe", type:"task", priority:"medium", column:"inProgress", assigneeId:"liviu", createdById:"lucian", createdAt:now() },
  { id:uid(), title:"Landing page - Auto Service Popa", type:"task", priority:"low", column:"done", assigneeId:"cosmin", createdById:"lucian", createdAt:now() },
]
const SEED_SCORES: CallerScore[] = [
  { memberId:"catalin", leadsSetate:4, leadsSunate:14 },
  { memberId:"saitama", leadsSetate:6, leadsSunate:19 },
  { memberId:"beleaua", leadsSetate:3, leadsSunate:8 },
]
const SEED_PAYMENTS: Payment[] = [
  { id:uid(), clientName:"Salon Luxe", amount:1200, currency:"RON", dueDate:"2026-03-10", status:"due", createdAt:now() },
  { id:uid(), clientName:"Auto Service Popa", amount:850, currency:"RON", dueDate:"2026-03-15", status:"pending", createdAt:now() },
  { id:uid(), clientName:"Cafenea Boema", amount:2400, currency:"RON", dueDate:"2026-03-20", status:"pending", createdAt:now() },
  { id:uid(), clientName:"Fitness Center Nord", amount:3200, currency:"RON", dueDate:"2026-03-28", status:"pending", createdAt:now() },
]
interface Store {
  me: Member|null; setMe:(m:Member|null)=>void
  onlineIds: MemberId[]; addOnline:(id:MemberId)=>void; removeOnline:(id:MemberId)=>void
  bubbles: Partial<Record<MemberId,BubbleMsg>>; setBubble:(b:BubbleMsg)=>void; clearBubble:(id:MemberId)=>void
  cards: KanbanCard[]; addCard:(c:KanbanCard)=>void; moveCard:(id:string,col:KanbanCol)=>void
  scores: CallerScore[]; incScore:(id:MemberId,field:"leadsSetate"|"leadsSunate")=>void
  payments: Payment[]; addPayment:(p:Payment)=>void; collectPayment:(id:string)=>void
  liviuFlash:boolean; triggerFlash:()=>void
  kanbanOpen:boolean; setKanbanOpen:(v:boolean)=>void
}
export const useStore = create<Store>((set)=>({
  me:null, setMe:(m)=>set({me:m}),
  onlineIds:[], addOnline:(id)=>set(s=>({onlineIds:[...new Set([...s.onlineIds,id])]})), removeOnline:(id)=>set(s=>({onlineIds:s.onlineIds.filter(x=>x!==id)})),
  bubbles:{}, setBubble:(b)=>set(s=>({bubbles:{...s.bubbles,[b.memberId]:b}})), clearBubble:(id)=>set(s=>{const n={...s.bubbles};delete n[id];return{bubbles:n}}),
  cards:SEED_CARDS, addCard:(c)=>set(s=>({cards:[...s.cards,c]})), moveCard:(id,col)=>set(s=>({cards:s.cards.map(c=>c.id===id?{...c,column:col}:c)})),
  scores:SEED_SCORES, incScore:(id,field)=>set(s=>({scores:s.scores.map(sc=>sc.memberId===id?{...sc,[field]:sc[field]+1}:sc)})),
  payments:SEED_PAYMENTS, addPayment:(p)=>set(s=>({payments:[...s.payments,p]})), collectPayment:(id)=>set(s=>({payments:s.payments.map(p=>p.id===id?{...p,status:"collected"}:p)})),
  liviuFlash:false, triggerFlash:()=>{set({liviuFlash:true});setTimeout(()=>set({liviuFlash:false}),750)},
  kanbanOpen:false, setKanbanOpen:(v)=>set({kanbanOpen:v}),
}))
