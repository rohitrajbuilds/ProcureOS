"use client";

import { useEffect, useState } from "react";

import DashboardShell from "@/components/dashboard-shell";
import VendorTable from "@/components/vendor-table";
import { fetchVendors } from "@/services/api";
import { useProtectedRoute } from "@/services/auth";

export default function VendorsPage() {
  useProtectedRoute();
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    fetchVendors()
      .then((response) => setVendors(response.data))
      .catch(() => {});
  }, []);

  return (
    <DashboardShell>
      <div className="panel p-6">
        <h1 className="text-3xl font-semibold text-ink">Vendor marketplace</h1>
        <p className="mt-3 text-sm text-slate-500">Mock supplier catalog used by the procurement engine and AI agent workflow.</p>
        <div className="mt-6">
          <VendorTable vendors={vendors} />
        </div>
      </div>
    </DashboardShell>
  );
}
