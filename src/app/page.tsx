"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useTasks, type Task } from "@/context/TaskContext";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TaskColumn } from "@/components/TaskColumn";
import { TaskForm } from "@/components/TaskForm";
import { EditTaskModal } from "@/components/EditTaskModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const columns: { title: string; status: Task["status"] }[] = [
  { title: "A FAZER", status: "todo" },
  { title: "FAZENDO", status: "doing" },
  { title: "CONCLUIDO", status: "done" },
];

export default function Home() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const {
    tasks,
    addTask,
    editTask,
    removeTask,
    togglePause,
    moveTask,
  } = useTasks();

  const [addingToColumn, setAddingToColumn] = useState<Task["status"] | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [removingTaskId, setRemovingTaskId] = useState<string | null>(null);
  const [activeDragTask, setActiveDragTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const tasksByStatus = useMemo(
    () =>
      ({
        todo: tasks.filter((t) => t.status === "todo"),
        doing: tasks.filter((t) => t.status === "doing"),
        done: tasks.filter((t) => t.status === "done"),
      }) as Record<Task["status"], Task[]>,
    [tasks]
  );

  const handleAddTask = useCallback(
    (title: string, description: string) => {
      addTask(title, description);
      setAddingToColumn(null);
    },
    [addTask]
  );

  const handleEditSave = useCallback(
    (id: string, title: string, description: string) => {
      editTask(id, title, description);
      setEditingTask(null);
    },
    [editTask]
  );

  const handleRemoveConfirm = useCallback(() => {
    if (removingTaskId) {
      removeTask(removingTaskId);
      setRemovingTaskId(null);
    }
  }, [removingTaskId, removeTask]);

  const handleMoveLeft = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const order = ["todo", "doing", "done"] as const;
      const idx = order.indexOf(task.status);
      if (idx > 0) moveTask(id, order[idx - 1]);
    },
    [tasks, moveTask]
  );

  const handleMoveRight = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      const order = ["todo", "doing", "done"] as const;
      const idx = order.indexOf(task.status);
      if (idx < order.length - 1) moveTask(id, order[idx + 1]);
    },
    [tasks, moveTask]
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const task = tasks.find((t) => t.id === event.active.id);
      if (task) setActiveDragTask(task);
    },
    [tasks]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDragTask(null);
      const { active, over } = event;
      if (!over) return;

      const taskId = active.id as string;
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const targetStatus = over.id as Task["status"];
      if (["todo", "doing", "done"].includes(targetStatus) && targetStatus !== task.status) {
        moveTask(taskId, targetStatus);
      }
    },
    [tasks, moveTask]
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="min-h-screen p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Kanban
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { logout(); router.push("/login"); }}
            className="rounded-full p-2 text-sm shadow-md transition-colors hover:bg-gray-200 dark:hover:bg-gray-600 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
          >
            Sair
          </button>
          <ThemeToggle />
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          {columns.map(({ title, status }) => (
            <TaskColumn
              key={status}
              title={title}
              status={status}
              tasks={tasksByStatus[status]}
              onEdit={setEditingTask}
              onRemove={setRemovingTaskId}
              onTogglePause={togglePause}
              onMoveLeft={handleMoveLeft}
              onMoveRight={handleMoveRight}
              onAddNew={() => setAddingToColumn(status)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeDragTask ? (
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-600 dark:bg-gray-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {activeDragTask.title}
              </p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {addingToColumn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900 dark:border dark:border-gray-700">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Nova tarefa
            </h2>
            <TaskForm onSubmit={handleAddTask} />
            <button
              onClick={() => setAddingToColumn(null)}
              className="mt-3 w-full rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <EditTaskModal
        task={editingTask}
        open={!!editingTask}
        onSave={handleEditSave}
        onClose={() => setEditingTask(null)}
      />

      <ConfirmDialog
        open={!!removingTaskId}
        title="Remover tarefa"
        message="Tem certeza que deseja remover esta tarefa permanentemente?"
        onConfirm={handleRemoveConfirm}
        onCancel={() => setRemovingTaskId(null)}
      />
    </main>
  );
}
