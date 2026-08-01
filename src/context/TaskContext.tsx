"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "doing" | "done";
  paused: boolean;
  pauseReason?: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, description: string) => void;
  editTask: (id: string, title: string, description: string) => void;
  removeTask: (id: string) => void;
  togglePause: (id: string, reason?: string) => void;
  moveTask: (id: string, status: Task["status"]) => void;
  reorderTasks: (status: Task["status"], from: number, to: number) => void;
  archiveTask: (id: string) => void;
  unarchiveTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("kanban-tasks");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Task[];
        return parsed.map((t) => ({ ...t, archived: t.archived ?? false }));
      } catch { return []; }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, description: string) => {
    const now = new Date().toISOString();
    const task: Task = {
      id: generateId(),
      title,
      description,
      status: "todo",
      paused: false,
      archived: false,
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [...prev, task]);
  };

  const editTask = (id: string, title: string, description: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, title, description, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const togglePause = (id: string, reason?: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              paused: !t.paused,
              pauseReason: t.paused ? undefined : reason,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  };

  const moveTask = (id: string, status: Task["status"]) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const reorderTasks = (
    status: Task["status"],
    fromIndex: number,
    toIndex: number
  ) => {
    setTasks((prev) => {
      const filtered = prev.filter((t) => t.status === status);
      const others = prev.filter((t) => t.status !== status);
      const [moved] = filtered.splice(fromIndex, 1);
      filtered.splice(toIndex, 0, moved);
      return [...others, ...filtered];
    });
  };

  const archiveTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, archived: true, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const unarchiveTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, archived: false, updatedAt: new Date().toISOString() }
          : t
      )
    );
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        editTask,
        removeTask,
        togglePause,
        moveTask,
        reorderTasks,
        archiveTask,
        unarchiveTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
}
