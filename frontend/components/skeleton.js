export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/80 ${className}`.trim()} />;
}

export function SkeletonTextBlock({ lines = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          className={index === lines - 1 ? "h-4 w-2/3" : "h-4 w-full"}
          key={`line-${index}`}
        />
      ))}
    </div>
  );
}
