"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useFinance, type TransactionType } from "@/context/FinanceContext";

const transactionOptions: Record<TransactionType, { label: string; helper: string; icon: string; color: string }> = {
  income: { label: "Entrada", helper: "Salário, extras ou valores por fora", icon: "↗", color: "bg-emerald-600" },
  expense: { label: "Despesa", helper: "Gastos do dia a dia", icon: "↘", color: "bg-rose-600" },
  investment: { label: "Investimento", helper: "Aplicações realizadas no mês", icon: "◈", color: "bg-violet-600" },
};

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export default function FinancePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { transactions, addTransaction, removeTransaction } = useFinance();
  const [type, setType] = useState<TransactionType>("income");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const monthTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((transaction) => {
      const date = new Date(transaction.createdAt);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
  }, [transactions]);

  const totals = useMemo(() => {
    const values = { income: 0, expense: 0, investment: 0 };
    monthTransactions.forEach((transaction) => { values[transaction.type] += transaction.amount; });
    return { ...values, balance: values.income - values.expense - values.investment };
  }, [monthTransactions]);

  if (!isAuthenticated) return null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = Number(amount.replace(",", "."));
    if (!description.trim() || !Number.isFinite(value) || value <= 0) return;
    addTransaction(description.trim(), value, type);
    setDescription("");
    setAmount("");
  };

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Controle financeiro</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-100 dark:text-white">Seu mês em ordem</h1>
          <p className="mt-2 text-sm text-black-100 dark:text-gray-400">Registre entradas, despesas e investimentos para acompanhar o saldo disponível.</p>
        </div>

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Entradas" amount={totals.income} tone="text-emerald-700 dark:text-emerald-300" />
          <SummaryCard label="Despesas" amount={totals.expense} tone="text-rose-700 dark:text-rose-300" />
          <SummaryCard label="Investimentos" amount={totals.investment} tone="text-violet-700 dark:text-violet-300" />
          <SummaryCard label="Saldo do mês" amount={totals.balance} tone={totals.balance >= 0 ? "text-blue-700 dark:text-blue-300" : "text-rose-700 dark:text-rose-300"} />
        </section>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Nova movimentação</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Escolha a categoria e informe o valor.</p>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {(Object.keys(transactionOptions) as TransactionType[]).map((option) => (
                <button key={option} type="button" onClick={() => setType(option)} className={`rounded-lg border p-3 text-left text-sm transition ${type === option ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-900/30" : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700"}`}>
                  <span className="block text-lg">{transactionOptions[option].icon}</span>
                  <span className="mt-1 block font-semibold text-gray-800 dark:text-gray-100">{transactionOptions[option].label}</span>
                </button>
              ))}
            </div>
            <form onSubmit={submit} className="mt-5 space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição<input value={description} onChange={(event) => setDescription(event.target.value)} placeholder={transactionOptions[type].helper} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white" /></label>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor (R$)<input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0,00" className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-white" /></label>
              <button className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 ${transactionOptions[type].color}`}>Adicionar {transactionOptions[type].label.toLowerCase()}</button>
            </form>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex items-baseline justify-between gap-3"><div><h2 className="text-lg font-semibold text-gray-900 dark:text-white">Balanço mensal</h2><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Movimentações deste mês</p></div><span className={`rounded-full px-3 py-1 text-sm font-semibold ${totals.balance >= 0 ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"}`}>{currency.format(totals.balance)}</span></div>
            {monthTransactions.length === 0 ? <div className="flex min-h-64 flex-col items-center justify-center text-center"><span className="text-4xl">📊</span><p className="mt-3 font-medium text-gray-600 dark:text-gray-300">Ainda não há movimentações neste mês.</p><p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Comece registrando sua primeira entrada, despesa ou investimento.</p></div> : <ul className="mt-5 divide-y divide-gray-100 dark:divide-gray-700">{[...monthTransactions].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((transaction) => { const option = transactionOptions[transaction.type]; return <li key={transaction.id} className="flex items-center gap-3 py-3"><span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${option.color}`}>{option.icon}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">{transaction.description}</p><p className="text-xs text-gray-500 dark:text-gray-400">{option.label} · {new Date(transaction.createdAt).toLocaleDateString("pt-BR")}</p></div><span className={`font-semibold ${transaction.type === "income" ? "text-emerald-600" : "text-gray-800 dark:text-gray-100"}`}>{transaction.type === "income" ? "+" : "−"}{currency.format(transaction.amount)}</span><button onClick={() => removeTransaction(transaction.id)} className="rounded p-1 text-gray-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20" aria-label={`Remover ${transaction.description}`}>✕</button></li>; })}</ul>}
          </section>
        </div>
      </div>
    </main>
  );
}

function SummaryCard({ label, amount, tone }: { label: string; amount: number; tone: string }) {
  return <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"><p className="text-sm text-gray-500 dark:text-gray-400">{label}</p><p className={`mt-2 text-2xl font-bold ${tone}`}>{currency.format(amount)}</p></div>;
}
