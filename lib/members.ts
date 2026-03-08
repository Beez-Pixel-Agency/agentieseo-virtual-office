import type { Member, MemberId } from "@/types"
export const MEMBERS: Member[] = [
  { id:"lucian",  name:"Lucian",  pin:"1111", emoji:"🏢", role:"ceo",       title:"CEO · PR · Networking", color:"gold" },
  { id:"catalin", name:"Catalin", pin:"2222", emoji:"📞", role:"sales",     title:"Manager Sales · Caller", color:"sky" },
  { id:"saitama", name:"Saitama", pin:"3333", emoji:"🖥️", role:"dev",       title:"Coder / Dev", color:"neon" },
  { id:"beleaua", name:"Beleaua", pin:"4444", emoji:"🎯", role:"setter",    title:"Setter · Closer · CST", color:"orange" },
  { id:"liviu",   name:"Liviu",   pin:"5555", emoji:"🎥", role:"multimedia",title:"Multimedia · Photo · Video", color:"violet" },
  { id:"vlad",    name:"Vlad",    pin:"6666", emoji:"💻", role:"dev",       title:"Coder / Dev · Part-Time", color:"neon" },
  { id:"cosmin",  name:"Cosmin",  pin:"7777", emoji:"🌐", role:"seo",       title:"Web Dev + SEO · Part-Time", color:"sage" },
  { id:"ioana",   name:"Ioana",   pin:"8888", emoji:"🚨", role:"emergency", title:"Emergency Setting · Video Production", color:"ember" },
]
export const getMember = (id: string) => MEMBERS.find(m => m.id === id) ?? null
export const getMemberByPin = (pin: string) => MEMBERS.find(m => m.pin === pin) ?? null
export const DESK_BORDER: Record<Member["role"], string> = { ceo:"border-yellow-500/50", sales:"border-blue-500/30", dev:"border-cyan-500/30", multimedia:"border-violet-500/40", setter:"border-orange-500/30", seo:"border-green-500/25", emergency:"border-red-500/40" }
