"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type TransactionType = "income" | "expense" | "investment";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  createdAt: string;
}

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (description: string, amount: number, type: TransactionType) => void;
  removeTransaction: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);
const storageKey = "kanban-finance-transactions";

function createId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? (JSON.parse(stored) as Transaction[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (description: string, amount: number, type: TransactionType) => {
    setTransactions((current) => [
      ...current,
      { id: createId(), description, amount, type, createdAt: new Date().toISOString() },
    ]);
  };

  const removeTransaction = (id: string) => {
    setTransactions((current) => current.filter((transaction) => transaction.id !== id));
  };

  return (
    <FinanceContext.Provider value={{ transactions, addTransaction, removeTransaction }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error("useFinance must be used within FinanceProvider");
  return context;
}
