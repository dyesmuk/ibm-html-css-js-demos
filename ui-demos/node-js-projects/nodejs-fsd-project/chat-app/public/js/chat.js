// ============================================================
// MODULE 16 — Real-Time Apps with Socket.io
// public/js/chat.js  (runs in the BROWSER)
//
// Responsibilities:
//  - Parse username + room from the URL query string
//  - Emit 'join' to the server
//  - Listen for 'message', 'locationMessage', 'roomData' events
//  - Render incoming messages to the DOM
//  - Send text messages via the compose form
//  - Share GPS location via the Geolocation API
// ============================================================

const socket = io();

// ── Parse URL params ───────────────────────────────────────
const params = new URLSearchParams(window.location.search);
const username = params.get('username');
const room = params.get('room');

if (!username || !room) {
  alert('Missing username or room. Redirecting to home.');
  window.location.href = '/';
}

// ── Join Room ──────────────────────────────────────────────
socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    window.location.href = '/';
  }
});

// ── Helpers ────────────────────────────────────────────────
/**
 * Format a unix timestamp as "h:mm am/pm"
 */
function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Scroll the messages container to the bottom.
 */
function scrollToBottom() {
  const msgs = document.getElementById('messages');
  msgs.scrollTop = msgs.scrollHeight;
}

// ── Receive: text message ──────────────────────────────────
socket.on('message', (message) => {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');

  if (message.username === 'System') {
    div.classList.add('msg', 'system');
    div.textContent = message.text;
  } else {
    div.classList.add('msg');
    div.innerHTML = `
      <div class="meta">
        <strong>${escapeHtml(message.username)}</strong>
        <span class="time">${formatTime(message.createdAt)}</span>
      </div>
      <p>${escapeHtml(message.text)}</p>
    `;
  }

  msgs.appendChild(div);
  scrollToBottom();
});

// ── Receive: location message ──────────────────────────────
socket.on('locationMessage', (msg) => {
  const msgs = document.getElementById('messages');
  const div = document.createElement('div');
  div.classList.add('msg');
  div.innerHTML = `
    <div class="meta">
      <strong>${escapeHtml(msg.username)}</strong>
      <span class="time">${formatTime(msg.createdAt)}</span>
    </div>
    <p>📍 <a href="${msg.url}" target="_blank" rel="noopener">View current location</a></p>
  `;
  msgs.appendChild(div);
  scrollToBottom();
});

// ── Receive: room member list update ──────────────────────
socket.on('roomData', ({ room: roomName, users }) => {
  document.getElementById('room-name').textContent = `# ${roomName}`;
  document.title = `Chat — #${roomName}`;

  const ul = document.getElementById('users');
  ul.innerHTML = users
    .map((u) => `<li>${escapeHtml(u.username)}</li>`)
    .join('');
});

// ── Send: text message ─────────────────────────────────────
document.getElementById('sendBtn').addEventListener('click', sendMessage);
document.getElementById('msgInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const input = document.getElementById('msgInput');
  const text = input.value.trim();
  if (!text) return;

  socket.emit('sendMessage', text, (err) => {
    if (err) console.error('Send error:', err);
  });

  input.value = '';
  input.focus();
}

// ── Send: GPS location ─────────────────────────────────────
document.getElementById('locationBtn').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser.');
  }

  const btn = document.getElementById('locationBtn');
  btn.textContent = '⏳';
  btn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      socket.emit(
        'sendLocation',
        { lat: coords.latitude, lon: coords.longitude },
        (err) => {
          if (err) console.error('Location error:', err);
        }
      );
      btn.textContent = '📍';
      btn.disabled = false;
    },
    () => {
      alert('Unable to retrieve your location.');
      btn.textContent = '📍';
      btn.disabled = false;
    }
  );
});

// ── Leave Room ─────────────────────────────────────────────
document.getElementById('leaveBtn').addEventListener('click', () => {
  window.location.href = '/';
});

// ── XSS Helper ─────────────────────────────────────────────
// Always escape user-generated content before inserting into DOM
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
