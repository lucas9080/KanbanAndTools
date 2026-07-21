"use client";

import { useState, type FormEvent } from "react";

interface TaskFormProps {
  onSubmit: (title: string, description: string) => void;
  initialTitle?: string;
  initialDescription?: string;
  buttonLabel?: string;
}

export function TaskForm({
  onSubmit,
  initialTitle = "",
  initialDescription = "",
  buttonLabel = "Adicionar",
}: TaskFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setError("O título é obrigatório.");
      return;
    }
    setError("");
    onSubmit(trimmed, description.trim());
    if (!initialTitle) {
      setTitle("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          placeholder="Título da tarefa"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
        />
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
      </div>
      <textarea
        placeholder="Descrição (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
      />
      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
