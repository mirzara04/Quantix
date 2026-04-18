export default function DashboardGrid({
  left,
  center,
  right
}: {
  left: React.ReactNode;
  center: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-[#000000] text-slate-200">
      {/* Left Column: Profile/Context */}
      <div className="w-64 xl:w-72 shrink-0 border-r border-white/10 p-4 md:p-6 overflow-y-auto">
        {left}
      </div>
      
      {/* Center Column: Ingestion */}
      <div className="flex-1 border-r border-white/10 p-4 md:p-6 overflow-y-auto flex flex-col">
        {center}
      </div>
      
      {/* Right Column: Opportunities / Action */}
      <div className="w-[400px] xl:w-[480px] shrink-0 p-4 md:p-6 bg-[#0a0a0a]/30 overflow-y-auto flex flex-col relative">
        {right}
      </div>
    </div>
  );
}
