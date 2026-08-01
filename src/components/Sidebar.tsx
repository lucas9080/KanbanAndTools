"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const navItems = [
  { href: "/", label: "Suas tarefas", icon: "🗂️" },
  { href: "/arquivadas", label: "Tarefas arquivadas", icon: "🗃️" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-16 flex-col border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 md:w-64">
      <div className="flex items-center justify-center gap-2 border-b border-gray-200 px-4 py-5 dark:border-gray-700">
        <span className="text-2xl">📋</span>
        <span className="hidden text-lg font-bold text-gray-800 dark:text-gray-100 md:block">
          Kanban
        </span>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors md:justify-start ${
                isActive
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
              title={item.label}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="hidden md:block">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-3 dark:border-gray-700">
        <div className="flex items-center justify-center gap-1 md:flex-col md:items-stretch md:gap-2">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Alternar tema"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            title="Sair"
          >
            <span className="hidden md:block">Sair</span>
            <span className="md:hidden">⏻</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
