# 🏢 AgentieSEO Virtual Office

**Virtual Office gamificat pentru echipa AgentieSEO.net**
CEO: Lucian — Construit cu Node.js + Express + WebSockets

---

## 🚀 Pornire Rapidă

### 1. Instalează dependențele
```bash
cd AgentieSEO_Office
npm install
```

### 2. Pornește serverul
```bash
npm start
```

### 3. Deschide aplicația
```
http://localhost:3000
```

**Echipa accesează de pe rețeaua locală:**
```
http://[IP-TĂU-LOCAL]:3000
```
*(ex: http://192.168.1.100:3000)*

---

## 📁 Structura Fișierelor

```
AgentieSEO_Office/
├── server.js          ← Server Node.js + Express + WebSocket
├── package.json       ← Dependențe npm
├── README.md          ← Acest fișier
└── public/
    ├── index.html     ← UI - Hala virtuală
    ├── style.css      ← Design dark luxury
    └── app.js         ← Client WebSocket + logică UI
```

---

## 🎮 Funcționalități

| Feature | Status |
|---|---|
| Scoreboard live (Leads Setate / Sunate) | ✅ |
| Kanban Drag & Drop sincronizat | ✅ |
| Speech Bubbles în timp real | ✅ |
| Flash foto Liviu | ✅ |
| Panoul de Încasări | ✅ |
| Status Online/Offline membri | ✅ |
| Clock live | ✅ |

---

## 👥 Membri Echipă

- **Lucian** (CEO) - PR · Networking · Investiții
- **Cătălin** - Caller / Setter
- **Saitama** - Caller / Setter  
- **Beleaua** - CST · Call Settings
- **Liviu** - Multimedia
- **Vlad** - Custom Code · Restaurante · Apps
- **Cosmin** - Web Dev + SEO (Part-Time)

---

## 🔧 Next Steps (Pasul 2)

- [ ] Autentificare simplă per-member (PIN)
- [ ] Persistență DB (SQLite sau JSON files)
- [ ] Notificări browser native
- [ ] Animații CSS avansate pentru hală
- [ ] Mobile-responsive layout
