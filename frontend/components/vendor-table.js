export default function VendorTable({ vendors }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200">
      <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr] gap-3 bg-slate-100 px-4 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        <span>Vendor</span>
        <span>Category</span>
        <span>Base Price</span>
        <span>Reliability</span>
        <span>Quality</span>
      </div>
      {vendors.map((vendor) => (
        <div className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.8fr] gap-3 border-t border-slate-200 px-4 py-4 text-sm" key={vendor.id}>
          <div>
            <p className="font-semibold text-ink">{vendor.name}</p>
            <p className="mt-1 text-xs text-slate-500">{vendor.summary}</p>
          </div>
          <span className="text-slate-600">{vendor.category}</span>
          <span className="text-slate-600">${vendor.base_price}</span>
          <span className="text-slate-600">{vendor.reliability_score}</span>
          <span className="text-slate-600">{vendor.quality_score}</span>
        </div>
      ))}
    </div>
  );
}
