"use client";

import Link from "next/link";
import { useTrip } from "@/lib/TripContext";

export default function Navbar() {
  const { trip } = useTrip();
  const hasTrip = trip.name.length > 0;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[var(--color-border)]">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-2xl">✈️</span>
          <span className="text-[var(--color-primary)]">Fare</span>
          <span>Share</span>
        </Link>

        {hasTrip && (
          <div className="flex items-center gap-1 text-sm">
            <Link
              href="/trip"
              className="px-3 py-1.5 rounded-lg hover:bg-[var(--color-surface-alt)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            >
              Trip
            </Link>
            <Link
              href="/expenses"
              className="px-3 py-1.5 rounded-lg hover:bg-[var(--color-surface-alt)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            >
              Expenses
            </Link>
            <Link
              href="/settle"
              className="px-3 py-1.5 rounded-lg hover:bg-[var(--color-surface-alt)] text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            >
              Settle Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
