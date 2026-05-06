"use client";

import { useEffect, useState } from "react";

import { fetchDecision } from "@/services/api";
import { InlineTimelineSkeleton } from "@/components/loading-state";

export default function NegotiationTimeline({ requestId }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchDecision(requestId)
      .then((response) => setLogs(response.data.negotiation_logs))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [requestId]);

  if (loading) {
    return <InlineTimelineSkeleton />;
  }

  if (logs.length === 0) {
    return <p className="text-sm text-slate-500">Negotiation logs will appear here once a workflow completes.</p>;
  }

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div className="rounded-2xl border border-slate-200 px-4 py-4" key={log.id}>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-ink">
              {log.vendor_name} - Round {log.round_number}
            </p>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{log.agent_name}</span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{log.transcript}</p>
        </div>
      ))}
    </div>
  );
}
