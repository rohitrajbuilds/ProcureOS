"use client";

import { useEffect, useState } from "react";

import DashboardShell from "@/components/dashboard-shell";
import { DashboardOverviewSkeleton } from "@/components/loading-state";
import ProcurementForm from "@/components/procurement-form";
import StatCard from "@/components/stat-card";
import { fetchAnalytics, fetchProcurements, resetDemoWorkspace } from "@/services/api";
import { getUser, useProtectedRoute } from "@/services/auth";
import { getErrorMessage } from "@/services/errors";

export default function DashboardPage() {
  useProtectedRoute();
  const [analytics, setAnalytics] = useState(null);
  const [procurements, setProcurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState("");
  const [workspaceMessage, setWorkspaceMessage] = useState("");
  const [isDemoUser, setIsDemoUser] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [analyticsResponse, procurementResponse] = await Promise.all([
        fetchAnalytics(),
        fetchProcurements()
      ]);
      setAnalytics(analyticsResponse.data);
      setProcurements(procurementResponse.data);
    } catch (error) {
      setError(getErrorMessage(error, "Unable to load dashboard data."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = getUser();
    setIsDemoUser(user?.email === "demo@procureos.ai");
    loadData();
  }, []);

  const handleResetDemo = async () => {
    const confirmed = window.confirm(
      "Reset the demo workspace? This will delete all demo procurement requests, negotiation logs, and decisions."
    );
    if (!confirmed) {
      return;
    }

    setResetting(true);
    setError("");
    setWorkspaceMessage("");

    try {
      const response = await resetDemoWorkspace();
      await loadData();
      setWorkspaceMessage(`Demo workspace reset. Cleared ${response.data.reset_requests} request(s).`);
    } catch (resetError) {
      setError(getErrorMessage(resetError, "Unable to reset the demo workspace."));
    } finally {
      setResetting(false);
    }
  };

  return (
    <DashboardShell>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="space-y-6">
          {loading ? (
            <DashboardOverviewSkeleton />
          ) : (
            <>
              <div className="panel p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Overview</p>
                    <h1 className="mt-3 text-3xl font-semibold text-ink">Autonomous procurement command center</h1>
                    <p className="mt-3 max-w-2xl text-sm text-slate-500">
                      Create a purchase request and let the agent stack handle vendor discovery, negotiation, risk review, and final selection.
                    </p>
                  </div>
                  {isDemoUser ? (
                    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 lg:max-w-sm">
                      <p className="text-xs uppercase tracking-[0.28em] text-amber-700">Demo mode</p>
                      <p className="mt-2 text-sm text-amber-900">
                        Reset the workspace before each presentation to start from a clean slate.
                      </p>
                      <button
                        className="button-secondary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={resetting}
                        onClick={handleResetDemo}
                        type="button"
                      >
                        {resetting ? "Resetting demo workspace..." : "Reset demo workspace"}
                      </button>
                    </div>
                  ) : null}
                </div>
                {workspaceMessage ? <p className="mt-4 text-sm font-medium text-emerald-700">{workspaceMessage}</p> : null}
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
                  {error ? <p className="text-sm text-red-600">{error}</p> : null}
                  {!error && procurements.length === 0 ? (
                    <p className="text-sm text-slate-500">No requests yet. Create your first procurement request on the right.</p>
                  ) : (
                    procurements.map((item) => (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4" key={item.id}>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-ink">{item.title}</p>
                            <p className="text-sm text-slate-500">
                              {item.category} - Budget ${item.budget} - Qty {item.quantity}
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
            </>
          )}
        </section>
        <ProcurementForm onCreated={loadData} />
      </div>
    </DashboardShell>
  );
}
