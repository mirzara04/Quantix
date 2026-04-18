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
<<<<<<< HEAD
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-xl glass-panel rounded-[28px] border border-white/12 shadow-2xl shadow-black/50 overflow-hidden">
        {/* The modal uses a clearer stepper and stronger hierarchy so profile edits feel deliberate. */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,138,61,0.10),transparent_34%),radial-gradient(circle_at_top_right,rgba(45,212,191,0.08),transparent_26%)] pointer-events-none" />

        <div className="relative flex items-center justify-between px-6 py-5 border-b border-white/6 bg-white/[0.02]">
          <div>
            <h2 className="text-lg font-semibold text-white">Student profile</h2>
            <p className="text-xs text-slate-400 mt-1">Tune the scoring model with the details that matter.</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full glass-panel flex items-center justify-center hover:border-orange-300/25 transition-colors"
          >
            <X className="w-4 h-4 text-slate-300" />
          </button>
        </div>

        <div className="relative flex items-center gap-2 px-6 py-4 border-b border-white/6 overflow-x-auto">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isActive = step === idx;
            const isDone = step > idx;
            return (
              <button
                key={s.id}
                onClick={() => setStep(idx)}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-all duration-200 whitespace-nowrap',
                  isActive
                    ? 'bg-orange-500/12 text-orange-200 border-orange-300/25'
                    : isDone
                    ? 'text-emerald-300 border-emerald-300/15 bg-emerald-400/6 hover:bg-emerald-400/10'
                    : 'text-slate-400 border-white/8 bg-white/[0.03] hover:text-slate-200 hover:border-white/16'
                )}
              >
                {isDone ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
                <span className="hidden sm:block">{s.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative px-6 py-6 min-h-[340px]">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-300/40 focus:bg-white/8 transition-colors"
                  placeholder="e.g. Aryan Sharma"
                />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Degree Program</label>
                <select
                  value={form.degree}
                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-300/40 transition-colors"
                >
                  {DEGREE_OPTIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Semester <span className="text-cyan-400 font-bold">{form.semester}</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={12}
                  value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}
                  className="w-full accent-cyan-500 h-1.5 rounded"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>1st</span>
                  <span>6th</span>
                  <span>12th</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  CGPA <span className="text-cyan-400 font-bold">{form.cgpa.toFixed(1)}</span>
                  <span className="text-slate-500"> / 10.0</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.1}
                  value={form.cgpa}
                  onChange={(e) => setForm({ ...form, cgpa: Number(e.target.value) })}
                  className="w-full accent-cyan-500 h-1.5 rounded"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>0.0</span>
                  <span>5.0</span>
                  <span>10.0</span>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
=======
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
>>>>>>> origin/talha
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

<<<<<<< HEAD
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Location Preference</label>
                <select
                  value={form.location_preference}
                  onChange={(e) => setForm({ ...form, location_preference: e.target.value })}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-300/40 transition-colors"
=======
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
>>>>>>> origin/talha
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
<<<<<<< HEAD
                <button
                  onClick={() => setForm({ ...form, financial_need: !form.financial_need })}
                  className={cn(
                    'relative w-12 h-6 rounded-full transition-all duration-300',
                    form.financial_need ? 'bg-orange-400' : 'bg-white/10'
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300',
                      form.financial_need ? 'left-[22px]' : 'left-0.5'
                    )}
                  />
                </button>
=======
>>>>>>> origin/talha
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

<<<<<<< HEAD
        <div className="relative flex items-center justify-between px-6 py-4 border-t border-white/6 bg-white/[0.02]">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-2 rounded-full hover:bg-white/5"
=======
        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-[#060606] flex gap-3">
          <button 
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-md text-sm font-medium text-white/60 bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
>>>>>>> origin/talha
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
<<<<<<< HEAD

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="flex items-center gap-1.5 rounded-full bg-white text-slate-950 px-4 py-2 text-xs font-semibold transition-colors hover:bg-orange-200"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#ff8a3d,#f97316)] px-4 py-2 text-xs font-semibold text-white transition-all duration-200 shadow-lg shadow-orange-500/20 hover:brightness-110"
            >
              <Check className="w-3.5 h-3.5" />
              Save Profile
            </button>
          )}
=======
>>>>>>> origin/talha
        </div>
      </div>
    </div>
  );
}
