import { io, Socket } from "socket.io-client";

// Derive the socket server URL:
// 1. Use VITE_SOCKET_URL if explicitly set
// 2. Otherwise strip '/api' from VITE_API_URL
// 3. Fall back to localhost:5000 for local dev
const getSocketURL = (): string => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  // Strip trailing '/api' to get the base server URL
  return apiUrl.replace(/\/api\/?$/, "");
};

const SOCKET_URL = getSocketURL();

let socket: Socket | null = null;

export const initSocket = (userId: string) => {
  // Don't reconnect if already connected with the same socket
  if (socket?.connected) {
    // Just re-join the room in case of re-renders
    socket.emit("join", userId);
    return socket;
  }

  // Disconnect stale socket before creating a new one
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(SOCKET_URL, {
    withCredentials: true,
    // Start with polling (works on all proxies including Railway),
    // then upgrade to WebSocket if the server supports it.
    // This is the most compatible mode for production deployments.
    transports: ["polling", "websocket"],
    // Reconnection settings
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  });

  socket.on("connect", () => {
    console.log(`[Socket.io] Connected: ${socket?.id} → ${SOCKET_URL}`);
    socket?.emit("join", userId);
  });

  socket.on("connect_error", (error) => {
    console.error("[Socket.io] Connection error:", error.message);
  });

  socket.on("disconnect", (reason) => {
    console.log(`[Socket.io] Disconnected: ${reason}`);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log(`[Socket.io] Reconnected after ${attemptNumber} attempt(s)`);
    // Re-join the room after reconnection
    socket?.emit("join", userId);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("[Socket.io] Disconnected and cleaned up");
  }
};
