# 🏢 AgentieSEO Virtual Office — Next.js

**Platforma internă de management gamificată**
CEO: Lucian | AgentieSEO.net | Deploy: Vercel

---

## 🚀 Setup Rapid

### 1. Instalează dependențele
```bash
cd AgentieSEO_Vercel
npm install
```

### 2. Configurează variabilele de mediu
Copiază `.env.local` și completează:
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 3. Setează Supabase
- Creează proiect la [supabase.com](https://supabase.com)
- Deschide **SQL Editor** și rulează schema din `src/lib/supabase.ts`

### 4. Pornește local
```bash
npm run dev
# → http://localhost:3000
```

---

## 📁 Structura Proiectului

```
AgentieSEO_Vercel/
├── src/
│   ├── app/
│   │   ├── page.tsx            ← Hala virtuală (pagina principală)
│   │   ├── layout.tsx          ← Root layout
│   │   └── globals.css         ← Tailwind + fonturi + animații
│   ├── components/
│   │   ├── office/
│   │   │   ├── DeskCard.tsx    ← Birou generic (cu speech bubble)
│   │   │   ├── CeoDesk.tsx     ← Biroul CEO cu dashboard mini
│   │   │   ├── LiviuDesk.tsx   ← Biroul Liviu + camera flash
│   │   │   ├── CallerScoreboard.tsx ← Scoreboard live callers
│   │   │   └── CarShowcase.tsx ← Ferrari + G63 CSS
│   │   ├── kanban/
│   │   │   └── KanbanBoard.tsx ← Board drag & drop
│   │   ├── financial/
│   │   │   └── FinancialPanel.tsx ← Panou plăți Lucian
│   │   ├── chat/
│   │   │   └── ChatBar.tsx     ← Chat + emoji bubbles
│   │   └── ui/
│   │       ├── TopBar.tsx      ← Header cu scoreboard
│   │       └── LoginOverlay.tsx ← Selectare identitate
│   ├── lib/
│   │   ├── store.ts            ← Zustand state management
│   │   ├── members.ts          ← Definiții membri echipă
│   │   ├── supabase.ts         ← Client Supabase + SQL schema
│   │   └── utils.ts            ← Helpers
│   └── types/
│       └── index.ts            ← TypeScript types
├── tailwind.config.ts          ← Config Tailwind custom
├── next.config.js
├── vercel.json                 ← Deploy config
└── .env.local                  ← Variabile mediu (nu se commitează)
```

---

## 🎮 Funcționalități

| Feature | Status | Detalii |
|---|---|---|
| Login cu selectare rol | ✅ | Fiecare alege identitatea |
| Hala virtuală | ✅ | Birouri pentru toți membrii |
| Scoreboard Callers | ✅ | Live per-caller |
| Speech Bubbles | ✅ | Mesaje deasupra avatarului |
| Camera Flash Liviu | ✅ | Animație CSS la activitate |
| Ferrari + G63 CSS | ✅ | Motivational cars |
| Kanban Board | ✅ | Drag & drop |
| Panou Financiar | ✅ | CEO only |
| Alertă plăți scadente | ✅ | Pulsing warning |
| Zustand State | ✅ | Sincronizare client-side |
| Supabase Schema | ✅ | Ready to connect |
| Deploy Vercel | ✅ | vercel.json configurat |

---

## 🌐 Deploy pe Vercel

```bash
# Instalează Vercel CLI
npm i -g vercel

# Deploy
vercel

# Adaugă env vars în Vercel Dashboard sau:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## 🔧 Pasul 2 — Ce urmează

- [ ] Integrare Supabase real-time (înlocuiește Zustand cu subscribe)
- [ ] Pusher pentru chat bubbles multi-user live
- [ ] Auth cu Supabase (PIN per-member)
- [ ] API Routes pentru operații server-side
- [ ] Notificări browser native
- [ ] Mobile layout responsive
