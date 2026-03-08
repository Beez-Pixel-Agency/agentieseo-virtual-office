/**
 * AgentieSEO Virtual Office - Server
 * Node.js + Express + WebSockets
 * Lucian CEO - AgentieSEO.net
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3000;

// ─────────────────────────────────────────────
// STATE - In-memory store (resets on restart)
// ─────────────────────────────────────────────
let state = {
  // Scoreboard for Callers
  scoreboard: {
    leadsSetate: 0,
    leadsSunate: 0,
  },

  // Kanban columns
  kanban: {
    todo: [
      { id: uuidv4(), title: 'Apel client nou - Fitness Center', type: 'lead', assignee: null, priority: 'high' },
      { id: uuidv4(), title: 'Optimizare SEO pagina Home - Restaurant Bella', type: 'task', assignee: null, priority: 'medium' },
      { id: uuidv4(), title: 'Meniu digital - Pizzeria Luna', type: 'task', assignee: 'vlad', priority: 'high' },
    ],
    inProgress: [],
    done: [],
  },

  // Speech bubbles per member (text + timestamp)
  bubbles: {},

  // Payments pipeline
  payments: [
    { id: uuidv4(), client: 'Salon Luxe', amount: 1200, currency: 'RON', dueDate: '2026-03-10', status: 'due' },
    { id: uuidv4(), client: 'Auto Service Popa', amount: 850, currency: 'RON', dueDate: '2026-03-15', status: 'pending' },
    { id: uuidv4(), client: 'Cafenea Boema', amount: 2400, currency: 'RON', dueDate: '2026-03-20', status: 'pending' },
  ],

  // Connected members (by memberId)
  onlineMembers: {},
};

// ─────────────────────────────────────────────
// WEBSOCKET BROADCAST
// ─────────────────────────────────────────────
function broadcast(data, excludeWs = null) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client !== excludeWs) {
      client.send(msg);
    }
  });
}

function broadcastAll(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

// ─────────────────────────────────────────────
// WEBSOCKET EVENTS
// ─────────────────────────────────────────────
wss.on('connection', (ws) => {
  const connectionId = uuidv4();
  console.log(`[WS] Client conectat: ${connectionId}`);

  // Send full state on connect
  ws.send(JSON.stringify({ type: 'INIT', payload: state }));

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {

      // Member identifies themselves
      case 'MEMBER_JOIN': {
        const { memberId, name } = msg.payload;
        state.onlineMembers[memberId] = { name, connectedAt: Date.now() };
        ws.memberId = memberId;
        broadcastAll({ type: 'MEMBERS_UPDATE', payload: state.onlineMembers });
        console.log(`[JOIN] ${name} s-a conectat.`);
        break;
      }

      // Speech bubble
      case 'BUBBLE': {
        const { memberId, text } = msg.payload;
        state.bubbles[memberId] = { text, ts: Date.now() };
        broadcastAll({ type: 'BUBBLE', payload: { memberId, text, ts: Date.now() } });
        // Auto-clear after 8s
        setTimeout(() => {
          delete state.bubbles[memberId];
          broadcastAll({ type: 'BUBBLE_CLEAR', payload: { memberId } });
        }, 8000);
        break;
      }

      // Kanban - move card
      case 'KANBAN_MOVE': {
        const { cardId, fromCol, toCol, assignee } = msg.payload;
        const cardIdx = state.kanban[fromCol].findIndex(c => c.id === cardId);
        if (cardIdx !== -1) {
          const [card] = state.kanban[fromCol].splice(cardIdx, 1);
          if (assignee) card.assignee = assignee;
          state.kanban[toCol].push(card);
          broadcastAll({ type: 'KANBAN_UPDATE', payload: state.kanban });

          // If moved to done & it's a lead → increment score
          if (toCol === 'done' && card.type === 'lead') {
            state.scoreboard.leadsSetate++;
            broadcastAll({ type: 'SCOREBOARD_UPDATE', payload: state.scoreboard });
          }
        }
        break;
      }

      // CEO adds new card
      case 'KANBAN_ADD': {
        const { title, type, priority, assignee } = msg.payload;
        const newCard = { id: uuidv4(), title, type: type || 'task', priority: priority || 'medium', assignee: assignee || null };
        state.kanban.todo.push(newCard);
        broadcastAll({ type: 'KANBAN_UPDATE', payload: state.kanban });
        console.log(`[KANBAN] Card nou adăugat: "${title}"`);
        break;
      }

      // Update scoreboard (Callers)
      case 'SCORE_UPDATE': {
        const { field, delta } = msg.payload;
        if (state.scoreboard[field] !== undefined) {
          state.scoreboard[field] += delta;
          broadcastAll({ type: 'SCOREBOARD_UPDATE', payload: state.scoreboard });
        }
        break;
      }

      // Add payment
      case 'PAYMENT_ADD': {
        const { client, amount, currency, dueDate } = msg.payload;
        const payment = { id: uuidv4(), client, amount, currency: currency || 'RON', dueDate, status: 'pending' };
        state.payments.push(payment);
        broadcastAll({ type: 'PAYMENTS_UPDATE', payload: state.payments });
        break;
      }

      // Mark payment as collected
      case 'PAYMENT_COLLECT': {
        const { paymentId } = msg.payload;
        const p = state.payments.find(x => x.id === paymentId);
        if (p) {
          p.status = 'collected';
          broadcastAll({ type: 'PAYMENTS_UPDATE', payload: state.payments });
        }
        break;
      }

      // Liviu activity flash trigger
      case 'LIVIU_FLASH': {
        broadcastAll({ type: 'LIVIU_FLASH' });
        break;
      }

      default:
        console.log(`[WS] Unknown message type: ${msg.type}`);
    }
  });

  ws.on('close', () => {
    if (ws.memberId) {
      delete state.onlineMembers[ws.memberId];
      broadcastAll({ type: 'MEMBERS_UPDATE', payload: state.onlineMembers });
      console.log(`[LEAVE] ${ws.memberId} s-a deconectat.`);
    }
  });
});

// ─────────────────────────────────────────────
// REST API (bonus endpoints)
// ─────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/state', (req, res) => res.json(state));

app.get('/api/scoreboard', (req, res) => res.json(state.scoreboard));

app.post('/api/scoreboard/increment', (req, res) => {
  const { field } = req.body;
  if (state.scoreboard[field] !== undefined) {
    state.scoreboard[field]++;
    broadcastAll({ type: 'SCOREBOARD_UPDATE', payload: state.scoreboard });
    res.json({ success: true, scoreboard: state.scoreboard });
  } else {
    res.status(400).json({ error: 'Invalid field' });
  }
});

// ─────────────────────────────────────────────
// START
// ─────────────────────────────────────────────
server.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════╗
║   🏢  AgentieSEO Virtual Office              ║
║   🚀  Server pornit pe portul ${PORT}           ║
║   🌐  http://localhost:${PORT}                  ║
║   📡  WebSocket activ                        ║
╚══════════════════════════════════════════════╝
  `);
});
