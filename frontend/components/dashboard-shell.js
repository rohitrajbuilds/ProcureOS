"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { clearSession, getUser } from "@/services/auth";
import { Skeleton } from "@/components/skeleton";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/vendors", label: "Vendors" },
  { href: "/negotiations", label: "Negotiations" }
];

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const logout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <div className="min-h-screen px-4 py-6 lg:px-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="panel p-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-400">ProcureOS</p>
          <h2 className="mt-3 font-display text-3xl text-ink">Command center</h2>
          <div className="mt-4">
            {user ? <p className="text-sm text-slate-500">{user.full_name}</p> : <Skeleton className="h-4 w-32" />}
          </div>
          <nav className="mt-8 space-y-2">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  className={`block rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    active ? "bg-ink text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <button className="button-secondary mt-8 w-full" onClick={logout} type="button">
            Logout
          </button>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
