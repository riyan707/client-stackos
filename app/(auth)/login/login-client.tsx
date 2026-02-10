"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/admin";

  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function signIn() {
    const e = email.trim().toLowerCase();
    if (!e || !password) {
      setErrorMsg("Please enter your email and password.");
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: e,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-10">
        <Card className="w-full rounded-2xl border-white/10 bg-white/[0.04] backdrop-blur">
          <CardHeader className="space-y-2">
            <div className="text-xs text-white/50">StackOS</div>
            <CardTitle className="text-2xl text-white">Admin login</CardTitle>
            <p className="text-sm text-white/60">
              Sign in to manage the platform.
            </p>
          </CardHeader>

          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                signIn();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/70">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@yourdomain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="bg-transparent border-white/20 text-white placeholder:text-white/40 focus-visible:ring-0"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white/70">
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="text-xs text-white/50 underline underline-offset-4 hover:text-white"
                    disabled={loading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="bg-transparent border-white/20 text-white placeholder:text-white/40 focus-visible:ring-0"
                />
              </div>

              {errorMsg && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  {errorMsg}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-white text-black hover:bg-white/90"
              >
                {loading ? "Signing in…" : "Sign in"}
              </Button>

              <p className="text-xs text-white/40">
                You’ll be redirected after login.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}