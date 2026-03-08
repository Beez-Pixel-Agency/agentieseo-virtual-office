'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Member } from '@/types'
import { useOfficeStore } from '@/lib/store'

interface CeoDeskProps {
  member: Member
  isCurrentUser: boolean
  isOnline: boolean
}

export function CeoDesk({ member, isCurrentUser, isOnline }: CeoDeskProps) {
  const { bubbles, cards, payments } = useOfficeStore()
  const bubble = bubbles['lucian']

  const activeLeads  = cards.filter(c => c.type === 'lead' && c.column !== 'done').length
  const activeTasks  = cards.filter(c => c.column === 'inProgress').length
  const pendingPay   = payments.filter(p => p.status !== 'collected').reduce((s, p) => s + p.amount, 0)

  return (
    <div className={cn(
      'relative col-span-2 flex flex-col items-center gap-4 rounded-2xl border px-8 py-6',
      'border-gold/40 bg-gradient-to-br from-desk via-[#1e2538] to-desk',
      'shadow-gold animate-glow-pulse',
      isCurrentUser && 'ring-1 ring-gold/60',
    )}>

      {/* Speech bubble */}
      {bubble && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-20
          bg-white text-void text-xs font-semibold px-3 py-2
          rounded-xl rounded-bl-sm shadow-card whitespace-nowrap animate-float-up">
          {bubble.text}
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-white" />
        </div>
      )}

      {/* Crown glow top decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px w-32 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Online + ID */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className={cn(
          'w-2.5 h-2.5 rounded-full transition-all',
          isOnline ? 'bg-lime shadow-[0_0_8px_#22c55e] animate-pulse-dot' : 'bg-border',
        )} />
        {isCurrentUser && (
          <span className="font-mono text-[9px] text-gold/80 bg-gold/10 border border-gold/20 px-1.5 py-0.5 rounded">
            YOU
          </span>
        )}
      </div>

      {/* Avatar row */}
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20 rounded-full border-2 border-gold/60 flex items-center justify-center
          text-4xl bg-gradient-to-br from-gold/10 to-transparent shadow-gold">
          {member.emoji}
          {/* Radiant ring */}
          <div className="absolute inset-0 rounded-full border border-gold/20 scale-110" />
          <div className="absolute inset-0 rounded-full border border-gold/10 scale-125" />
        </div>

        <div>
          <h2 className="font-display text-3xl text-gold leading-none tracking-widest">
            {member.name.toUpperCase()}
          </h2>
          <p className="font-mono text-[10px] text-gold/50 mt-1 tracking-wider">
            {member.title}
          </p>

          {/* Mini dashboard stats */}
          <div className="flex gap-3 mt-3">
            <Stat label="LEADS ACTIVE" value={activeLeads} color="text-ember" />
            <Stat label="ÎN LUCRU"     value={activeTasks}  color="text-gold" />
            <Stat label="DE ÎNCASAT"   value={`${(pendingPay/1000).toFixed(1)}K`} color="text-lime" />
          </div>
        </div>
      </div>

      {/* CEO Screen mockup */}
      <div className="w-full max-w-xs bg-void/80 border border-border-glow rounded-lg p-3 mt-1">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="w-2 h-2 rounded-full bg-ember/70" />
          <span className="w-2 h-2 rounded-full bg-gold/70" />
          <span className="w-2 h-2 rounded-full bg-lime/70" />
          <span className="ml-2 font-mono text-[9px] text-white/20">dashboard.agentieseo.net</span>
        </div>
        <div className="space-y-1.5">
          {['Lead pipeline —————————', 'Tasks board ——————————', 'Financial overview ——————'].map((line, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-1.5 bg-gold/20 rounded-full" style={{ width: `${70 + i * 10}%` }} />
              <span className="font-mono text-[8px] text-white/15">{line}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom line */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-px w-32 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="text-center">
      <p className={cn('font-display text-xl leading-none', color)}>{value}</p>
      <p className="font-mono text-[8px] text-white/25 mt-0.5">{label}</p>
    </div>
  )
}
