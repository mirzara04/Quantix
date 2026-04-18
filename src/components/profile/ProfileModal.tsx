'use client';

import { useState } from 'react';
import { X, ChevronRight, ChevronLeft, User, GraduationCap, Code2, MapPin, Check } from 'lucide-react';
import { StudentProfile } from '@/lib/types';
import { cn } from '@/lib/utils';

const SKILL_OPTIONS = [
  'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'React', 'Node.js',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Data Analysis',
  'SQL', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
  'Research Methodology', 'Statistics', 'Blockchain', 'Computer Vision', 'NLP',
  'Android Development', 'iOS Development', 'Flutter', 'DSA', 'Problem Solving',
];

const DEGREE_OPTIONS = [
  'B.Tech Computer Science', 'B.Tech IT', 'B.Tech ECE', 'B.Tech EEE',
  'B.Tech Mechanical', 'B.Tech Civil', 'B.Sc Computer Science',
  'B.Sc Mathematics', 'M.Tech Computer Science', 'M.Tech IT',
  'M.Sc Data Science', 'M.Sc AI/ML', 'MBA', 'BCA', 'MCA', 'PhD',
];

const LOCATION_OPTIONS = [
  'Remote', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai',
  'Pune', 'Kolkata', 'Ahmedabad', 'Remote / Bangalore', 'Remote / Mumbai',
  'Pan India', 'Any',
];

const STEPS = [
  { id: 0, label: 'Personal', icon: User },
  { id: 1, label: 'Academic', icon: GraduationCap },
  { id: 2, label: 'Skills', icon: Code2 },
  { id: 3, label: 'Preferences', icon: MapPin },
];

interface ProfileModalProps {
  profile: StudentProfile;
  onSave: (profile: StudentProfile) => void;
  onClose: () => void;
}

export default function ProfileModal({ profile, onSave, onClose }: ProfileModalProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<StudentProfile>({ ...profile });

  const handleSkillToggle = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-pink-500/5 pointer-events-none" />

        <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h2 className="text-base font-bold text-white">Student Profile</h2>
            <p className="text-xs text-slate-400 mt-0.5">Configure your profile for accurate scoring</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg glass-panel flex items-center justify-center hover:border-white/20 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        <div className="relative flex items-center gap-1 px-6 py-3 border-b border-white/5">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            const isActive = step === idx;
            const isDone = step > idx;
            return (
              <button
                key={s.id}
                onClick={() => setStep(idx)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : isDone
                    ? 'text-emerald-400 hover:bg-emerald-500/10'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
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

        <div className="relative px-6 py-5 min-h-[320px]">
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/8 transition-colors"
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
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
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
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">
                Skills & Technologies
                <span className="ml-2 text-cyan-400">{form.skills.length} selected</span>
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-[260px] overflow-y-auto pr-1">
                {SKILL_OPTIONS.map((skill) => {
                  const selected = form.skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => handleSkillToggle(skill)}
                      className={cn(
                        'px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-150',
                        selected
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-white/3 text-slate-400 border-white/8 hover:border-white/20 hover:text-slate-300'
                      )}
                    >
                      {selected && <span className="mr-1">✓</span>}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Location Preference</label>
                <select
                  value={form.location_preference}
                  onChange={(e) => setForm({ ...form, location_preference: e.target.value })}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                >
                  {LOCATION_OPTIONS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between p-3 glass-panel rounded-xl border border-white/5">
                <div>
                  <p className="text-sm font-medium text-white">Financial Need</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Enables need-based scholarship matching
                  </p>
                </div>
                <button
                  onClick={() => setForm({ ...form, financial_need: !form.financial_need })}
                  className={cn(
                    'relative w-10 h-5.5 rounded-full transition-all duration-300',
                    form.financial_need ? 'bg-cyan-500' : 'bg-white/10'
                  )}
                  style={{ height: '22px' }}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300',
                      form.financial_need ? 'left-[22px]' : 'left-0.5'
                    )}
                  />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative flex items-center justify-between px-6 py-4 border-t border-white/5">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg px-4 py-1.5 transition-colors"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 rounded-lg px-4 py-1.5 transition-all duration-200 shadow-lg shadow-cyan-500/20"
            >
              <Check className="w-3.5 h-3.5" />
              Save Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
