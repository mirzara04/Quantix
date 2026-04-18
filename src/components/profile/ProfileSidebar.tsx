import { User, BookOpen, GraduationCap, MapPin } from 'lucide-react';
import { StudentProfile } from '@/lib/types';

export default function ProfileSidebar({ profile, onEdit }: { profile: StudentProfile, onEdit?: () => void }) {
  return (
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
          <div>
            <h3 className="text-sm font-medium text-white">{profile.name}</h3>
            <p className="text-xs text-white/50">Semester {profile.semester}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between items-center text-white/70">
            <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Degree</span>
            <span className="text-white truncate max-w-[120px]" title={profile.degree}>{profile.degree}</span>
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
      </div>
    </div>
  );
}
