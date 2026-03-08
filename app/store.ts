'use client'

import { create } from 'zustand'
import type { OfficeState, Member, KanbanCard, KanbanColumn, CallerScore, Payment, BubbleMessage, MemberId } from '@/types'

// ─── Seed data ──────────────────────────────────────
const seedCards: KanbanCard[] = [
  {
    id: 'card-1',
    title: 'Apel prospectare — Fitness Center Nord',
    type: 'lead',
    priority: 'high',
    createdById: 'lucian',
    column: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-2',
    title: 'SEO audit — Restaurant Bella Vista',
    type: 'task',
    priority: 'medium',
    createdById: 'lucian',
    column: 'todo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-3',
    title: 'Meniu digital QR — Pizzeria Luna',
    type: 'task',
    priority: 'high',
    assigneeId: 'vlad',
    createdById: 'lucian',
    column: 'inProgress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-4',
    title: 'Reels Instagram — Salon Luxe',
    type: 'task',
    priority: 'medium',
    assigneeId: 'liviu',
    createdById: 'lucian',
    column: 'inProgress',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const seedScores: CallerScore[] = [
  { memberId: 'catalin', leadsSetate: 4, leadsSunate: 12, updatedAt: new Date().toISOString() },
  { memberId: 'saitama', leadsSetate: 6, leadsSunate: 18, updatedAt: new Date().toISOString() },
  { memberId: 'beleaua', leadsSetate: 3, leadsSunate: 9,  updatedAt: new Date().toISOString() },
]

const seedPayments: Payment[] = [
  { id: 'pay-1', clientName: 'Salon Luxe',        amount: 1200, currency: 'RON', dueDate: '2026-03-10', status: 'due',     createdAt: new Date().toISOString() },
  { id: 'pay-2', clientName: 'Auto Service Popa', amount: 850,  currency: 'RON', dueDate: '2026-03-15', status: 'pending', createdAt: new Date().toISOString() },
  { id: 'pay-3', clientName: 'Cafenea Boema',     amount: 2400, currency: 'RON', dueDate: '2026-03-20', status: 'pending', createdAt: new Date().toISOString() },
  { id: 'pay-4', clientName: 'Fitness Center Nord',amount: 3200,currency: 'RON', dueDate: '2026-03-25', status: 'pending', createdAt: new Date().toISOString() },
]

// ─── Store ──────────────────────────────────────────
export const useOfficeStore = create<OfficeState>((set) => ({
  // Session
  currentMember: null,
  setCurrentMember: (m) => set({ currentMember: m }),

  // Online presence
  onlineMembers: [],
  setOnlineMembers: (ids) => set({ onlineMembers: ids }),

  // Bubbles
  bubbles: {},
  setBubble: (msg: BubbleMessage) =>
    set((s) => ({ bubbles: { ...s.bubbles, [msg.memberId]: msg } })),
  clearBubble: (memberId: MemberId) =>
    set((s) => {
      const next = { ...s.bubbles }
      delete next[memberId]
      return { bubbles: next }
    }),

  // Kanban
  cards: seedCards,
  setCards: (cards) => set({ cards }),
  addCard: (card) => set((s) => ({ cards: [...s.cards, card] })),
  updateCard: (id, updates) =>
    set((s) => ({
      cards: s.cards.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      ),
    })),
  moveCard: (id, toColumn) =>
    set((s) => ({
      cards: s.cards.map((c) =>
        c.id === id ? { ...c, column: toColumn, updatedAt: new Date().toISOString() } : c
      ),
    })),

  // Scoreboard
  scores: seedScores,
  setScores: (scores) => set({ scores }),
  incrementScore: (memberId, field) =>
    set((s) => ({
      scores: s.scores.map((sc) =>
        sc.memberId === memberId
          ? { ...sc, [field]: sc[field] + 1, updatedAt: new Date().toISOString() }
          : sc
      ),
    })),

  // Payments
  payments: seedPayments,
  setPayments: (payments) => set({ payments }),
  addPayment: (p) => set((s) => ({ payments: [...s.payments, p] })),
  updatePayment: (id, updates) =>
    set((s) => ({
      payments: s.payments.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  // UI
  activePanel: 'none',
  setActivePanel: (p) => set({ activePanel: p }),
  liviuFlashing: false,
  setLiviuFlashing: (v) => set({ liviuFlashing: v }),
}))
