/**
 * AgentieSEO Virtual Office — Client App
 * WebSocket client + UI interactions
 */

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
let ME = null; // { id, name }
let ws = null;
let kanbanState = { todo: [], inProgress: [], done: [] };

const CALLERS = ['catalin', 'saitama', 'beleaua'];

// ─────────────────────────────────────────────
// WEBSOCKET
// ─────────────────────────────────────────────
function connectWS() {
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  ws = new WebSocket(`${protocol}//${location.host}`);

  ws.onopen = () => {
    console.log('[WS] Conectat la server');
    if (ME) {
      ws.send(JSON.stringify({ type: 'MEMBER_JOIN', payload: ME }));
    }
  };

  ws.onmessage = ({ data }) => {
    let msg;
    try { msg = JSON.parse(data); } catch { return; }
    handleServerMessage(msg);
  };

  ws.onclose = () => {
    console.log('[WS] Deconectat. Reconectare în 3s...');
    setTimeout(connectWS, 3000);
  };

  ws.onerror = (err) => console.error('[WS] Eroare:', err);
}

function sendWS(type, payload) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, payload }));
  }
}

// ─────────────────────────────────────────────
// MESSAGE HANDLER
// ─────────────────────────────────────────────
function handleServerMessage(msg) {
  switch (msg.type) {

    case 'INIT':
      kanbanState = msg.payload.kanban;
      renderKanban(kanbanState);
      renderPayments(msg.payload.payments);
      updateScoreboard(msg.payload.scoreboard);
      updateOnlineMembers(msg.payload.onlineMembers);
      break;

    case 'KANBAN_UPDATE':
      kanbanState = msg.payload;
      renderKanban(kanbanState);
      showToast('📋 Kanban actualizat');
      break;

    case 'SCOREBOARD_UPDATE':
      updateScoreboard(msg.payload);
      break;

    case 'BUBBLE':
      showBubble(msg.payload.memberId, msg.payload.text);
      break;

    case 'BUBBLE_CLEAR':
      clearBubble(msg.payload.memberId);
      break;

    case 'MEMBERS_UPDATE':
      updateOnlineMembers(msg.payload);
      break;

    case 'PAYMENTS_UPDATE':
      renderPayments(msg.payload);
      break;

    case 'LIVIU_FLASH':
      triggerLiviuFlash();
      break;
  }
}

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
document.querySelectorAll('.member-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    ME = { id: btn.dataset.id, name: btn.dataset.name };

    // Hide overlay
    document.getElementById('loginOverlay').style.display = 'none';

    // Connect WS
    connectWS();

    // Show role-specific controls
    if (CALLERS.includes(ME.id)) {
      document.getElementById('callerControls').style.display = 'flex';
    }
    if (ME.id === 'liviu') {
      document.getElementById('liviuControls').style.display = 'block';
    }

    showToast(`👋 Bun venit, ${ME.name}!`);
  });
});

// ─────────────────────────────────────────────
// KANBAN RENDER
// ─────────────────────────────────────────────
function renderKanban(state) {
  ['todo', 'inProgress', 'done'].forEach(col => {
    const el = document.getElementById(`col-${col}`);
    el.innerHTML = '';
    (state[col] || []).forEach(card => {
      el.appendChild(createCardEl(card, col));
    });
  });
}

function createCardEl(card, col) {
  const div = document.createElement('div');
  div.className = 'kanban-card';
  div.dataset.id = card.id;
  div.dataset.col = col;
  div.dataset.priority = card.priority || 'medium';

  div.innerHTML = `
    <div class="kanban-card__title">${card.title}</div>
    <div class="kanban-card__meta">
      <span class="kanban-card__tag ${card.type}">${card.type === 'lead' ? '🎯 Lead' : '📌 Task'}</span>
      <span class="kanban-card__tag">${getPriorityIcon(card.priority)} ${card.priority}</span>
      ${card.assignee ? `<span class="kanban-card__tag">→ ${card.assignee}</span>` : ''}
    </div>
  `;
  return div;
}

function getPriorityIcon(p) {
  return p === 'high' ? '🔴' : p === 'medium' ? '🟡' : '🟢';
}

// Init Sortable after DOM ready
function initSortable() {
  const cols = ['todo', 'inProgress', 'done'];
  cols.forEach(col => {
    const el = document.getElementById(`col-${col}`);
    new Sortable(el, {
      group: 'kanban',
      animation: 150,
      ghostClass: 'sortable-ghost',
      dragClass: 'sortable-drag',
      onAdd: (evt) => {
        const cardId = evt.item.dataset.id;
        const fromCol = evt.from.dataset.col;
        const toCol = evt.to.dataset.col;
        sendWS('KANBAN_MOVE', {
          cardId,
          fromCol,
          toCol,
          assignee: ME ? ME.id : null,
        });
      },
    });

    // Drag over highlight
    el.addEventListener('dragover', () => el.classList.add('drag-over'));
    el.addEventListener('dragleave', () => el.classList.remove('drag-over'));
    el.addEventListener('drop', () => el.classList.remove('drag-over'));
  });
}

// ─────────────────────────────────────────────
// ADD CARD
// ─────────────────────────────────────────────
const btnAddCard = document.getElementById('btnAddCard');
const addCardForm = document.getElementById('addCardForm');

btnAddCard.addEventListener('click', () => {
  addCardForm.style.display = addCardForm.style.display === 'none' ? 'flex' : 'none';
});

document.getElementById('btnConfirmCard').addEventListener('click', () => {
  const title = document.getElementById('cardTitle').value.trim();
  if (!title) return;
  sendWS('KANBAN_ADD', {
    title,
    type: document.getElementById('cardType').value,
    priority: document.getElementById('cardPriority').value,
  });
  document.getElementById('cardTitle').value = '';
  addCardForm.style.display = 'none';
  showToast('✅ Card adăugat!');
});

// ─────────────────────────────────────────────
// SCOREBOARD
// ─────────────────────────────────────────────
function updateScoreboard(sb) {
  animateNumber('score-setate', sb.leadsSetate);
  animateNumber('score-sunate', sb.leadsSunate);
}

function animateNumber(id, val) {
  const el = document.getElementById(id);
  if (el.textContent !== String(val)) {
    el.textContent = val;
    el.classList.add('bump');
    setTimeout(() => el.classList.remove('bump'), 400);
  }
}

// Caller controls
document.querySelectorAll('.score-ctrl-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    sendWS('SCORE_UPDATE', { field: btn.dataset.field, delta: 1 });
  });
});

// ─────────────────────────────────────────────
// SPEECH BUBBLES
// ─────────────────────────────────────────────
function showBubble(memberId, text) {
  const el = document.getElementById(`bubble-${memberId}`);
  if (!el) return;
  el.textContent = text;
  el.classList.add('visible');
}

function clearBubble(memberId) {
  const el = document.getElementById(`bubble-${memberId}`);
  if (el) el.classList.remove('visible');
}

// Chat bar
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

function sendChatMessage() {
  if (!ME) { showToast('⚠️ Selectează-ți identitatea mai întâi!'); return; }
  const text = chatInput.value.trim();
  if (!text) return;
  sendWS('BUBBLE', { memberId: ME.id, text });
  chatInput.value = '';
}

chatSend.addEventListener('click', sendChatMessage);
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChatMessage(); });

document.querySelectorAll('.emoji-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!ME) return;
    sendWS('BUBBLE', { memberId: ME.id, text: btn.dataset.emoji });
  });
});

// ─────────────────────────────────────────────
// ONLINE MEMBERS
// ─────────────────────────────────────────────
function updateOnlineMembers(members) {
  const count = Object.keys(members).length;
  document.getElementById('online-count').textContent = `${count} online`;

  // Update status dots for all members
  const allIds = ['lucian','catalin','saitama','beleaua','liviu','vlad','cosmin'];
  allIds.forEach(id => {
    const dot = document.getElementById(`status-${id}`);
    const avatar = document.getElementById(`avatar-${id}`);
    if (dot) dot.classList.toggle('online', !!members[id]);
    if (avatar) avatar.classList.toggle('online', !!members[id]);
  });
}

// ─────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────
function renderPayments(payments) {
  const list = document.getElementById('paymentsList');
  list.innerHTML = '';

  let total = 0;
  payments.forEach(p => {
    if (p.status !== 'collected') total += Number(p.amount);

    const div = document.createElement('div');
    div.className = 'payment-card';
    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:start">
        <div>
          <div class="payment-card__client">${p.client}</div>
          <div class="payment-card__amount">${Number(p.amount).toLocaleString('ro-RO')} ${p.currency || 'RON'}</div>
          <div class="payment-card__due">📅 ${p.dueDate}</div>
          <span class="payment-card__status status-${p.status}">${p.status.toUpperCase()}</span>
        </div>
        ${p.status !== 'collected' ? `<button class="collect-btn" data-id="${p.id}">✓ ÎNCASAT</button>` : ''}
      </div>
    `;
    list.appendChild(div);
  });

  document.getElementById('paymentsTotal').textContent =
    `${total.toLocaleString('ro-RO')} RON`;

  // Collect buttons
  list.querySelectorAll('.collect-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sendWS('PAYMENT_COLLECT', { paymentId: btn.dataset.id });
    });
  });
}

// Add payment
const btnAddPayment = document.getElementById('btnAddPayment');
const addPaymentForm = document.getElementById('addPaymentForm');

btnAddPayment.addEventListener('click', () => {
  addPaymentForm.style.display = addPaymentForm.style.display === 'none' ? 'flex' : 'none';
});

document.getElementById('btnConfirmPayment').addEventListener('click', () => {
  const client = document.getElementById('payClient').value.trim();
  const amount = document.getElementById('payAmount').value;
  const dueDate = document.getElementById('payDue').value;
  if (!client || !amount) return;
  sendWS('PAYMENT_ADD', { client, amount: Number(amount), currency: 'RON', dueDate });
  document.getElementById('payClient').value = '';
  document.getElementById('payAmount').value = '';
  document.getElementById('payDue').value = '';
  addPaymentForm.style.display = 'none';
  showToast('💰 Plată adăugată!');
});

// ─────────────────────────────────────────────
// LIVIU FLASH
// ─────────────────────────────────────────────
function triggerLiviuFlash() {
  const overlay = document.getElementById('liviuFlash');
  overlay.classList.remove('flash');
  // Force reflow
  void overlay.offsetWidth;
  overlay.classList.add('flash');
  setTimeout(() => overlay.classList.remove('flash'), 700);
}

document.getElementById('liviuTrigger')?.addEventListener('click', () => {
  sendWS('LIVIU_FLASH');
});

// ─────────────────────────────────────────────
// CLOCK
// ─────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('ro-RO', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
}
setInterval(updateClock, 1000);
updateClock();

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────
function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSortable();
});
