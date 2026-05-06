"use client";

import { createContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext({
  socket: null,
  connected: false
});

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    const client = io(socketUrl, {
      transports: ["websocket"],
      autoConnect: true
    });

    client.on("connect", () => setConnected(true));
    client.on("disconnect", () => setConnected(false));
    setSocket(client);

    return () => client.disconnect();
  }, []);

  const value = useMemo(() => ({ socket, connected }), [socket, connected]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
