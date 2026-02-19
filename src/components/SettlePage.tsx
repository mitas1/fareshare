"use client";

import { useTrip } from "@/lib/TripContext";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  calculateSettlements,
  calculatePersonSummary,
  calculateCategoryBreakdown,
  formatCurrency,
} from "@/lib/calculator";
import { CATEGORY_ICONS, CATEGORY_LABELS, ExpenseCategory } from "@/lib/types";

export default function SettlePage() {
  const { trip } = useTrip();
  const settlements = calculateSettlements(trip.people, trip.expenses);
  const categoryBreakdown = calculateCategoryBreakdown(trip.expenses);
  const totalExpenses = trip.expenses.reduce((sum, e) => sum + e.amount, 0);

  const getPersonName = (id: string) =>
    trip.people.find((p) => p.id === id)?.name || "Unknown";

  const getPersonColor = (id: string) =>
    trip.people.find((p) => p.id === id)?.color || "#999";

  if (trip.expenses.length === 0) {
    return (
      <>
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <p className="text-[var(--color-muted)] text-lg mb-4">
            Add some expenses first to see the settlement.
          </p>
          <Link
            href="/expenses"
            className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--color-primary-dark)]"
          >
            ← Add Expenses
          </Link>
        </main>
      </>
    );
  }

  const generateShareText = () => {
    let text = `💰 ${trip.name || "Trip"} — Settlement Summary\n`;
    text += `Total: ${formatCurrency(totalExpenses, trip.currency)}\n\n`;

    if (settlements.length === 0) {
      text += "✅ Everyone is settled up!\n";
    } else {
      text += "Payments needed:\n";
      for (const s of settlements) {
        text += `  ${getPersonName(s.from)} → ${getPersonName(s.to)}: ${formatCurrency(s.amount, trip.currency)}\n`;
      }
    }

    text += `\n— Split with FareShare`;
    return text;
  };

  const handleShare = async () => {
    const text = generateShareText();
    if (navigator.share) {
      try {
        await navigator.share({ title: "FareShare Settlement", text });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      alert("Settlement summary copied to clipboard!");
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Settle Up</h1>
            <p className="text-[var(--color-muted)] mt-1">
              {trip.name || "Trip"} ·{" "}
              {formatCurrency(totalExpenses, trip.currency)} total
            </p>
          </div>
          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-sm font-medium hover:bg-[var(--color-surface-alt)]"
          >
            📤 Share
          </button>
        </div>

        {/* Settlements */}
        <section className="bg-white rounded-2xl border border-[var(--color-border)] p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            {settlements.length === 0
              ? "✅ All settled!"
              : `${settlements.length} payment${settlements.length !== 1 ? "s" : ""} needed`}
          </h2>

          {settlements.length === 0 ? (
            <p className="text-[var(--color-muted)]">
              Everyone has paid their fair share — no payments needed!
            </p>
          ) : (
            <div className="space-y-4">
              {settlements.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-surface-alt)]"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                    style={{ backgroundColor: getPersonColor(s.from) }}
                  >
                    {getPersonName(s.from).charAt(0)}
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-xs text-[var(--color-muted)] uppercase tracking-wide">
                      pays
                    </div>
                    <div className="text-xl font-bold text-[var(--color-primary)]">
                      {formatCurrency(s.amount, trip.currency)}
                    </div>
                    <div className="text-xs text-[var(--color-muted)]">→</div>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                    style={{ backgroundColor: getPersonColor(s.to) }}
                  >
                    {getPersonName(s.to).charAt(0)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Per-Person Breakdown */}
        <section className="bg-white rounded-2xl border border-[var(--color-border)] p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Per Person</h2>
          <div className="space-y-3">
            {trip.people.map((person) => {
              const summary = calculatePersonSummary(person.id, trip.expenses);
              return (
                <div
                  key={person.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface-alt)]"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: person.color }}
                  >
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{person.name}</div>
                    <div className="text-xs text-[var(--color-muted)]">
                      Paid {formatCurrency(summary.totalPaid, trip.currency)} ·
                      Fair share{" "}
                      {formatCurrency(summary.totalOwes, trip.currency)}
                    </div>
                  </div>
                  <div
                    className={`text-right font-bold ${
                      summary.net > 0
                        ? "text-[var(--color-success)]"
                        : summary.net < 0
                          ? "text-[var(--color-danger)]"
                          : "text-[var(--color-muted)]"
                    }`}
                  >
                    {summary.net > 0 ? "+" : ""}
                    {formatCurrency(summary.net, trip.currency)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Category Breakdown */}
        <section className="bg-white rounded-2xl border border-[var(--color-border)] p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>
          <div className="space-y-3">
            {Object.entries(categoryBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amount]) => {
                const pct =
                  totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        {CATEGORY_ICONS[cat as ExpenseCategory]}{" "}
                        {CATEGORY_LABELS[cat as ExpenseCategory]}
                      </span>
                      <span className="text-sm font-bold">
                        {formatCurrency(amount, trip.currency)}
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--color-surface-alt)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--color-primary)] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/expenses"
            className="px-6 py-3 rounded-xl border border-[var(--color-border)] font-medium hover:bg-[var(--color-surface-alt)]"
          >
            ← Back to Expenses
          </Link>
        </div>
      </main>
    </>
  );
}
