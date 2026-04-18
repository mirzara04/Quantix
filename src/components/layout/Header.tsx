'use client';

import { Radar, Zap, User } from 'lucide-react';

interface HeaderProps {
  onDemoMode: () => void;
  onProfileOpen: () => void;
  onExportReport: () => void;
  onOpenGmailSettings: () => void;
  profileName: string;
  isDemoMode: boolean;
}

export default function Header({
  onDemoMode,
  onProfileOpen,
  onExportReport,
  onOpenGmailSettings,
  profileName,
  isDemoMode,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/6 bg-slate-950/60 backdrop-blur-xl">
      {/* Rebuilt the app chrome to feel more like a product header than a template navbar. */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-[linear-gradient(135deg,rgba(255,138,61,0.22),rgba(45,212,191,0.18))] border border-white/10 flex items-center justify-center shadow-lg shadow-orange-500/10">
              <Radar className="w-5 h-5 text-orange-300" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-sm sm:text-[15px] font-semibold tracking-tight text-white">
                Opportunity Radar
              </h1>
              {isDemoMode && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-200">
                  <Zap className="w-2.5 h-2.5" />
                  Demo active
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              AI extraction, evidence highlighting, and application kits in one flow.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={onOpenGmailSettings}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/6 px-3.5 py-2 text-xs font-semibold text-slate-100 border border-white/10 transition-all duration-200 hover:border-cyan-300/30 hover:bg-white/10"
          >
            Connect Gmail
          </button>

          <button
            onClick={onExportReport}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/6 px-3.5 py-2 text-xs font-semibold text-slate-100 border border-white/10 transition-all duration-200 hover:border-emerald-300/30 hover:bg-white/10"
          >
            Export PDF
          </button>

          <button
            onClick={onDemoMode}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/6 px-3.5 py-2 text-xs font-semibold text-slate-100 border border-white/10 transition-all duration-200 hover:border-orange-300/30 hover:bg-white/10"
          >
            <Zap className="w-3.5 h-3.5 text-orange-300" />
            Try demo
          </button>

          <button
            onClick={onProfileOpen}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition-all duration-200 hover:border-emerald-300/25 hover:bg-white/10"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="hidden sm:block max-w-[120px] truncate">{profileName}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
