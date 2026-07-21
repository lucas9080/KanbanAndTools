"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type Task } from "@/context/TaskContext";
import { useState } from "react";

interface SortableTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onRemove: (id: string) => void;
  onTogglePause: (id: string) => void;
  onMoveLeft: (id: string) => void;
  onMoveRight: (id: string) => void;
}

export function SortableTaskCard({
  task,
  onEdit,
  onRemove,
  onTogglePause,
  onMoveLeft,
  onMoveRight,
}: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const [pausing, setPausing] = useState(false);
  const [pauseReason, setPauseReason] = useState("");

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : undefined,
  };

  const handleConfirmPause = () => {
    if (pauseReason.trim()) {
      onTogglePause(task.id);
      setPausing(false);
      setPauseReason("");
    }
  };

  const handleTogglePause = () => {
    if (!task.paused) {
      setPausing(true);
    } else {
      onTogglePause(task.id);
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`group relative rounded-lg border p-4 shadow-sm transition-colors cursor-grab active:cursor-grabbing ${
          task.paused
            ? "border-yellow-400 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/30"
            : "border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700"
        }`}
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3
            className={`text-sm font-semibold ${
              task.paused
                ? "text-yellow-800 dark:text-yellow-200"
                : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {task.title}
          </h3>
          {task.paused && (
            <span
              className="shrink-0 rounded bg-yellow-200 px-1.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200"
              title={task.pauseReason}
            >
              ⏸ pausada
            </span>
          )}
        </div>

        {task.description && (
          <p
            className={`mb-3 line-clamp-2 text-xs ${
              task.paused
                ? "text-yellow-700 dark:text-yellow-300"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {task.description}
          </p>
        )}

        {task.paused && task.pauseReason && (
          <p className="mb-2 text-xs italic text-yellow-600 dark:text-yellow-400">
            Motivo: {task.pauseReason}
          </p>
        )}

        <div className="flex flex-wrap gap-1">
          {task.status !== "todo" && (
            <button
              onClick={() => onMoveLeft(task.id)}
              className="rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              title="Mover para esquerda"
            >
              ◀
            </button>
          )}

          <button
            onClick={() => onEdit(task)}
            className="rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
            title="Editar"
          >
            ✏️
          </button>

          <button
            onClick={handleTogglePause}
            className={`rounded px-2 py-1 text-xs font-medium ${
              task.paused
                ? "text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/30"
                : "text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
            }`}
            title={task.paused ? "Despausar" : "Pausar"}
          >
            {task.paused ? "▶" : "⏸"}
          </button>

          <button
            onClick={() => onRemove(task.id)}
            className="rounded px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
            title="Remover"
          >
            🗑️
          </button>

          {task.status !== "done" && (
            <button
              onClick={() => onMoveRight(task.id)}
              className="rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              title="Mover para direita"
            >
              ▶
            </button>
          )}
        </div>
      </div>

      {pausing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900 dark:border dark:border-gray-700">
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Pausar tarefa
            </h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Informe o motivo da pausa:
            </p>
            <textarea
              autoFocus
              value={pauseReason}
              onChange={(e) => setPauseReason(e.target.value)}
              placeholder="Motivo (obrigatório)"
              rows={3}
              className="mb-4 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setPausing(false);
                  setPauseReason("");
                }}
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmPause}
                disabled={!pauseReason.trim()}
                className="rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirmar Pausa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
