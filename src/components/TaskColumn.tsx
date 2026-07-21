"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { type Task } from "@/context/TaskContext";
import { SortableTaskCard } from "./SortableTaskCard";

interface TaskColumnProps {
  title: string;
  status: Task["status"];
  tasks: Task[];
  onEdit: (task: Task) => void;
  onRemove: (id: string) => void;
  onTogglePause: (id: string) => void;
  onMoveLeft: (id: string) => void;
  onMoveRight: (id: string) => void;
  onAddNew: () => void;
}

const statusColors: Record<Task["status"], string> = {
  todo: "border-t-blue-500",
  doing: "border-t-yellow-500",
  done: "border-t-green-500",
};

export function TaskColumn({
  title,
  status,
  tasks,
  onEdit,
  onRemove,
  onTogglePause,
  onMoveLeft,
  onMoveRight,
  onAddNew,
}: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-lg border-t-4 bg-gray-50 p-4 dark:bg-gray-800 ${
        statusColors[status]
      } ${isOver ? "ring-2 ring-blue-400" : "border-gray-200 dark:border-gray-600"}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
          {title}
        </h2>
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 space-y-3">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onRemove={onRemove}
              onTogglePause={onTogglePause}
              onMoveLeft={onMoveLeft}
              onMoveRight={onMoveRight}
            />
          ))}
        </SortableContext>
      </div>

      <button
        onClick={onAddNew}
        className="mt-4 w-full rounded-md border-2 border-dashed border-gray-300 py-2 text-sm font-medium text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors dark:border-gray-600 dark:text-gray-400 dark:hover:border-blue-500 dark:hover:text-blue-400"
      >
        + Nova tarefa
      </button>
    </div>
  );
}
