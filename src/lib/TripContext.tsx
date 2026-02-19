"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { Trip, Person, Expense, PERSON_COLORS } from "./types";
import { generateId } from "./calculator";

interface TripContextType {
  trip: Trip;
  setTripInfo: (
    name: string,
    description: string,
    startDate: string,
    endDate: string,
    currency: string,
  ) => void;
  addPerson: (name: string) => void;
  removePerson: (id: string) => void;
  updatePerson: (id: string, name: string) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  removeExpense: (id: string) => void;
  updateExpense: (id: string, expense: Omit<Expense, "id">) => void;
  resetTrip: () => void;
}

const defaultTrip: Trip = {
  id: "",
  name: "",
  description: "",
  startDate: "",
  endDate: "",
  people: [],
  expenses: [],
  currency: "USD",
};

const TripContext = createContext<TripContextType | null>(null);

const STORAGE_KEY = "fareshare_trip";

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [trip, setTrip] = useState<Trip>(defaultTrip);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTrip(JSON.parse(saved));
      } else {
        setTrip({ ...defaultTrip, id: generateId() });
      }
    } catch {
      setTrip({ ...defaultTrip, id: generateId() });
    }
    setLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
    }
  }, [trip, loaded]);

  const setTripInfo = useCallback(
    (
      name: string,
      description: string,
      startDate: string,
      endDate: string,
      currency: string,
    ) => {
      setTrip((prev) => ({
        ...prev,
        name,
        description,
        startDate,
        endDate,
        currency,
      }));
    },
    [],
  );

  const addPerson = useCallback((name: string) => {
    setTrip((prev) => {
      const newPerson: Person = {
        id: generateId(),
        name,
        color: PERSON_COLORS[prev.people.length % PERSON_COLORS.length],
      };
      return { ...prev, people: [...prev.people, newPerson] };
    });
  }, []);

  const removePerson = useCallback((id: string) => {
    setTrip((prev) => ({
      ...prev,
      people: prev.people.filter((p) => p.id !== id),
      expenses: prev.expenses
        .filter((e) => e.paidBy !== id)
        .map((e) => ({
          ...e,
          splitAmong: e.splitAmong.filter((pid) => pid !== id),
        }))
        .filter((e) => e.splitAmong.length > 0),
    }));
  }, []);

  const updatePerson = useCallback((id: string, name: string) => {
    setTrip((prev) => ({
      ...prev,
      people: prev.people.map((p) => (p.id === id ? { ...p, name } : p)),
    }));
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, "id">) => {
    setTrip((prev) => ({
      ...prev,
      expenses: [...prev.expenses, { ...expense, id: generateId() }],
    }));
  }, []);

  const removeExpense = useCallback((id: string) => {
    setTrip((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }));
  }, []);

  const updateExpense = useCallback(
    (id: string, expense: Omit<Expense, "id">) => {
      setTrip((prev) => ({
        ...prev,
        expenses: prev.expenses.map((e) =>
          e.id === id ? { ...e, ...expense } : e,
        ),
      }));
    },
    [],
  );

  const resetTrip = useCallback(() => {
    const newTrip = { ...defaultTrip, id: generateId() };
    setTrip(newTrip);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <TripContext.Provider
      value={{
        trip,
        setTripInfo,
        addPerson,
        removePerson,
        updatePerson,
        addExpense,
        removeExpense,
        updateExpense,
        resetTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) throw new Error("useTrip must be used within TripProvider");
  return context;
}
