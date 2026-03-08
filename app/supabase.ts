// ═══════════════════════════════════════════════════
// Supabase Client Setup
// ─────────────────────────────────────────────────
// 1. Creează un proiect pe https://supabase.com
// 2. Copiază URL + ANON KEY în .env.local
// 3. Rulează SQL-ul de mai jos în SQL Editor din Supabase
// ═══════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ═══════════════════════════════════════════════════
// SQL SCHEMA — Rulează în Supabase SQL Editor
// ═══════════════════════════════════════════════════
/*

-- Kanban cards
CREATE TABLE kanban_cards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'task',  -- 'task' | 'lead'
  priority    TEXT NOT NULL DEFAULT 'medium',-- 'high' | 'medium' | 'low'
  column      TEXT NOT NULL DEFAULT 'todo',  -- 'todo' | 'inProgress' | 'done'
  assignee_id TEXT,
  created_by  TEXT NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Caller scores
CREATE TABLE caller_scores (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id     TEXT UNIQUE NOT NULL,
  leads_setate  INT DEFAULT 0,
  leads_sunate  INT DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Initialize callers
INSERT INTO caller_scores (member_id) VALUES ('catalin'), ('saitama'), ('beleaua')
ON CONFLICT (member_id) DO NOTHING;

-- Payments
CREATE TABLE payments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  amount      NUMERIC NOT NULL,
  currency    TEXT DEFAULT 'RON',
  due_date    DATE,
  status      TEXT DEFAULT 'pending', -- 'pending' | 'due' | 'collected' | 'overdue'
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (toate public pentru uz intern)
ALTER TABLE kanban_cards   ENABLE ROW LEVEL SECURITY;
ALTER TABLE caller_scores  ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments       ENABLE ROW LEVEL SECURITY;

-- Policies (full access pentru anon key — schimbă pentru producție)
CREATE POLICY "Public access" ON kanban_cards  FOR ALL USING (true);
CREATE POLICY "Public access" ON caller_scores FOR ALL USING (true);
CREATE POLICY "Public access" ON payments      FOR ALL USING (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE kanban_cards;
ALTER PUBLICATION supabase_realtime ADD TABLE caller_scores;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;

*/

// ═══════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════

export async function fetchCards() {
  const { data, error } = await supabase
    .from('kanban_cards')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) console.error('[Supabase] fetchCards:', error)
  return data ?? []
}

export async function upsertCard(card: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('kanban_cards')
    .upsert(card)
    .select()
  if (error) console.error('[Supabase] upsertCard:', error)
  return data
}

export async function fetchScores() {
  const { data, error } = await supabase
    .from('caller_scores')
    .select('*')
  if (error) console.error('[Supabase] fetchScores:', error)
  return data ?? []
}

export async function incrementScore(memberId: string, field: 'leads_setate' | 'leads_sunate') {
  const { error } = await supabase.rpc('increment_score', {
    p_member_id: memberId,
    p_field: field,
  })
  if (error) console.error('[Supabase] incrementScore:', error)
}

export async function fetchPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('due_date', { ascending: true })
  if (error) console.error('[Supabase] fetchPayments:', error)
  return data ?? []
}
