'use client';

import { useState, useEffect } from 'react';
import { X, FileText, Tag, CheckSquare, Copy, Check } from 'lucide-react';
import { Opportunity, GeneratedPackage } from '@/lib/types';
import { StudentProfile } from '@/lib/types';
import ThinkingAnimation from '@/components/ui/ThinkingAnimation';
import { cn } from '@/lib/utils';

interface PackageModalProps {
  opportunity: Opportunity;
  profile: StudentProfile;
  onClose: () => void;
}

const TABS = [
  { id: 'cover_letter', label: 'Cover Letter', icon: FileText },
  { id: 'resume_keywords', label: 'ATS Keywords', icon: Tag },
  { id: 'document_checklist', label: 'Checklist', icon: CheckSquare },
];

export default function PackageModal({ opportunity, profile, onClose }: PackageModalProps) {
  const [pkg, setPkg] = useState<GeneratedPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cover_letter');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function generate() {
      try {
        const res = await fetch('/api/generate-kit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ opportunity, profile }),
        });
        const data = await res.json();
        if (!cancelled) {
          if (res.ok) {
            setPkg({ opportunity_id: opportunity.id, ...data });
          } else {
            // fallback to mock if API not configured
            setPkg(generateMockPackage(opportunity, profile));
          }
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setPkg(generateMockPackage(opportunity, profile));
          setLoading(false);
        }
      }
    }
    generate();
    return () => { cancelled = true; };
  }, [opportunity, profile]);

  const handleCopy = () => {
    if (!pkg) return;
    navigator.clipboard.writeText(pkg.cover_letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl glass-panel rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <h2 className="text-sm font-bold text-white">Application Package</h2>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[340px]">{opportunity.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg glass-panel flex items-center justify-center hover:border-white/20 transition-colors"
          >
            <X className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        <div className="relative p-6">
          {loading ? (
            <div className="space-y-4 py-8">
              <ThinkingAnimation label="AI Agent preparing your package..." />
              <div className="space-y-3">
                {['Analyzing opportunity requirements...', 'Matching your skills profile...', 'Generating tailored cover letter...', 'Optimizing ATS keywords...'].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    />
                    <span className="text-xs text-slate-400">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : pkg ? (
            <>
              <div className="flex gap-1 mb-4 border-b border-white/5 pb-3">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                        activeTab === tab.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      )}
                    >
                      <Icon className="w-3 h-3" />
                      {tab.label}
                    </button>
                  );
                })}
                {activeTab === 'cover_letter' && (
                  <button
                    onClick={handleCopy}
                    className="ml-auto flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>

              {activeTab === 'cover_letter' && (
                <div className="bg-white/3 rounded-xl p-4 max-h-[380px] overflow-y-auto">
                  <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {pkg.cover_letter}
                  </pre>
                </div>
              )}

              {activeTab === 'resume_keywords' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">
                    Include these keywords in your resume to pass ATS filters:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.resume_keywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/25"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'document_checklist' && (
                <div className="space-y-2">
                  {pkg.document_checklist.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-white/3 transition-colors">
                      <div className="w-4 h-4 rounded border border-white/20 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function generateMockPackage(opportunity: Opportunity, profile: StudentProfile): GeneratedPackage {
  const coverLetter = `${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}

To,
The Selection Committee
${opportunity.organization}

Subject: Application for ${opportunity.title}

Dear Selection Committee,

I am ${profile.name}, a ${profile.degree} student currently in my ${profile.semester}${getSuffix(profile.semester)} semester with a CGPA of ${profile.cgpa.toFixed(1)}/10.0. I am writing to express my strong interest in the ${opportunity.title} offered by ${opportunity.organization}.

My academic background in ${profile.degree} has equipped me with strong foundations in ${profile.skills.slice(0, 3).join(', ')}. Through coursework and personal projects, I have developed hands-on expertise particularly in ${profile.skills.slice(0, 2).join(' and ')}, which aligns closely with the requirements of this opportunity.

${opportunity.requires_financial_need && profile.financial_need
  ? 'As a student from an economically disadvantaged background, this opportunity represents not just academic advancement but a transformative stepping stone in my career.'
  : `The opportunity to work with ${opportunity.organization} in the domain of ${opportunity.keywords.slice(0, 2).join(' and ')} is something I am deeply passionate about.`}

I am particularly drawn to this ${opportunity.type} because of the focus on ${opportunity.keywords.slice(0, 2).join(' and ')}. I am confident that my skills and dedication will allow me to make meaningful contributions while growing significantly under your guidance.

I have attached my resume and other required documents for your consideration. I would be honored to discuss my application further at your convenience.

Thanking you,

Yours sincerely,
${profile.name}
${profile.degree} — Semester ${profile.semester}
CGPA: ${profile.cgpa.toFixed(1)}/10.0
Skills: ${profile.skills.slice(0, 4).join(', ')}`;

  const resumeKeywords = [
    ...opportunity.keywords,
    opportunity.type,
    opportunity.organization,
    'academic excellence',
    'research aptitude',
    profile.degree.split(' ').pop() || 'Computer Science',
    'problem solving',
    'team collaboration',
    'technical proficiency',
  ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 14);

  const documentChecklist = [
    'Updated Resume/CV (2 pages max, PDF format)',
    'Statement of Purpose (500-800 words)',
    'Official Academic Transcripts (all semesters)',
    `Recommendation Letter from Faculty/Professor`,
    'Government-issued ID proof (Aadhaar/Passport)',
    'Current enrollment certificate from institution',
    ...(opportunity.requires_financial_need
      ? ['Family income certificate (issued by competent authority)', 'BPL card or equivalent document (if applicable)']
      : []),
    ...(opportunity.type === 'internship' ? ['No Objection Certificate (NOC) from institution'] : []),
    `Passport-size photograph (recent, color)`,
    'Completed application form (signed and dated)',
  ];

  return {
    opportunity_id: opportunity.id,
    cover_letter: coverLetter,
    resume_keywords: resumeKeywords,
    document_checklist: documentChecklist,
  };
}

function getSuffix(n: number): string {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}
