'use client';

import { User, GraduationCap, Code2, MapPin, DollarSign, Edit3 } from 'lucide-react';
import { StudentProfile } from '@/lib/types';

interface ProfileSidebarProps {
  profile: StudentProfile;
  onEdit: () => void;
}

export default function ProfileSidebar({ profile, onEdit }: ProfileSidebarProps) {
  const cgpaPercent = (profile.cgpa / 10) * 100;
  const cgpaColor =
    profile.cgpa >= 8 ? 'bg-emerald-500' : profile.cgpa >= 6.5 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-xl shadow-black/25">
      {/* The sidebar now reads like a profile summary card instead of a utility panel. */}
      <div className="px-4 py-4 border-b border-white/6 flex items-start justify-between gap-3 bg-white/[0.02]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-[linear-gradient(135deg,rgba(255,138,61,0.18),rgba(45,212,191,0.18))] border border-white/10 flex items-center justify-center">
            <User className="w-4 h-4 text-orange-200" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{profile.name}</p>
            <p className="text-[11px] text-slate-400">Student profile</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          aria-label="Edit profile"
          className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 transition-colors hover:border-orange-300/25 hover:text-orange-200"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Degree</p>
            <p className="text-xs text-slate-200 truncate">{profile.degree}</p>
          </div>
          <span className="text-[10px] text-slate-500 shrink-0">Sem {profile.semester}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">CGPA</p>
            <p className="mt-1 text-lg font-semibold text-white">{profile.cgpa.toFixed(1)}</p>
          </div>
          <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Skills</p>
            <p className="mt-1 text-lg font-semibold text-white">{profile.skills.length}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3 h-3 text-slate-500" />
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">CGPA</span>
            </div>
            <span className="text-xs font-bold text-white">{profile.cgpa.toFixed(1)}/10.0</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${cgpaColor}`}
              style={{ width: `${cgpaPercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Location</p>
            <p className="text-xs text-slate-200">{profile.location_preference}</p>
          </div>
        </div>

        {profile.financial_need && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <DollarSign className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-wider">Need-based eligible</span>
          </div>
        )}

        {profile.skills.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Code2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Skills</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {profile.skills.slice(0, 8).map((s) => (
                <span
                  key={s}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.04] text-slate-300 border border-white/8"
                >
                  {s}
                </span>
              ))}
              {profile.skills.length > 8 && (
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.04] text-slate-500">
                  +{profile.skills.length - 8}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
