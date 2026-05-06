import { Skeleton, SkeletonTextBlock } from "@/components/skeleton";

export function DashboardOverviewSkeleton() {
  return (
    <>
      <div className="panel p-6">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-4 h-10 w-3/4" />
        <div className="mt-4 max-w-2xl">
          <SkeletonTextBlock lines={2} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="panel p-5" key={`stat-${index}`}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-10 w-20" />
          </div>
        ))}
      </div>
      <div className="panel p-6">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="mt-3 h-4 w-64" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4" key={`decision-${index}`}>
              <Skeleton className="h-5 w-56" />
              <Skeleton className="mt-3 h-4 w-72" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function VendorTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200">
      <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr] gap-3 bg-slate-100 px-4 py-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton className="h-4 w-20" key={`header-${index}`} />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr] gap-3 border-t border-slate-200 px-4 py-4" key={`row-${index}`}>
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  );
}

export function NegotiationCardsSkeleton({ count = 2 }) {
  return Array.from({ length: count }).map((_, index) => (
    <div className="panel p-6" key={`negotiation-card-${index}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="mt-6 space-y-3">
        {Array.from({ length: 3 }).map((__, innerIndex) => (
          <div className="rounded-2xl border border-slate-200 px-4 py-4" key={`log-${index}-${innerIndex}`}>
            <Skeleton className="h-5 w-48" />
            <Skeleton className="mt-3 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  ));
}

export function DecisionSkeleton() {
  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="mt-4 h-10 w-56" />
        <Skeleton className="mt-4 h-4 w-3/4" />
      </section>
      <section className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="panel p-6" key={`decision-stat-${index}`}>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-4 h-8 w-40" />
            <Skeleton className="mt-4 h-4 w-3/4" />
          </div>
        ))}
      </section>
      <section className="panel p-6">
        <Skeleton className="h-7 w-44" />
        <div className="mt-4">
          <SkeletonTextBlock lines={4} />
        </div>
      </section>
      <section className="panel p-6">
        <Skeleton className="h-7 w-52" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="rounded-2xl border border-slate-200 px-4 py-4" key={`transcript-${index}`}>
              <Skeleton className="h-5 w-48" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-4/5" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function InlineTimelineSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="rounded-2xl border border-slate-200 px-4 py-4" key={`timeline-${index}`}>
          <Skeleton className="h-5 w-44" />
          <Skeleton className="mt-3 h-4 w-full" />
        </div>
      ))}
    </div>
  );
}
