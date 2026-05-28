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
    let active = true;
    let clientRef = null;

    const resolveSocketUrl = () => {
      if (process.env.NEXT_PUBLIC_SOCKET_URL) return process.env.NEXT_PUBLIC_SOCKET_URL;
      if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "");
      }
      return undefined;
    };

    import("socket.io-client")
      .then(({ io }) => {
        if (!active) return;
        const client = io(resolveSocketUrl(), {
          withCredentials: true,
          autoConnect: true,
          transports: ["websocket", "polling"]
        });

        clientRef = client;
        client.on("connect", () => setConnected(true));
        client.on("disconnect", () => setConnected(false));
        setSocket(client);
      })
      .catch((error) => {
      console.warn("Failed to load socket.io-client:", error);
    });

    return () => {
      active = false;
      if (clientRef) clientRef.disconnect();
    };
  }, []);

  const value = useMemo(() => ({ socket, connected }), [socket, connected]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
