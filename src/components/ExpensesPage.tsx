"use client";

import { useState } from "react";
import { useTrip } from "@/lib/TripContext";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  Expense,
  ExpenseCategory,
  CATEGORY_ICONS,
  CATEGORY_LABELS,
} from "@/lib/types";
import { formatCurrency } from "@/lib/calculator";

export default function ExpensesPage() {
  const { trip, addExpense, removeExpense } = useTrip();
  const [showForm, setShowForm] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(trip.people[0]?.id || "");
  const [splitAmong, setSplitAmong] = useState<string[]>(
    trip.people.map((p) => p.id),
  );
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({});
  const [category, setCategory] = useState<ExpenseCategory>("food");

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setPaidBy(trip.people[0]?.id || "");
    setSplitAmong(trip.people.map((p) => p.id));
    setSplitType("equal");
    setCustomSplits({});
    setCategory("food");
    setShowForm(false);
  };

  const handleSubmit = () => {
    const amountNum = parseFloat(amount);
    if (
      !description.trim() ||
      isNaN(amountNum) ||
      amountNum <= 0 ||
      !paidBy ||
      splitAmong.length === 0
    ) {
      return;
    }

    const expense: Omit<Expense, "id"> = {
      description: description.trim(),
      amount: Math.round(amountNum * 100) / 100,
      paidBy,
      splitAmong,
      splitType,
      category,
      date: new Date().toISOString().split("T")[0],
    };

    if (splitType === "custom") {
      const parsed: Record<string, number> = {};
      for (const id of splitAmong) {
        parsed[id] = parseFloat(customSplits[id] || "0") || 0;
      }
      expense.customSplits = parsed;
    }

    addExpense(expense);
    resetForm();
  };

  const toggleSplitPerson = (id: string) => {
    setSplitAmong((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id],
    );
  };

  const getPersonName = (id: string) =>
    trip.people.find((p) => p.id === id)?.name || "Unknown";

  const getPersonColor = (id: string) =>
    trip.people.find((p) => p.id === id)?.color || "#999";

  const totalExpenses = trip.expenses.reduce((sum, e) => sum + e.amount, 0);

  if (trip.people.length < 2) {
    return (
      <>
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-[var(--color-muted)] text-lg mb-4">
            Set up your trip and add at least 2 people first.
          </p>
          <Link
            href="/trip"
            className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-primary-dark)]"
          >
            ← Set Up Trip
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Expenses</h1>
            <p className="text-[var(--color-muted)] mt-1">
              {trip.expenses.length} expense
              {trip.expenses.length !== 1 ? "s" : ""} ·{" "}
              {formatCurrency(totalExpenses, trip.currency)} total
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-primary)]/25 active:scale-[0.98]"
            >
              + Add Expense
            </button>
          )}
        </div>

        {/* Add Expense Form */}
        {showForm && (
          <section className="bg-white rounded-2xl border border-[var(--color-primary-light)] p-6 mb-8 shadow-lg shadow-[var(--color-primary)]/10">
            <h2 className="text-lg font-semibold mb-4">New Expense</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Dinner at La Playa"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                    Amount *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                    Paid by *
                  </label>
                  <select
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
                  >
                    {trip.people.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as ExpenseCategory)
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {CATEGORY_ICONS[key as ExpenseCategory]} {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Split type */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-muted)] mb-2">
                  Split type
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSplitType("equal")}
                    className={`flex-1 py-2 rounded-xl font-medium text-sm border ${
                      splitType === "equal"
                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                        : "bg-[var(--color-surface-alt)] border-[var(--color-border)] text-[var(--color-muted)]"
                    }`}
                  >
                    Equal split
                  </button>
                  <button
                    onClick={() => setSplitType("custom")}
                    className={`flex-1 py-2 rounded-xl font-medium text-sm border ${
                      splitType === "custom"
                        ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                        : "bg-[var(--color-surface-alt)] border-[var(--color-border)] text-[var(--color-muted)]"
                    }`}
                  >
                    Custom amounts
                  </button>
                </div>
              </div>

              {/* Split among */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-muted)] mb-2">
                  Split among
                </label>
                <div className="flex flex-wrap gap-2">
                  {trip.people.map((person) => {
                    const selected = splitAmong.includes(person.id);
                    return (
                      <button
                        key={person.id}
                        onClick={() => toggleSplitPerson(person.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                          selected
                            ? "text-white border-transparent"
                            : "bg-white border-[var(--color-border)] text-[var(--color-muted)]"
                        }`}
                        style={
                          selected ? { backgroundColor: person.color } : {}
                        }
                      >
                        {person.name}
                        {selected && <span>✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom split amounts */}
              {splitType === "custom" && (
                <div className="space-y-2">
                  {splitAmong.map((id) => (
                    <div key={id} className="flex items-center gap-3">
                      <span className="w-24 text-sm font-medium truncate">
                        {getPersonName(id)}
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={customSplits[id] || ""}
                        onChange={(e) =>
                          setCustomSplits((prev) => ({
                            ...prev,
                            [id]: e.target.value,
                          }))
                        }
                        className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-alt)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 text-sm"
                      />
                    </div>
                  ))}
                  {amount && (
                    <p className="text-xs text-[var(--color-muted)]">
                      Custom total:{" "}
                      {formatCurrency(
                        splitAmong.reduce(
                          (sum, id) =>
                            sum + (parseFloat(customSplits[id] || "0") || 0),
                          0,
                        ),
                        trip.currency,
                      )}{" "}
                      / {formatCurrency(parseFloat(amount) || 0, trip.currency)}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={
                    !description.trim() ||
                    !amount ||
                    parseFloat(amount) <= 0 ||
                    splitAmong.length === 0
                  }
                  className="flex-1 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-dark)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Add Expense
                </button>
                <button
                  onClick={resetForm}
                  className="px-5 py-3 rounded-xl border border-[var(--color-border)] text-[var(--color-muted)] hover:bg-[var(--color-surface-alt)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Expense List */}
        {trip.expenses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">💸</p>
            <p className="text-[var(--color-muted)] text-lg">
              No expenses yet. Add your first one!
            </p>
          </div>
        ) : (
          <div className="space-y-3 mb-10">
            {[...trip.expenses].reverse().map((expense) => (
              <div
                key={expense.id}
                className="bg-white rounded-xl border border-[var(--color-border)] p-4 flex items-center gap-4 group hover:shadow-md"
              >
                <div className="text-2xl">
                  {CATEGORY_ICONS[expense.category]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">
                    {expense.description}
                  </div>
                  <div className="text-sm text-[var(--color-muted)]">
                    Paid by{" "}
                    <span
                      className="font-medium"
                      style={{ color: getPersonColor(expense.paidBy) }}
                    >
                      {getPersonName(expense.paidBy)}
                    </span>{" "}
                    · Split{" "}
                    {expense.splitAmong.length === trip.people.length
                      ? "equally"
                      : `among ${expense.splitAmong.length}`}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-lg">
                    {formatCurrency(expense.amount, trip.currency)}
                  </div>
                  <div className="text-xs text-[var(--color-muted)]">
                    {expense.date}
                  </div>
                </div>
                <button
                  onClick={() => removeExpense(expense.id)}
                  className="text-[var(--color-muted)] hover:text-[var(--color-danger)] opacity-0 group-hover:opacity-100 text-lg shrink-0"
                  title="Delete expense"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bottom actions */}
        {trip.expenses.length > 0 && (
          <div className="text-center">
            <Link
              href="/settle"
              className="inline-flex items-center gap-2 bg-[var(--color-success)] text-white px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-green-600 shadow-lg shadow-[var(--color-success)]/25 active:scale-[0.98]"
            >
              Settle Up →
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
