"use client";

import { useEffect, useState } from "react";

import DashboardShell from "@/components/dashboard-shell";
import { VendorTableSkeleton } from "@/components/loading-state";
import VendorTable from "@/components/vendor-table";
import { fetchVendors } from "@/services/api";
import { useProtectedRoute } from "@/services/auth";
import { getErrorMessage } from "@/services/errors";

export default function VendorsPage() {
  useProtectedRoute();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchVendors()
      .then((response) => setVendors(response.data))
      .catch((error) => {
        setError(getErrorMessage(error, "Unable to load vendors."));
        setVendors([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardShell>
      <div className="panel p-6">
        <h1 className="text-3xl font-semibold text-ink">Vendor marketplace</h1>
        <p className="mt-3 text-sm text-slate-500">Mock supplier catalog used by the procurement engine and AI agent workflow.</p>
        <div className="mt-6">
          {loading ? <VendorTableSkeleton /> : error ? <p className="text-sm text-red-600">{error}</p> : <VendorTable vendors={vendors} />}
        </div>
      </div>
    </DashboardShell>
  );
}
