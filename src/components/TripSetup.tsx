"use client";

import { useState } from "react";
import { useTrip } from "@/lib/TripContext";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function TripPage() {
  const { trip, setTripInfo, addPerson, removePerson, updatePerson } =
    useTrip();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleAddPerson = () => {
    const name = newName.trim();
    if (!name) return;
    addPerson(name);
    setNewName("");
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      updatePerson(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName("");
  };

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8">Set up your trip</h1>

        {/* Trip Info */}
        <section className="bg-white rounded-2xl border border-[var(--color-border)] p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Trip Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                Trip Name *
              </label>
              <input
                type="text"
                placeholder="e.g., Cabo 2026"
                value={trip.name}
                onChange={(e) =>
                  setTripInfo(
                    e.target.value,
                    trip.description,
                    trip.startDate,
                    trip.endDate,
                    trip.currency,
                  )
                }
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                Description
              </label>
              <input
                type="text"
                placeholder="e.g., Annual friends getaway"
                value={trip.description}
                onChange={(e) =>
                  setTripInfo(
                    trip.name,
                    e.target.value,
                    trip.startDate,
                    trip.endDate,
                    trip.currency,
                  )
                }
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={trip.startDate}
                  onChange={(e) =>
                    setTripInfo(
                      trip.name,
                      trip.description,
                      e.target.value,
                      trip.endDate,
                      trip.currency,
                    )
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={trip.endDate}
                  onChange={(e) =>
                    setTripInfo(
                      trip.name,
                      trip.description,
                      trip.startDate,
                      e.target.value,
                      trip.currency,
                    )
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">
                Currency
              </label>
              <select
                value={trip.currency}
                onChange={(e) =>
                  setTripInfo(
                    trip.name,
                    trip.description,
                    trip.startDate,
                    trip.endDate,
                    e.target.value,
                  )
                }
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="INR">INR (₹)</option>
                <option value="MXN">MXN (MX$)</option>
              </select>
            </div>
          </div>
        </section>

        {/* People */}
        <section className="bg-white rounded-2xl border border-[var(--color-border)] p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            People ({trip.people.length})
          </h2>

          {trip.people.length > 0 && (
            <ul className="space-y-2 mb-4">
              {trip.people.map((person) => (
                <li
                  key={person.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface-alt)] group"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ backgroundColor: person.color }}
                  >
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  {editingId === person.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      autoFocus
                      className="flex-1 px-2 py-1 rounded-lg border border-[var(--color-primary)] bg-white focus:outline-none"
                    />
                  ) : (
                    <span
                      className="flex-1 font-medium cursor-pointer"
                      onClick={() => startEdit(person.id, person.name)}
                    >
                      {person.name}
                    </span>
                  )}
                  <button
                    onClick={() => removePerson(person.id)}
                    className="text-[var(--color-muted)] hover:text-[var(--color-danger)] opacity-0 group-hover:opacity-100 text-lg"
                    title="Remove person"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a person..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddPerson()}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)]"
            />
            <button
              onClick={handleAddPerson}
              disabled={!newName.trim()}
              className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </section>

        {/* Continue */}
        {trip.name && trip.people.length >= 2 && (
          <div className="text-center">
            <Link
              href="/expenses"
              className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-8 py-3.5 rounded-xl text-lg font-semibold hover:bg-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-primary)]/25 active:scale-[0.98]"
            >
              Add Expenses →
            </Link>
          </div>
        )}
        {trip.name && trip.people.length < 2 && (
          <p className="text-center text-[var(--color-muted)] text-sm">
            Add at least 2 people to continue.
          </p>
        )}
      </main>
    </>
  );
}
