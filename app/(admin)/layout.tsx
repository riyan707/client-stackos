// app/(admin)/layout.tsx
import Link from "next/link";
import React from "react";

const nav = [{ href: "/admin", label: "Dashboard" }];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen w-full">
        {/* Sidebar (desktop only) */}
        <aside className="hidden w-64 flex-col border-r border-white/10 bg-black md:flex">
          <div className="flex h-16 items-center px-6">
            <div className="text-sm font-semibold text-white/90">StackOS</div>
          </div>

          <nav className="flex-1 px-3 py-2">
            <div className="space-y-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/[0.06] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="border-t border-white/10 px-6 py-4 text-xs text-white/40">
            Admin Panel
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile top nav (shows only on mobile) */}
          <div className="md:hidden border-b border-white/10 bg-black px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white/90">StackOS</div>
              <Link
                href="/"
                className="text-xs text-white/60 hover:text-white"
              >
                Home
              </Link>
            </div>

            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="shrink-0 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70 hover:bg-white/[0.07] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Top bar */}
          <header className="border-b border-white/10 bg-black px-4 py-3 md:px-6 md:py-0">
            <div className="flex flex-col gap-3 md:h-16 md:flex-row md:items-center md:justify-between">
              {/* Left */}
              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold text-white/90">Dashboard</div>
                <div className="hidden text-xs text-white/40 md:block">
                  Overview & activity
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3 md:justify-end">
                <Link
                  href="/"
                  className="inline-flex h-9 items-center rounded-lg border border-white/15 bg-white/[0.04] px-3 text-sm text-white/70 hover:bg-white/[0.07] hover:text-white"
                >
                  ← Return to homepage
                </Link>

                {/* Search (desktop only) */}
                <div className="hidden md:block">
                  <input
                    placeholder="Search…"
                    className="h-9 w-72 rounded-lg border border-white/15 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/35 outline-none focus:ring-2 focus:ring-white/10"
                  />
                </div>

                <div className="hidden sm:block text-sm text-white/60">Admin</div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}