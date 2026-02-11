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
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100">
      {/* background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-56 right-[-140px] h-[520px] w-[520px] rounded-full bg-slate-900/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        {/* MOBILE: no outer card */}
        <div className="w-full lg:hidden">
          <h1 className="text-[34px] leading-[1.05] font-semibold tracking-tight text-slate-800">
            Is this subscription{" "}
            <span className="text-blue-600">actually worth it?</span>
          </h1>

          <p className="mt-4 text-base leading-relaxed text-slate-500">
            Decide <span className="text-slate-700 font-medium">before you pay</span>. Free options first.
          </p>

          {/* Graphic under title */}
          <div className="mt-5">
            <Image
              src="/graphic.png"
              alt="StackOS illustration"
              width={900}
              height={600}
              className="w-full h-auto select-none"
              priority
            />
          </div>

          {/* Form card (kept as a card because it helps conversion + focus) */}
          <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-[0_14px_40px_-28px_rgba(2,6,23,0.45)]">
            <div className="bg-blue-600 px-6 py-5">
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Get Early Access
              </h2>
              <p className="mt-1 text-sm text-white/80">
                Priority access when we launch.
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
                  No spam. One email when early access opens.
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

        </div>

        {/* DESKTOP: outer card + full-height right panel */}
        <div className="hidden lg:block w-full">
          <div className="w-full relative overflow-hidden rounded-3xl border border-slate-200 bg-white/70 backdrop-blur shadow-[0_24px_80px_-40px_rgba(2,6,23,0.45)]">
            {/* inner glows */}
            <div className="pointer-events-none absolute -top-28 left-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-400/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-36 right-[-80px] h-80 w-80 rounded-full bg-slate-900/10 blur-3xl" />

            <div className="relative p-12">
              <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch">
                {/* LEFT */}
                <div className="flex flex-col">
                  <h1 className="text-[52px] leading-[1.02] font-semibold tracking-tight text-slate-800">
                    Is this subscription{" "}
                    <span className="text-blue-600">actually worth it?</span>
                  </h1>

                  <p className="mt-4 text-lg leading-relaxed text-slate-500">
                    StackOS helps you decide{" "}
                    <span className="text-slate-700 font-medium">before you pay</span> — free options, clear picks, honest answers.
                  </p>

                  <div className="mt-8">
                    <Image
                      src="/graphic.png"
                      alt="StackOS illustration"
                      width={1100}
                      height={800}
                      className="w-full h-auto select-none"
                      priority
                    />
                  </div>

                </div>

                {/* RIGHT: full height */}
                <div className="h-full">
                  <div className="h-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-[0_14px_40px_-28px_rgba(2,6,23,0.45)] flex flex-col">
                    <div className="bg-blue-600 px-8 py-7">
                      <h2 className="text-3xl font-semibold tracking-tight text-white">
                        Get Early Access
                      </h2>
                      <p className="mt-2 text-sm text-white/80">
                        Priority access when we launch.
                      </p>
                    </div>

                    <div className="px-8 py-8 flex flex-col flex-1">
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
                          No spam. One email when early access opens.
                        </p>
                      )}

                      

                      {/* pushes footer to bottom so the panel feels “full height” */}
                      <div className="mt-auto pt-10 text-center">
                        <div className="mt-6 text-center">
                          <Link
                            href="/admin"
                            className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-4"
                          >
                            Are you the owner?
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* end RIGHT */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
