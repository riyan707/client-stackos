import { createSupabaseServerClient } from "@/lib/supabase/server";

function daysAgoISO(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function StatCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: number;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
      <div className="text-xs text-white/40">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-white/90">{value}</div>
      {sub ? <div className="mt-1 text-xs text-white/40">{sub}</div> : null}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient();

  const { count: total, error: e1 } = await supabase
    .from("waitlist")
    .select("*", { count: "exact", head: true });
  if (e1) throw new Error(e1.message);

  const { count: last7, error: e2 } = await supabase
    .from("waitlist")
    .select("*", { count: "exact", head: true })
    .gte("created_at", daysAgoISO(7));
  if (e2) throw new Error(e2.message);

  const { count: last30, error: e3 } = await supabase
    .from("waitlist")
    .select("*", { count: "exact", head: true })
    .gte("created_at", daysAgoISO(30));
  if (e3) throw new Error(e3.message);

  const { data: recent, error: e4 } = await supabase
    .from("waitlist")
    .select("email, created_at")
    .order("created_at", { ascending: false })
    .limit(20);
  if (e4) throw new Error(e4.message);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total registrations" value={total ?? 0} />
        <StatCard title="Registrations (7d)" value={last7 ?? 0} sub="Last 7 days" />
        <StatCard title="Registrations (30d)" value={last30 ?? 0} sub="Last 30 days" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
        <div className="mb-1 text-sm font-semibold text-white/90">Recent signups</div>
        <div className="text-xs text-white/40">Last 20 registrations</div>

        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="border-b border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/60 md:border-b-0 md:border-r">
              Email
            </div>
            <div className="bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/60">
              Created
            </div>
          </div>

          <div className="divide-y divide-white/10">
            {(recent ?? []).length === 0 ? (
              <div className="px-4 py-8 text-sm text-white/40">No registrations yet.</div>
            ) : (
              recent!.map((r) => (
                <div
                  key={`${r.email}-${r.created_at}`}
                  className="px-4 py-3 md:px-0 md:py-0"
                >
                  {/* Mobile */}
                  <div className="md:hidden space-y-1">
                    <div className="text-sm text-white/80 break-all">{r.email}</div>
                    <div className="text-xs text-white/50">
                      {new Date(r.created_at).toLocaleString()}
                    </div>
                  </div>
              
                  {/* Desktop */}
                  <div className="hidden md:grid md:grid-cols-2">
                    <div className="px-4 py-3 text-sm text-white/80 md:border-r md:border-white/10">
                      {r.email}
                    </div>
                    <div className="px-4 py-3 text-sm text-white/50">
                      {new Date(r.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}