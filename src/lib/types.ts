export interface Person {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // Person id
  splitAmong: string[]; // Person ids
  splitType: "equal" | "custom";
  customSplits?: Record<string, number>; // Person id -> amount
  category: ExpenseCategory;
  date: string;
}

export type ExpenseCategory =
  | "lodging"
  | "food"
  | "transport"
  | "activities"
  | "drinks"
  | "groceries"
  | "other";

export interface Trip {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  people: Person[];
  expenses: Expense[];
  currency: string;
}

export interface Settlement {
  from: string; // Person id
  to: string; // Person id
  amount: number;
}

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  lodging: "🏨",
  food: "🍽️",
  transport: "🚗",
  activities: "🎯",
  drinks: "🍻",
  groceries: "🛒",
  other: "📦",
};

export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  lodging: "Lodging",
  food: "Food & Dining",
  transport: "Transport",
  activities: "Activities",
  drinks: "Drinks",
  groceries: "Groceries",
  other: "Other",
};

export const PERSON_COLORS = [
  "#6366f1", // indigo
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#eab308", // yellow
  "#ef4444", // red
  "#22c55e", // green
  "#64748b", // slate
];
