// ─────────────────────────────────────────────────────────────
//  Real-time events from the API over a native WebSocket.
//  Usage:  const off = subscribe("message", (data) => ...);  off();
//  Events: "message" ({ conversation_id, message }), "notification" (row)
// ─────────────────────────────────────────────────────────────
import { getAccessToken } from "./api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const WS_URL = API_URL.replace(/^http/, "ws").replace(/\/$/, "") + "/ws";

const listeners = new Map(); // event -> Set<handler>
let socket = null;
let retryDelay = 1000;
let reconnectTimer = null;

const listenerCount = () => [...listeners.values()].reduce((n, set) => n + set.size, 0);

function connect() {
  const token = getAccessToken();
  if (!token || socket) return;

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    socket.send(JSON.stringify({ type: "auth", token }));
  };

  socket.onmessage = (event) => {
    let msg;
    try {
      msg = JSON.parse(event.data);
    } catch {
      return;
    }
    if (msg.type === "ready") {
      retryDelay = 1000;
      return;
    }
    listeners.get(msg.type)?.forEach((handler) => handler(msg.data));
  };

  socket.onclose = () => {
    socket = null;
    // Reconnect (with backoff) while anything is still listening; a fresh
    // access token is picked up on each attempt.
    if (listenerCount() > 0) {
      clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(connect, retryDelay);
      retryDelay = Math.min(retryDelay * 2, 30000);
    }
  };
}

export function subscribe(event, handler) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(handler);
  connect();

  return () => {
    listeners.get(event)?.delete(handler);
    if (listenerCount() === 0 && socket) {
      clearTimeout(reconnectTimer);
      socket.close();
      socket = null;
    }
  };
}
