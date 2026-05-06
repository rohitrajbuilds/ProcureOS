"use client";

import { useEffect, useState } from "react";

import { fetchDecision } from "@/services/api";

export default function NegotiationTimeline({ requestId }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchDecision(requestId)
      .then((response) => setLogs(response.data.negotiation_logs))
      .catch(() => {});
  }, [requestId]);

  return (
    <div className="space-y-3">
      {logs.map((log) => (
        <div className="rounded-2xl border border-slate-200 px-4 py-4" key={log.id}>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-ink">
              {log.vendor_name} • Round {log.round_number}
            </p>
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{log.agent_name}</span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{log.transcript}</p>
        </div>
      ))}
    </div>
  );
}
