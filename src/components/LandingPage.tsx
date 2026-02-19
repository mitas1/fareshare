"use client";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          ✈️ No sign-up required. 100% free.
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6">
          Split trip costs
          <br />
          <span className="text-[var(--color-primary)]">without the drama</span>
        </h1>
        <p className="text-xl text-[var(--color-muted)] max-w-2xl mx-auto mb-10">
          Track expenses, split them fairly, and settle up with the fewest
          transactions possible. Built for group trips, roommates, and friends.
        </p>
        <a
          href="/trip"
          className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[var(--color-primary-dark)] shadow-lg shadow-[var(--color-primary)]/25 hover:shadow-xl hover:shadow-[var(--color-primary)]/30 active:scale-[0.98]"
        >
          Start a Trip
          <span>→</span>
        </a>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              icon: "👥",
              title: "Add your group",
              description:
                "Enter everyone's name — that's it. No accounts, no invites to accept.",
            },
            {
              step: "2",
              icon: "💸",
              title: "Log expenses",
              description:
                "Add expenses as you go. Pick who paid and who it's split between.",
            },
            {
              step: "3",
              icon: "✅",
              title: "Settle up",
              description:
                "We calculate the minimum payments needed so everyone's square.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-2xl p-8 border border-[var(--color-border)] hover:shadow-lg hover:border-[var(--color-primary-light)]"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <div className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">
                Step {item.step}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-[var(--color-muted)]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why FareShare?</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              icon: "🧮",
              title: "Minimum transactions",
              desc: "Our algorithm finds the fewest payments to settle all debts. No more circular payments.",
            },
            {
              icon: "🔀",
              title: "Flexible splitting",
              desc: "Split equally, by custom amounts, or exclude people from individual expenses.",
            },
            {
              icon: "📊",
              title: "Category breakdown",
              desc: "See where the money went — food, lodging, activities, transport, and more.",
            },
            {
              icon: "💾",
              title: "Saved locally",
              desc: "Your data stays in your browser. No servers, no accounts, no tracking.",
            },
            {
              icon: "📱",
              title: "Works everywhere",
              desc: "Fully responsive — use it on your phone at the restaurant or laptop at the hotel.",
            },
            {
              icon: "⚡",
              title: "Instant results",
              desc: "No loading spinners. Calculations happen instantly as you add expenses.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="flex gap-4 p-5 rounded-xl bg-white border border-[var(--color-border)]"
            >
              <div className="text-2xl shrink-0">{f.icon}</div>
              <div>
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-[var(--color-muted)]">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to stop arguing about money?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
            Start tracking your trip expenses now — it takes 30 seconds.
          </p>
          <a
            href="/trip"
            className="inline-flex items-center gap-2 bg-white text-[var(--color-primary)] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/90 shadow-lg active:scale-[0.98]"
          >
            Start a Trip — it&apos;s free
            <span>→</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-8 border-t border-[var(--color-border)] text-center text-sm text-[var(--color-muted)]">
        <p>✈️ FareShare — Split costs, not friendships.</p>
      </footer>
    </div>
  );
}
