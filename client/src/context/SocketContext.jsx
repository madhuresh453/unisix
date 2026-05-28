"use client";

import { createContext, useEffect, useMemo, useState } from "react";

export const SocketContext = createContext({
  socket: null,
  connected: false
});

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with socket.io-client
    import("socket.io-client").then(({ io }) => {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || undefined;
      const client = io(socketUrl, {
        withCredentials: true,
        autoConnect: true
      });

      client.on("connect", () => setConnected(true));
      client.on("disconnect", () => setConnected(false));
      setSocket(client);

      return () => client.disconnect();
    }).catch((error) => {
      console.warn("Failed to load socket.io-client:", error);
    });
  }, []);

  const value = useMemo(() => ({ socket, connected }), [socket, connected]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
