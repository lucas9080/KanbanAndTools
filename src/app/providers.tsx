"use client";

import { type ReactNode } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { TaskProvider } from "@/context/TaskContext";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TaskProvider>{children}</TaskProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
