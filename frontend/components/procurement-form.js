"use client";

import { useState } from "react";

import { createProcurement } from "@/services/api";

export default function ProcurementForm({ onCreated }) {
  const [form, setForm] = useState({
    title: "",
    category: "Software",
    budget: 12000,
    quantity: 8,
    requirements: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [decisionLink, setDecisionLink] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await createProcurement({
        ...form,
        budget: Number(form.budget),
        quantity: Number(form.quantity)
      });
      setMessage(`Selected ${response.data.selected_vendor?.name} with ${Math.round(response.data.decision.confidence * 100)}% confidence.`);
      setDecisionLink(`/decisions/${response.data.request_id}`);
      setForm({ ...form, title: "", requirements: "" });
      await onCreated();
    } catch (error) {
      setMessage(error.response?.data?.detail || "Unable to create procurement request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel p-6">
      <h2 className="text-xl font-semibold text-ink">Create purchase request</h2>
      <p className="mt-2 text-sm text-slate-500">Launch the full AI procurement flow from a single request.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Request title"
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
        />
        <select
          className="input"
          value={form.category}
          onChange={(event) => setForm({ ...form, category: event.target.value })}
        >
          <option>Software</option>
          <option>Hardware</option>
          <option>Packaging</option>
          <option>Office Supplies</option>
          <option>Healthcare</option>
        </select>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            className="input"
            min="1"
            placeholder="Budget"
            type="number"
            value={form.budget}
            onChange={(event) => setForm({ ...form, budget: event.target.value })}
          />
          <input
            className="input"
            min="1"
            placeholder="Quantity"
            type="number"
            value={form.quantity}
            onChange={(event) => setForm({ ...form, quantity: event.target.value })}
          />
        </div>
        <textarea
          className="input min-h-32"
          placeholder="Requirements, constraints, and desired business outcomes"
          value={form.requirements}
          onChange={(event) => setForm({ ...form, requirements: event.target.value })}
        />
        <button className="button-primary w-full" disabled={loading} type="submit">
          {loading ? "Running agents..." : "Run procurement workflow"}
        </button>
      </form>
      {message ? (
        <div className="mt-4 rounded-2xl border border-signal/20 bg-signal/5 px-4 py-4 text-sm text-slate-700">
          <p>{message}</p>
          {decisionLink ? (
            <a className="mt-2 inline-block font-semibold text-signal" href={decisionLink}>
              Open decision dossier
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
