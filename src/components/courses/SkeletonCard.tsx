export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      <div className="w-full h-48 skeleton" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-20 rounded skeleton" />
        <div className="h-4 w-full rounded skeleton" />
        <div className="h-4 w-3/4 rounded skeleton" />
        <div className="h-3 w-full rounded skeleton" />
        <div className="h-3 w-2/3 rounded skeleton" />
        <div className="flex gap-3 mt-1">
          <div className="h-3 w-16 rounded skeleton" />
          <div className="h-3 w-20 rounded skeleton" />
        </div>
        <div className="h-9 w-full rounded-lg skeleton mt-2" />
      </div>
    </div>
  );
}
