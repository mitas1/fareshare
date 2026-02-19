import { Expense, Person, Settlement } from "./types";

/**
 * Calculate what each person owes and is owed
 */
export function calculateBalances(
  people: Person[],
  expenses: Expense[],
): Record<string, number> {
  const balances: Record<string, number> = {};

  // Initialize balances
  for (const person of people) {
    balances[person.id] = 0;
  }

  for (const expense of expenses) {
    // The payer is owed money
    balances[expense.paidBy] += expense.amount;

    // Calculate what each person in the split owes
    if (expense.splitType === "equal") {
      const share = expense.amount / expense.splitAmong.length;
      for (const personId of expense.splitAmong) {
        balances[personId] -= share;
      }
    } else if (expense.splitType === "custom" && expense.customSplits) {
      for (const [personId, amount] of Object.entries(expense.customSplits)) {
        balances[personId] -= amount;
      }
    }
  }

  return balances;
}

/**
 * Calculate minimum number of settlements to resolve all debts.
 * Uses a greedy algorithm: repeatedly settle the largest creditor with the largest debtor.
 */
export function calculateSettlements(
  people: Person[],
  expenses: Expense[],
): Settlement[] {
  const balances = calculateBalances(people, expenses);
  const settlements: Settlement[] = [];

  // Create arrays of debtors (negative balance) and creditors (positive balance)
  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  for (const [id, balance] of Object.entries(balances)) {
    const rounded = Math.round(balance * 100) / 100;
    if (rounded < -0.01) {
      debtors.push({ id, amount: Math.abs(rounded) });
    } else if (rounded > 0.01) {
      creditors.push({ id, amount: rounded });
    }
  }

  // Sort both by amount descending
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i].amount, creditors[j].amount);
    const roundedAmount = Math.round(amount * 100) / 100;

    if (roundedAmount > 0.01) {
      settlements.push({
        from: debtors[i].id,
        to: creditors[j].id,
        amount: roundedAmount,
      });
    }

    debtors[i].amount -= amount;
    creditors[j].amount -= amount;

    if (debtors[i].amount < 0.01) i++;
    if (creditors[j].amount < 0.01) j++;
  }

  return settlements;
}

/**
 * Calculate per-person spending summary
 */
export function calculatePersonSummary(
  personId: string,
  expenses: Expense[],
): { totalPaid: number; totalOwes: number; net: number } {
  let totalPaid = 0;
  let totalOwes = 0;

  for (const expense of expenses) {
    if (expense.paidBy === personId) {
      totalPaid += expense.amount;
    }

    if (
      expense.splitType === "equal" &&
      expense.splitAmong.includes(personId)
    ) {
      totalOwes += expense.amount / expense.splitAmong.length;
    } else if (
      expense.splitType === "custom" &&
      expense.customSplits?.[personId]
    ) {
      totalOwes += expense.customSplits[personId];
    }
  }

  return {
    totalPaid: Math.round(totalPaid * 100) / 100,
    totalOwes: Math.round(totalOwes * 100) / 100,
    net: Math.round((totalPaid - totalOwes) * 100) / 100,
  };
}

/**
 * Calculate spending by category
 */
export function calculateCategoryBreakdown(
  expenses: Expense[],
): Record<string, number> {
  const breakdown: Record<string, number> = {};

  for (const expense of expenses) {
    if (!breakdown[expense.category]) {
      breakdown[expense.category] = 0;
    }
    breakdown[expense.category] += expense.amount;
  }

  return breakdown;
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD",
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
