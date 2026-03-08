'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { DESK_COLOR_MAP, AVATAR_GLOW_MAP } from '@/lib/members'
import type { Member, MemberId } from '@/types'
import { useOfficeStore } from '@/lib/store'
import { CallerScoreboard } from './CallerScoreboard'
import { LiviuDesk } from './LiviuDesk'
import { CeoDesk } from './CeoDesk'

interface DeskCardProps {
  member: Member
  isCurrentUser: boolean
  onClick?: () => void
}

export function DeskCard({ member, isCurrentUser, onClick }: DeskCardProps) {
  const { bubbles, onlineMembers, liviuFlashing } = useOfficeStore()
  const bubble = bubbles[member.id as MemberId]
  const isOnline = onlineMembers.includes(member.id as MemberId) || isCurrentUser
  const [showBubble, setShowBubble] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (bubble) {
      setShowBubble(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setShowBubble(false), 8000)
    }
  }, [bubble])

  // CEO gets special layout
  if (member.role === 'ceo') {
    return <CeoDesk member={member} isCurrentUser={isCurrentUser} isOnline={isOnline} />
  }

  // Liviu gets special layout
  if (member.role === 'multimedia') {
    return (
      <LiviuDesk
        member={member}
        isCurrentUser={isCurrentUser}
        isOnline={isOnline}
        bubble={bubble?.text}
        showBubble={showBubble}
        isFlashing={liviuFlashing}
        onClick={onClick}
      />
    )
  }

  const isCallerRole = ['caller', 'cst'].includes(member.role)

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center gap-3 rounded-xl border px-4 py-5',
        'cursor-pointer transition-all duration-300 group',
        'hover:border-border-glow hover:shadow-desk hover:-translate-y-0.5',
        DESK_COLOR_MAP[member.role],
        isCurrentUser && 'ring-1 ring-gold/40',
      )}
    >
      {/* Caller scoreboard banner */}
      {isCallerRole && <CallerScoreboard memberId={member.id as MemberId} />}

      {/* Speech bubble */}
      {showBubble && bubble && (
        <div className={cn(
          'absolute -top-14 left-1/2 z-20',
          'bg-white text-void text-xs font-medium px-3 py-2 rounded-xl rounded-bl-sm',
          'shadow-card whitespace-nowrap max-w-[180px] truncate',
          'animate-float-up',
          '-translate-x-1/2',
        )}>
          {bubble.text}
          <span className="absolute -bottom-2 left-4 w-0 h-0 border-4 border-transparent border-t-white" />
        </div>
      )}

      {/* Online dot */}
      <div className="absolute top-3 right-3">
        <span className={cn(
          'block w-2.5 h-2.5 rounded-full transition-all',
          isOnline ? 'bg-lime shadow-[0_0_8px_#22c55e] animate-pulse-dot' : 'bg-border',
        )} />
      </div>

      {/* Avatar */}
      <div className={cn(
        'relative w-14 h-14 rounded-full border-2 flex items-center justify-center',
        'text-3xl bg-white/5 transition-all duration-300',
        'group-hover:scale-105',
        AVATAR_GLOW_MAP[member.role],
        isOnline && 'border-lime/60 shadow-[0_0_14px_rgba(34,197,94,0.3)]',
      )}>
        {member.emoji}
        {/* Headset for callers */}
        {isCallerRole && (
          <span className="absolute -top-1 -right-1 text-sm">🎧</span>
        )}
      </div>

      {/* Name + Role */}
      <div className="text-center">
        <p className="font-bold text-sm text-white leading-none mb-1">
          {member.name}
          {isCurrentUser && (
            <span className="ml-1.5 text-[9px] font-mono text-gold/80 bg-gold/10 px-1.5 py-0.5 rounded">YOU</span>
          )}
        </p>
        <p className="font-mono text-[9px] text-white/30 leading-snug max-w-[120px]">
          {member.title}
        </p>
      </div>

      {/* Part-time badge for Cosmin */}
      {member.role === 'seo' && (
        <span className="absolute bottom-3 right-3 font-mono text-[8px] text-lime/70 border border-lime/20 bg-lime/5 px-1.5 py-0.5 rounded">
          PART-TIME
        </span>
      )}

      {/* Dev monitors for Vlad */}
      {member.role === 'dev' && (
        <div className="flex gap-1.5 mt-1">
          <div className="w-10 h-7 rounded bg-void border border-neon/20 p-1 overflow-hidden">
            <div className="space-y-0.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-px bg-neon/40 rounded" style={{ width: `${60 + i * 10}%` }} />
              ))}
            </div>
          </div>
          <div className="w-7 h-7 rounded bg-void border border-neon/20 p-1 overflow-hidden">
            <div className="space-y-0.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-px bg-neon/30 rounded" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
