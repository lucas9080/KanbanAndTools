"use client";

import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTasks, type Task } from "@/context/TaskContext";
import { useAuth } from "@/context/AuthContext";
import { ConfirmDialog } from "@/components/ConfirmDialog";

const statusLabels: Record<Task["status"], string> = {
  todo: "A fazer",
  doing: "Fazendo",
  done: "Concluído",
};

const statusColors: Record<Task["status"], string> = {
  todo: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  doing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  done: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

export default function ArchivedPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { tasks, unarchiveTask, removeTask } = useTasks();
  const [removingTaskId, setRemovingTaskId] = useState<string | null>(null);

  const archivedTasks = useMemo(
    () => tasks.filter((t) => t.archived),
    [tasks]
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleRemoveConfirm = () => {
    if (removingTaskId) {
      removeTask(removingTaskId);
      setRemovingTaskId(null);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <h1 className="mb-8 text-2xl font-bold text-gray-800 dark:text-gray-100">
        Tarefas arquivadas
      </h1>

      {archivedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 py-16 text-center dark:border-gray-600">
          <span className="mb-3 text-4xl">🗃️</span>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Nenhuma tarefa arquivada
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Use o botão 🗃️ no card de uma tarefa para arquivá-la
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {archivedTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-gray-600 dark:bg-gray-700"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {task.title}
                </h3>
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${statusColors[task.status]}`}
                >
                  {statusLabels[task.status]}
                </span>
              </div>

              {task.description && (
                <p className="mb-3 line-clamp-3 text-xs text-gray-500 dark:text-gray-400">
                  {task.description}
                </p>
              )}

              {task.paused && task.pauseReason && (
                <p className="mb-2 text-xs italic text-yellow-600 dark:text-yellow-400">
                  ⏸ Motivo: {task.pauseReason}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-600">
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => unarchiveTask(task.id)}
                    className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                    title="Restaurar tarefa"
                  >
                    ♻️ Restaurar
                  </button>
                  <button
                    onClick={() => setRemovingTaskId(task.id)}
                    className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
                    title="Remover"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
