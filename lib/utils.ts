import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
export const fmtRON = (n: number) => `${n.toLocaleString("ro-RO")} RON`
export const priorityCfg = (p: string) => (({ high:{dot:"bg-ember",label:"🔴 High",border:"border-l-ember"}, medium:{dot:"bg-gold",label:"🟡 Medium",border:"border-l-gold"}, low:{dot:"bg-sage",label:"🟢 Low",border:"border-l-sage"} } as any)[p] ?? {dot:"bg-rim",label:"—",border:"border-l-rim"})
export const statusCfg = (s: string) => (({ due:{label:"SCADENT",cls:"text-red-400 bg-red-500/15 border-red-500/30"}, overdue:{label:"INTARZIAT",cls:"text-red-400 bg-red-500/15 border-red-500/30"}, pending:{label:"PENDING",cls:"text-yellow-400 bg-yellow-500/15 border-yellow-500/30"}, collected:{label:"INCASAT",cls:"text-green-400 bg-green-500/15 border-green-500/30"} } as any)[s] ?? {label:s,cls:""})
