"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import DashboardShell from "@/components/dashboard-shell";
import { DecisionSkeleton } from "@/components/loading-state";
import { fetchDecision } from "@/services/api";
import { useProtectedRoute } from "@/services/auth";
import { getErrorMessage } from "@/services/errors";

export default function DecisionPage() {
  useProtectedRoute();
  const params = useParams();
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params?.id) {
      return;
    }
    setLoading(true);
    fetchDecision(params.id)
      .then((response) => setDecision(response.data))
      .catch((error) => {
        setError(getErrorMessage(error, "Unable to load decision dossier."));
        setDecision(null);
      })
      .finally(() => setLoading(false));
  }, [params]);

  return (
    <DashboardShell>
      {loading ? <DecisionSkeleton /> : null}
      {!loading && error ? <div className="panel p-6 text-sm text-red-600">{error}</div> : null}
      {!loading && decision ? (
        <div className="space-y-6">
          <section className="panel p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Decision dossier</p>
            <h1 className="mt-3 text-3xl font-semibold text-ink">{`Request #${decision.request_id}`}</h1>
            <p className="mt-3 text-sm text-slate-500">Selected vendor, agent reasoning, negotiation trail, and RAG evidence.</p>
          </section>
          <section className="grid gap-6 lg:grid-cols-3">
            <div className="panel p-6">
              <p className="text-sm text-slate-500">Selected vendor</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">{decision.selected_vendor?.name}</h2>
              <p className="mt-2 text-sm text-slate-500">{decision.selected_vendor?.summary}</p>
            </div>
            <div className="panel p-6">
              <p className="text-sm text-slate-500">Confidence</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">{Math.round(decision.decision.confidence * 100)}%</h2>
              <p className="mt-2 text-sm text-slate-500">Risk score {decision.decision.risk_score}</p>
            </div>
            <div className="panel p-6">
              <p className="text-sm text-slate-500">Workflow status</p>
              <h2 className="mt-2 text-2xl font-semibold capitalize text-ink">{decision.status}</h2>
              <p className="mt-2 text-sm text-slate-500">{decision.decision.decision}</p>
            </div>
          </section>
          <section className="panel p-6">
            <h2 className="text-xl font-semibold text-ink">Agent reasoning</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{decision.decision.reasoning}</p>
          </section>
          <section className="panel p-6">
            <h2 className="text-xl font-semibold text-ink">Negotiation transcript</h2>
            <div className="mt-4 space-y-3">
              {decision.negotiation_logs.map((log) => (
                <div className="rounded-2xl border border-slate-200 px-4 py-4" key={log.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-ink">
                      {log.vendor_name} - Round {log.round_number}
                    </p>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{log.agent_name}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{log.transcript}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="panel p-6">
            <h2 className="text-xl font-semibold text-ink">RAG evidence</h2>
            <div className="mt-4 space-y-3">
              {decision.decision.metadata_json.retrieved_context.map((item) => (
                <div className="rounded-2xl border border-slate-200 px-4 py-4" key={item.id}>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.source}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </DashboardShell>
  );
}
