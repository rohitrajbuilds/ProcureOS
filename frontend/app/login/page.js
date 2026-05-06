"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { login } from "@/services/api";
import { setSession } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await login(form);
      setSession(response.data);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="panel grid w-full max-w-5xl overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-ink px-8 py-10 text-white lg:px-12">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">ProcureOS</p>
          <h1 className="mt-6 font-display text-4xl leading-tight">Enterprise procurement, orchestrated by AI agents.</h1>
          <p className="mt-6 max-w-lg text-sm text-white/75">
            Run vendor discovery, negotiation, risk analysis, and selection in one auditable workflow.
          </p>
        </div>
        <div className="px-8 py-10 lg:px-12">
          <h2 className="text-2xl font-semibold text-ink">Sign in</h2>
          <p className="mt-2 text-sm text-slate-500">Use your workspace credentials to access the procurement dashboard.</p>
          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
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
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
          <p className="mt-6 text-sm text-slate-500">
            New here?{" "}
            <Link className="font-semibold text-signal" href="/register">
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
