"use client";

import { AuthProvider } from "./AuthContext";
import { SocketProvider } from "./SocketContext";
import { ThemeProvider } from "./ThemeContext";

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>{children}</SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
