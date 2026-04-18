import { useState, useRef } from 'react';
import { StudentProfile } from '@/lib/types';
import { User, Check, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface Props {
  profile: StudentProfile;
  onSave: (p: StudentProfile) => void;
  onClose: () => void;
}

export default function ProfileModal({ profile: initialProfile, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<StudentProfile>(initialProfile);
  const [isSaved, setIsSaved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    gsap.fromTo(contentRef.current, 
      { x: '100%' }, 
      { x: '0%', duration: 0.4, ease: "power3.out" }
    );
  }, []);

  const handleClose = () => {
    gsap.to(contentRef.current, { x: '100%', duration: 0.3, ease: "power3.in" });
    gsap.to(containerRef.current, { opacity: 0, duration: 0.3, onComplete: onClose });
  };

  const handleSave = () => {
    setIsSaved(true);
    onSave(draft);
    setTimeout(() => {
      handleClose();
    }, 800);
  };

  const handleSkillsChange = (val: string) => {
    const skills = val.split(',').map(s => s.trim()).filter(s => s !== '');
    setDraft({ ...draft, skills });
  };

  const toggleType = (type: string) => {
    const types = draft.preferred_types || [];
    if (types.includes(type)) {
      setDraft({ ...draft, preferred_types: types.filter(t => t !== type) });
    } else {
      setDraft({ ...draft, preferred_types: [...types, type] });
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0 cursor-pointer" onClick={handleClose} />
      
      <div 
        ref={contentRef}
        className="relative w-full max-w-md h-full bg-[#0a0a0a] border-l border-white/10 flex flex-col shadow-2xl overflow-hidden translate-x-full"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-white">Profile Context</h2>
              <p className="text-xs text-white/50">Configure your pipeline vectors</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
          
          {/* Academic */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-widest">Academic Vector</h3>
            <div className="flex flex-col gap-3">
              <label className="text-xs text-white/70">Degree / Program</label>
              <input 
                type="text" 
                value={draft.degree} 
                onChange={(e) => setDraft({...draft, degree: e.target.value})}
                className="w-full bg-[#000000] border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              />
              
              <div className="flex gap-4">
                <div className="flex-1 flex flex-col gap-3">
                  <label className="text-xs text-white/70">Semester</label>
                  <select 
                    value={draft.semester}
                    onChange={(e) => setDraft({...draft, semester: Number(e.target.value)})}
                    className="w-full bg-[#000000] border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(s => <option key={s} value={s}>Sem {s}</option>)}
                  </select>
                </div>
                <div className="flex-1 flex flex-col gap-3">
                  <label className="text-xs text-white/70">CGPA</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={draft.cgpa}
                    onChange={(e) => setDraft({...draft, cgpa: Number(e.target.value)})}
                    className="w-full bg-[#000000] border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Context */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-widest">Environment Context</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <label className="text-xs text-white/70">Location Preference</label>
                <select 
                  value={draft.location_preference}
                  onChange={(e) => setDraft({...draft, location_preference: e.target.value})}
                  className="w-full bg-[#000000] border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Remote">Remote</option>
                  <option value="Remote / Hybrid">Remote / Hybrid</option>
                  <option value="On-site">On-site</option>
                  <option value="Any">Any</option>
                </select>
              </div>

              <div className="flex items-center justify-between bg-[#000000] border border-white/10 p-3 rounded-md cursor-pointer hover:border-white/20 transition-colors" onClick={() => setDraft({...draft, financial_need: !draft.financial_need})}>
                <div className="flex flex-col">
                  <span className="text-sm text-white">Financial Need Status</span>
                  <span className="text-[10px] text-white/40">Boosts matching for need-based programs</span>
                </div>
                <div className={`w-8 h-4 rounded-full flex items-center transition-colors px-0.5 ${draft.financial_need ? 'bg-blue-600' : 'bg-white/20'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${draft.financial_need ? 'translate-x-4' : 'translate-x-0'}`} />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Professional */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-widest">Professional Identity</h3>
            
            <div className="flex flex-col gap-3">
              <label className="text-xs text-white/70">Skills (comma separated)</label>
              <textarea 
                value={draft.skills.join(', ')}
                onChange={(e) => handleSkillsChange(e.target.value)}
                className="w-full bg-[#000000] border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none min-h-[60px] resize-none"
                placeholder="React, Python, Machine Learning..."
              />
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-xs text-white/70">Past Experience</label>
              <textarea 
                value={draft.past_experience || ''}
                onChange={(e) => setDraft({...draft, past_experience: e.target.value})}
                className="w-full bg-[#000000] border border-white/10 rounded-md p-2.5 text-sm text-white focus:border-blue-500 focus:outline-none min-h-[80px] resize-none"
                placeholder="Describe your previous internships or roles..."
              />
            </div>
          </div>

          <div className="h-px bg-white/5" />

          {/* Preferences */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-widest">Target Categories</h3>
            <div className="flex flex-wrap gap-2">
              {['internship', 'scholarship', 'fellowship', 'competition', 'grant'].map(type => {
                const isActive = (draft.preferred_types || []).includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`px-3 py-1.5 text-xs rounded-md border capitalize transition-colors ${
                      isActive ? 'bg-blue-600/20 text-blue-500 border-blue-600/40' : 'bg-white/5 text-white/50 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-[#060606] flex gap-3">
          <button 
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-md text-sm font-medium text-white/60 bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
          >
            Discard
          </button>
          <button 
            onClick={handleSave}
            className={`flex-[2] py-2.5 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
              isSaved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSaved ? <><Check className="w-4 h-4" /> Saved Successfully</> : 'Commit Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}
