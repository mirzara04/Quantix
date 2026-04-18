import { User, BookOpen, GraduationCap, MapPin } from 'lucide-react';
import { StudentProfile } from '@/lib/types';

export default function ProfileSidebar({ profile, onEdit }: { profile: StudentProfile, onEdit?: () => void }) {
  return (
<<<<<<< HEAD
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
=======
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Context Vector</h2>
        {onEdit && <button onClick={onEdit} className="text-xs text-blue-500 hover:text-blue-400">Configure</button>}
      </div>

      <div className="bento-card p-5 mt-2 flex flex-col gap-4">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-blue-500">
            <User className="w-5 h-5" />
          </div>
>>>>>>> origin/talha
          <div>
            <h3 className="text-sm font-medium text-white">{profile.name}</h3>
            <p className="text-xs text-white/50">Semester {profile.semester}</p>
          </div>
        </div>

<<<<<<< HEAD
        {profile.financial_need && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <DollarSign className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="text-[10px] font-semibold text-emerald-300 uppercase tracking-wider">Need-based eligible</span>
=======
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between items-center text-white/70">
            <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Degree</span>
            <span className="text-white truncate max-w-[120px]" title={profile.degree}>{profile.degree}</span>
>>>>>>> origin/talha
          </div>
          <div className="flex justify-between items-center text-white/70">
            <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Score</span>
            <span className="text-white">{profile.cgpa.toFixed(1)}/10.0</span>
          </div>
          <div className="flex justify-between items-center text-white/70">
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</span>
            <span className="text-white truncate max-w-[120px]">{profile.location_preference}</span>
          </div>
        </div>
      </div>

<<<<<<< HEAD
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
=======
      <div className="bento-card p-5 flex flex-col gap-3">
        <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-1">Skill Profile</h3>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill, i) => (
            <span key={i} className="px-2 py-1 bg-[#000000] text-white/80 text-[11px] uppercase tracking-wider rounded border border-white/10">
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <div className="bento-card p-5 flex flex-col gap-3">
        <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider mb-1">Financial State</h3>
        <div className="flex items-center justify-between">
           <span className="text-sm text-white/70 shrink-0">Priority Need</span>
           <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded border ${profile.financial_need ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-white/5 text-white/50 border-white/10'}`}>
             {profile.financial_need ? 'ACTIVE' : 'INACTIVE'}
           </span>
        </div>
>>>>>>> origin/talha
      </div>
    </div>
  );
}
