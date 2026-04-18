export default function SkeletonCard() {
  return (
    <div className="glass-panel rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="shimmer h-4 rounded w-3/4 bg-white/5" />
          <div className="shimmer h-3 rounded w-1/2 bg-white/5" />
        </div>
        <div className="shimmer h-8 w-12 rounded-full bg-white/5 ml-3" />
      </div>
      <div className="flex gap-2">
        <div className="shimmer h-5 rounded-full w-20 bg-white/5" />
        <div className="shimmer h-5 rounded-full w-16 bg-white/5" />
        <div className="shimmer h-5 rounded-full w-24 bg-white/5" />
      </div>
      <div className="space-y-1.5">
        <div className="shimmer h-3 rounded w-full bg-white/5" />
        <div className="shimmer h-3 rounded w-5/6 bg-white/5" />
      </div>
      <div className="flex gap-2 pt-1">
        <div className="shimmer h-7 rounded-lg flex-1 bg-white/5" />
        <div className="shimmer h-7 rounded-lg w-20 bg-white/5" />
      </div>
    </div>
  );
}
