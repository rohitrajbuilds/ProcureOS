"use client";

import { useEffect, useState } from "react";

import DashboardShell from "@/components/dashboard-shell";
import ProcurementForm from "@/components/procurement-form";
import StatCard from "@/components/stat-card";
import { fetchAnalytics, fetchProcurements } from "@/services/api";
import { useProtectedRoute } from "@/services/auth";

export default function DashboardPage() {
  useProtectedRoute();
  const [analytics, setAnalytics] = useState(null);
  const [procurements, setProcurements] = useState([]);

  const loadData = async () => {
    const [analyticsResponse, procurementResponse] = await Promise.all([
      fetchAnalytics(),
      fetchProcurements()
    ]);
    setAnalytics(analyticsResponse.data);
    setProcurements(procurementResponse.data);
  };

  useEffect(() => {
    loadData().catch(() => {});
  }, []);

  return (
    <DashboardShell>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          <div className="panel p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Overview</p>
            <h1 className="mt-3 text-3xl font-semibold text-ink">Autonomous procurement command center</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-500">
              Create a purchase request and let the agent stack handle vendor discovery, negotiation, risk review, and final selection.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Requests" value={analytics?.spend_summary.total_requests ?? 0} />
            <StatCard label="Total Budget" value={`$${analytics?.spend_summary.total_budget ?? 0}`} />
            <StatCard label="Avg Budget" value={`$${analytics?.spend_summary.average_budget ?? 0}`} />
            <StatCard label="Savings" value={`$${analytics?.spend_summary.negotiated_savings ?? 0}`} />
          </div>
          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-ink">Recent decisions</h2>
                <p className="text-sm text-slate-500">Latest completed procurement workflows.</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {procurements.length === 0 ? (
                <p className="text-sm text-slate-500">No requests yet. Create your first procurement request on the right.</p>
              ) : (
                procurements.map((item) => (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4" key={item.id}>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">{item.title}</p>
                        <p className="text-sm text-slate-500">
                          {item.category} • Budget ${item.budget} • Qty {item.quantity}
                        </p>
                      </div>
                      <a className="text-sm font-semibold text-signal" href={`/decisions/${item.id}`}>
                        View decision
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
        <ProcurementForm onCreated={loadData} />
      </div>
    </DashboardShell>
  );
}
