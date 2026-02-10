"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function Page() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const cleanEmail = email.trim().toLowerCase();

    const { error } = await supabase.from("waitlist").insert({ email: cleanEmail });

    if (error) {
      // Best: handle Postgres unique violation (email already exists)
      const isDuplicate =
        (error as any)?.code === "23505" ||
        error.message.toLowerCase().includes("duplicate");

      if (isDuplicate) {
        setStatus("success");
        setMessage("You’re already on the waitlist ✅");
        return;
      }

      setStatus("error");
      setMessage(error.message || "Something went wrong. Please try again.");
      return;
    }

    setStatus("success");
    setMessage("You’re in ✅ We’ll email you when early access opens.");
    setEmail("");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Outer card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/70 backdrop-blur shadow-[0_20px_60px_-30px_rgba(2,6,23,0.35)]">
          {/* soft background glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-blue-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-[-60px] h-56 w-56 rounded-full bg-slate-900/10 blur-3xl" />

          <div className="relative p-8 pt-10">
            {/* Headline */}
            <h1 className="text-[40px] leading-[1.05] font-semibold tracking-tight text-slate-800">
              Is this subscription{" "}
              <span className="text-blue-600">actually worth it?</span>
            </h1>

            {/* Subhead */}
            <p className="mt-5 text-lg leading-relaxed text-slate-500">
              StackOS helps you decide{" "}
              <span className="text-slate-700 font-medium">before you pay</span> —
              <br />
              free options, clear picks, honest answers.
            </p>

            {/* Illustration */}
            <div className="mt-8 flex justify-center">
              <div className="w-full max-w-md">
                <Image
                  src="/graphic.png"
                  alt="StackOS illustration"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>

            {/* CTA block */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-[0_12px_30px_-20px_rgba(2,6,23,0.35)]">
              <div className="bg-blue-600 px-6 py-5">
                <h2 className="text-2xl font-semibold tracking-tight text-white">
                  Get Early Access
                </h2>
                <p className="mt-1 text-sm text-white/80">
                  Join the waitlist for priority access at launch.
                </p>
              </div>

              <div className="px-6 py-6">
                <form className="space-y-3" onSubmit={onSubmit}>
                  <label className="block">
                    <span className="sr-only">Email</span>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-600/15 focus:border-blue-300"
                      disabled={status === "loading"}
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-white font-semibold tracking-tight shadow-sm hover:bg-slate-800 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "Joining..." : "Join the Waitlist"}
                  </button>
                </form>

                {message ? (
                  <p
                    className={`mt-4 text-center text-xs ${
                      status === "error" ? "text-red-500" : "text-slate-500"
                    }`}
                  >
                    {message}
                  </p>
                ) : (
                  <p className="mt-4 text-center text-xs text-slate-400">
                    No spam. Just one email when early access opens.
                  </p>
                )}

                <div className="mt-4 text-center">
                  <Link
                    href="/admin"
                    className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-4"
                  >
                    Are you the owner?
                  </Link>
                </div>
              </div>
            </div>

            {/* Small footer note */}
            <p className="mt-6 text-center text-xs text-slate-400">
              We’ll always show you the best free option first — paid only when it’s genuinely worth it.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
