"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { register } from "@/services/api";
import { getErrorMessage } from "@/services/errors";
import { setSession } from "@/services/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await register(form);
      setSession(response.data);
      router.push("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to create account"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="panel w-full max-w-2xl px-8 py-10">
        <h1 className="font-display text-4xl text-ink">Create your ProcureOS workspace access</h1>
        <p className="mt-3 text-sm text-slate-500">Start with a secure account, then launch procurement workflows from the dashboard.</p>
        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <input
            className="input"
            placeholder="Full name"
            value={form.full_name}
            onChange={(event) => setForm({ ...form, full_name: event.target.value })}
          />
          <input
            className="input"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
          <input
            className="input"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button className="button-primary w-full" disabled={loading} type="submit">
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-500">
          Already have access?{" "}
          <Link className="font-semibold text-signal" href="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
