import { DashboardOverviewSkeleton } from "@/components/loading-state";

export default function Loading() {
  return (
    <main className="min-h-screen px-4 py-6 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <DashboardOverviewSkeleton />
      </div>
    </main>
  );
}
