"use client";

import { useState, type FormEvent } from "react";
import { type Task } from "@/context/TaskContext";

interface EditTaskModalProps {
  task: Task | null;
  open: boolean;
  onSave: (id: string, title: string, description: string) => void;
  onClose: () => void;
}

export function EditTaskModal({ task, open, onSave, onClose }: EditTaskModalProps) {
  if (!open || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900 dark:border dark:border-gray-700">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Editar tarefa
        </h2>
        <EditTaskForm key={task.id} task={task} onSave={onSave} onClose={onClose} />
      </div>
    </div>
  );
}

function EditTaskForm({
  task,
  onSave,
  onClose,
}: {
  task: Task;
  onSave: (id: string, title: string, description: string) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("O título é obrigatório.");
      return;
    }
    setError("");
    onSave(task.id, trimmed, description.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
          placeholder="Título"
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        placeholder="Descrição (opcional)"
      />
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
