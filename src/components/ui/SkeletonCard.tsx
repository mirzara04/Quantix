export default function SkeletonCard() {
  return (
    <div className="glass-panel rounded-2xl p-4 space-y-4 border border-white/10">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="shimmer h-4 rounded-full w-3/4 bg-white/5" />
          <div className="shimmer h-3 rounded-full w-1/2 bg-white/5" />
        </div>
        <div className="shimmer ml-3 h-10 w-14 rounded-full bg-white/5" />
      </div>
      <div className="flex gap-2">
        <div className="shimmer h-6 rounded-full w-20 bg-white/5" />
        <div className="shimmer h-6 rounded-full w-16 bg-white/5" />
        <div className="shimmer h-6 rounded-full w-24 bg-white/5" />
      </div>
      <div className="space-y-1.5">
        <div className="shimmer h-3 rounded-full w-full bg-white/5" />
        <div className="shimmer h-3 rounded-full w-5/6 bg-white/5" />
      </div>
      <div className="flex gap-2 pt-1">
        <div className="shimmer h-8 rounded-full flex-1 bg-white/5" />
        <div className="shimmer h-8 rounded-full w-20 bg-white/5" />
      </div>
    </div>
  );
}
