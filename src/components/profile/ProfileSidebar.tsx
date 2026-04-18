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
    <div className="glass-panel rounded-xl border border-white/8 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">{profile.name}</p>
            <p className="text-[10px] text-slate-500">Student Profile</p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Degree</p>
            <p className="text-xs text-slate-200 truncate">{profile.degree}</p>
          </div>
          <span className="text-[10px] text-slate-500 shrink-0">Sem {profile.semester}</span>
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
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <DollarSign className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-[10px] font-semibold text-emerald-400">Need-Based Eligible</span>
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
                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/8"
                >
                  {s}
                </span>
              ))}
              {profile.skills.length > 8 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500">
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
