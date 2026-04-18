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
  const [sourceMode, setSourceMode] = useState<'api' | 'demo'>('api');

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function generate() {
      try {
        const res = await fetch('/api/generate-kit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ opportunity, profile }),
          signal: controller.signal,
        });
        const data = await res.json().catch(() => null);
        if (!cancelled) {
          if (res.ok && data?.cover_letter) {
            setPkg({ opportunity_id: opportunity.id, ...data });
            setSourceMode('api');
          } else {
            // Keep the product usable when the API is unavailable, but expose that fallback explicitly.
            setPkg(generateMockPackage(opportunity, profile));
            setSourceMode('demo');
          }
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setPkg(generateMockPackage(opportunity, profile));
          setSourceMode('demo');
          setLoading(false);
        }
      }
    }
    generate();
    return () => {
      cancelled = true;
      controller.abort();
    };
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

      <div className="relative w-full max-w-2xl glass-panel rounded-[28px] border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
        {/* The package modal keeps the AI output readable while clearly showing when it falls back to a local draft. */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,138,61,0.10),transparent_30%),radial-gradient(circle_at_top_right,rgba(45,212,191,0.08),transparent_24%)] pointer-events-none" />

        <div className="relative flex items-center justify-between px-6 py-5 border-b border-white/6 bg-white/[0.02]">
          <div>
            <h2 className="text-lg font-semibold text-white">Application package</h2>
            <p className="text-xs text-slate-400 mt-1 truncate max-w-[340px]">{opportunity.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full glass-panel flex items-center justify-center hover:border-orange-300/25 transition-colors"
          >
            <X className="w-4 h-4 text-slate-300" />
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
              <div className={cn('mb-4 rounded-2xl border px-3 py-2 text-xs', sourceMode === 'api' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200' : 'border-amber-500/20 bg-amber-500/10 text-amber-100')}>
                {sourceMode === 'api'
                  ? 'Generated from the live model.'
                  : 'Generated locally because the API was unavailable. The app stays usable, but this draft is a fallback.'}
              </div>

              <div className="flex gap-1 mb-4 border-b border-white/5 pb-3">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all duration-200',
                        activeTab === tab.id
                          ? 'bg-orange-500/12 text-orange-200 border border-orange-300/25'
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
                    className="ml-auto flex items-center gap-1.5 rounded-full px-3 py-2 text-xs text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>

              {activeTab === 'cover_letter' && (
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 max-h-[380px] overflow-y-auto">
                  <pre
                    className="whitespace-pre-wrap text-xs leading-relaxed text-slate-200"
                    style={{ fontFamily: 'var(--font-body), ui-sans-serif, system-ui' }}
                  >
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
                        className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-200"
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
                    <div key={i} className="flex items-start gap-2.5 rounded-2xl border border-white/8 bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.05]">
                      <div className="mt-0.5 h-4 w-4 shrink-0 rounded border border-white/20" />
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
