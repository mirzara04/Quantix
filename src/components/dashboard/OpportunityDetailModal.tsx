'use client';

import { useMemo, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  ExternalLink,
  FileText,
  Sparkles,
  AlertTriangle,
  ListChecks,
  Lightbulb,
  Target,
} from 'lucide-react';
import { Opportunity } from '@/lib/types';
import { formatDeadline, getTypeBadgeColor, getTypeIcon } from '@/lib/utils';
import { getScoreLabel } from '@/lib/calculateScore';
import ScoreBadge from '@/components/ui/ScoreBadge';
import ConfidenceBadge from '@/components/ui/ConfidenceBadge';
import { cn } from '@/lib/utils';

interface OpportunityDetailModalProps {
  opportunity: Opportunity;
  onClose: () => void;
  onPreparePackage: (opportunity: Opportunity) => void;
}

function getChecklistItems(opportunity: Opportunity): string[] {
  if (opportunity.required_documents.length > 0) {
    return opportunity.required_documents;
  }

  const fallback = [
    'Updated resume/CV in PDF format',
    'Official academic transcript',
    'Government-issued ID proof',
    'Completed application form',
  ];

  if (opportunity.requires_financial_need) {
    fallback.push('Income certificate or need-based proof');
  }

  if (opportunity.type === 'internship' || opportunity.type === 'fellowship') {
    fallback.push('Statement of purpose or short motivation note');
  }

  return fallback;
}

export default function OpportunityDetailModal({ opportunity, onClose, onPreparePackage }: OpportunityDetailModalProps) {
  const checklistItems = useMemo(() => getChecklistItems(opportunity), [opportunity]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="opportunity-modal-title"
        className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-[#08101d]/96 shadow-2xl shadow-black/60 max-h-[calc(100vh-2rem)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,138,61,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(45,212,191,0.08),transparent_24%)] pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-transparent" />

        <div className="relative flex items-start justify-between gap-4 border-b border-white/6 px-6 py-5 bg-white/[0.02]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-lg leading-none">{getTypeIcon(opportunity.type)}</span>
              <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider', getTypeBadgeColor(opportunity.type))}>
                {opportunity.type}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-300">
                {getScoreLabel(opportunity.score)}
              </span>
              <ConfidenceBadge completeness={opportunity.score_breakdown.completeness} showLabel />
            </div>
            <h2 id="opportunity-modal-title" className="mt-2 truncate text-xl font-semibold text-white sm:text-2xl">{opportunity.title}</h2>
            <p className="mt-1 text-sm text-slate-400">{opportunity.organization}</p>
          </div>

          <div className="flex items-start gap-2">
            <ScoreBadge score={opportunity.score} size="lg" showLabel />
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-orange-300/25 hover:bg-white/10"
              aria-label="Close opportunity details"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="relative grid gap-5 overflow-y-auto px-6 py-5 lg:grid-cols-[1.4fr_0.95fr]">
          <div className="space-y-4">
            {opportunity.is_spam && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
                <div className="flex items-center gap-2 text-rose-200">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.16em]">Why flagged as spam</span>
                </div>
                <div className="mt-2 space-y-1.5">
                  {(opportunity.spam_signals && opportunity.spam_signals.length > 0
                    ? opportunity.spam_signals
                    : ['Classified as non-opportunity promotional content'])
                    .map((reason) => (
                      <p key={reason} className="text-sm leading-relaxed text-rose-50/90">• {reason}</p>
                    ))}
                </div>
                {opportunity.source_text && (
                  <div className="mt-3 rounded-xl border border-rose-500/15 bg-slate-950/35 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-rose-200/80">Evidence snippet</p>
                    <p className="mt-1 text-xs leading-relaxed text-rose-50/85">{opportunity.source_text}</p>
                  </div>
                )}
              </div>
            )}

            {opportunity.is_eligible && opportunity.rank_reason && (
              <div className="rounded-2xl border border-cyan-500/15 bg-cyan-500/8 p-4">
                <div className="flex items-center gap-2 text-cyan-200">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.16em]">Why this matters</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-cyan-50/90">{opportunity.rank_reason}</p>
              </div>
            )}

            {!opportunity.is_eligible && opportunity.eligibility_gap && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
                <div className="flex items-center gap-2 text-rose-200">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.16em]">Eligibility gap</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-rose-50/90">{opportunity.eligibility_gap}</p>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Deadline</p>
                <p className="mt-1 text-sm font-medium text-slate-100">{formatDeadline(opportunity.deadline)}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Location</p>
                <p className="mt-1 text-sm font-medium text-slate-100">{opportunity.location || 'Any'}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Stipend</p>
                <p className="mt-1 text-sm font-medium text-slate-100">{opportunity.stipend || 'Not specified'}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Min CGPA</p>
                <p className="mt-1 text-sm font-medium text-slate-100">{opportunity.min_cgpa > 0 ? `${opportunity.min_cgpa}+` : 'Any'}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-orange-300" />
                <h3 className="text-sm font-semibold text-white">Evidence markers</h3>
              </div>
              <div className="mt-3 space-y-2">
                {opportunity.evidence_markers.length > 0 ? (
                  opportunity.evidence_markers.map((marker) => (
                    <div key={`${marker.field}-${marker.text}`} className="rounded-xl border border-white/6 bg-slate-950/40 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{marker.field}</span>
                        <span className="text-[10px] text-slate-500">{marker.start} - {marker.end}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-200">{marker.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No explicit evidence markers were captured for this opportunity.</p>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-emerald-300" />
                <h3 className="text-sm font-semibold text-white">Action checklist</h3>
              </div>
              <div className="mt-3 space-y-2">
                {checklistItems.map((item, index) => (
                  <div key={item} className="flex items-start gap-2 rounded-xl border border-white/6 bg-slate-950/35 p-3">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-[10px] font-semibold text-emerald-200">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-relaxed text-slate-200">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {opportunity.required_documents.length > 0 && (
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-cyan-300" />
                  <h3 className="text-sm font-semibold text-white">Required documents</h3>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {opportunity.required_documents.map((doc) => (
                    <span key={doc} className="rounded-full border border-cyan-500/15 bg-cyan-500/8 px-3 py-1 text-[11px] text-cyan-100">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-300" />
                <h3 className="text-sm font-semibold text-white">Next actions</h3>
              </div>
              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={() => onPreparePackage(opportunity)}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#ff8a3d,#f97316)] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Prepare package
                </button>

                {opportunity.apply_link ? (
                  <a
                    href={opportunity.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-100 transition-colors hover:bg-emerald-500/18"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open application link
                  </a>
                ) : (
                  <div className="rounded-2xl border border-white/8 bg-slate-950/35 p-3 text-xs leading-relaxed text-slate-400">
                    No direct application link was extracted. Use the package generator to prepare the next step.
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}