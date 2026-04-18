'use client';

import { Radar, Zap, User } from 'lucide-react';

interface HeaderProps {
  onDemoMode: () => void;
  onProfileOpen: () => void;
  profileName: string;
  isDemoMode: boolean;
}

export default function Header({ onDemoMode, onProfileOpen, profileName, isDemoMode }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
              <Radar className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-gradient-brand leading-none">
              Opportunity Radar
            </h1>
            <p className="text-[10px] text-slate-500 leading-none mt-0.5">AI-Powered Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isDemoMode && (
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
              <Zap className="w-3 h-3" />
              Demo Mode Active
            </span>
          )}

          <button
            onClick={onDemoMode}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 rounded-lg px-3 py-1.5 transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            <Zap className="w-3 h-3" />
            Try Demo
          </button>

          <button
            onClick={onProfileOpen}
            className="flex items-center gap-2 glass-panel glass-panel-hover rounded-lg px-3 py-1.5 transition-all duration-200 border border-white/5 hover:border-cyan-500/30"
          >
            <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <User className="w-3 h-3 text-cyan-400" />
            </div>
            <span className="text-xs font-medium text-slate-300 hidden sm:block max-w-[120px] truncate">
              {profileName}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
