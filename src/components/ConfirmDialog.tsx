"use client";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-gray-900 dark:border dark:border-gray-700">
        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          {message}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}
