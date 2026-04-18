'use client';

import { useState, useEffect } from 'react';
import {
  Clock, MapPin, DollarSign, GraduationCap, Tag,
  Sparkles, AlertTriangle, Ban, ExternalLink, FileText, Info, TrendingUp
} from 'lucide-react';
import { Opportunity, ActiveField, EvidenceField } from '@/lib/types';
import { getTypeBadgeColor, getTypeIcon, formatDeadline } from '@/lib/utils';
import { getScoreColor } from '@/lib/calculateScore';
import ScoreBadge from '@/components/ui/ScoreBadge';
import ConfidenceBadge from '@/components/ui/ConfidenceBadge';
import { cn } from '@/lib/utils';

interface OpportunityCardProps {
  opportunity: Opportunity;
  activeField: ActiveField;
  onFieldClick: (opportunityId: string, field: EvidenceField) => void;
  onPreparePackage: (opportunity: Opportunity) => void;
  onViewDetails: (opportunity: Opportunity) => void;
}

function useCountdown(deadline: string | null | undefined) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    if (!deadline) return;

    function update() {
      const ms = new Date(deadline!).getTime() - Date.now();
      if (ms <= 0) { setTimeLeft('Expired'); setIsUrgent(false); return; }
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      setIsUrgent(h < 72);
      if (h < 24) setTimeLeft(`${h}h ${m}m ${s}s`);
      else setTimeLeft(`${Math.floor(h / 24)}d ${h % 24}h`);
    }

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return { timeLeft, isUrgent };
}

const FIELD_META: Record<EvidenceField, { label: string; icon: React.ElementType }> = {
  deadline: { label: 'Deadline', icon: Clock },
  stipend: { label: 'Stipend', icon: DollarSign },
  min_cgpa: { label: 'Min CGPA', icon: GraduationCap },
  location: { label: 'Location', icon: MapPin },
  keywords: { label: 'Skills', icon: Tag },
};

export default function OpportunityCard({
  opportunity,
  activeField,
  onFieldClick,
  onPreparePackage,
  onViewDetails,
}: OpportunityCardProps) {
  const { timeLeft, isUrgent } = useCountdown(opportunity.deadline);

  if (opportunity.is_spam) {
    const spamSignals = opportunity.spam_signals && opportunity.spam_signals.length > 0
      ? opportunity.spam_signals
      : ['Classified as non-opportunity promotional content'];

    return (
      <div className="glass-panel rounded-2xl p-3.5 border border-red-500/20 bg-red-500/[0.04]">
        <div className="flex items-center gap-2">
          <Ban className="w-4 h-4 text-red-400 shrink-0" />
          <span className="text-xs text-red-200 font-semibold line-clamp-1">{opportunity.title}</span>
          <span className="ml-auto text-[10px] text-red-300 bg-red-500/15 px-2 py-0.5 rounded-full border border-red-500/25">Spam</span>
        </div>

        <div className="mt-3 rounded-xl border border-red-500/15 bg-red-500/10 p-2.5">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-red-200">Why flagged as spam</p>
          <ul className="mt-1.5 space-y-1">
            {spamSignals.slice(0, 3).map((reason, idx) => (
              <li key={`${reason}-${idx}`} className="text-[11px] text-red-100/90 leading-relaxed">• {reason}</li>
            ))}
          </ul>
          {opportunity.source_text && (
            <p className="mt-2 text-[10px] text-red-100/70 line-clamp-2">Evidence: {opportunity.source_text}</p>
          )}
        </div>

        <div className="mt-2 flex justify-end">
          <button
            onClick={() => onViewDetails(opportunity)}
            className="rounded-full border border-red-500/25 bg-red-500/10 px-3 py-1.5 text-[11px] font-semibold text-red-100 hover:bg-red-500/16"
          >
            View details
          </button>
        </div>
      </div>
    );
  }

  const isActive = (field: string) =>
    activeField?.opportunityId === opportunity.id && activeField?.field === field;

  return (
    <div
      className={cn(
        'glass-panel glass-panel-hover rounded-2xl border transition-all duration-300 group overflow-hidden',
        !opportunity.is_eligible
          ? 'border-red-500/10 opacity-80'
          : opportunity.score >= 80
          ? 'border-emerald-500/20 hover:border-emerald-500/35'
          : opportunity.score >= 50
          ? 'border-amber-500/15 hover:border-amber-500/30'
          : 'border-white/5 hover:border-white/10'
      )}
    >
      <div className={cn('h-1 w-full', opportunity.score >= 80 ? 'bg-emerald-400' : opportunity.score >= 50 ? 'bg-amber-400' : 'bg-orange-400')} />
      <div className="p-4">
        {/* Reworked the card layout so the status, score, and evidence cues land before the dense details. */}
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-lg leading-none">{getTypeIcon(opportunity.type)}</span>
              <span className={cn('text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border', getTypeBadgeColor(opportunity.type))}>
                {opportunity.type}
              </span>
              {!opportunity.is_spam && opportunity.score_breakdown?.completeness !== undefined && (
                <ConfidenceBadge completeness={opportunity.score_breakdown.completeness} />
              )}
              {isUrgent && timeLeft && timeLeft !== 'Expired' && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-red-200 bg-red-500/15 border border-red-500/30 px-2 py-0.5 rounded-full animate-pulse">
                  <Clock className="w-2.5 h-2.5" />
                  {timeLeft}
                </span>
              )}
              {!opportunity.is_eligible && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  INELIGIBLE
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-cyan-100 transition-colors">
              {opportunity.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{opportunity.organization}</p>
          </div>
          <div className="shrink-0">
            <ScoreBadge score={opportunity.score} size="md" showLabel />
          </div>
        </div>

        {/* Rank reason / eligibility gap */}
        {opportunity.is_eligible && opportunity.rank_reason && (
          <div className="mt-2.5 flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/8 border border-cyan-500/15">
            <TrendingUp className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-cyan-300/90 leading-relaxed">{opportunity.rank_reason}</p>
          </div>
        )}
        {!opportunity.is_eligible && opportunity.eligibility_gap && (
          <div className="mt-2.5 flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-500/8 border border-red-500/15">
            <Info className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-red-300/90 leading-relaxed">{opportunity.eligibility_gap}</p>
          </div>
        )}

        {/* Field grid */}
        <div className="grid grid-cols-2 gap-1.5 mt-3">
          {Object.entries(FIELD_META).map(([field, meta]) => {
            const Icon = meta.icon;
            let value = '';
            if (field === 'deadline') value = formatDeadline(opportunity.deadline);
            else if (field === 'stipend') value = opportunity.stipend || 'Not specified';
            else if (field === 'min_cgpa') value = opportunity.min_cgpa > 0 ? `${opportunity.min_cgpa}+` : 'Any';
            else if (field === 'location') value = opportunity.location || 'Any';
            else if (field === 'keywords') {
              const keywords = Array.isArray(opportunity.keywords) ? opportunity.keywords : [];
              value = keywords.slice(0, 2).join(', ') || 'General';
            }

            const active = isActive(field);
            return (
              <button
                key={field}
                onClick={() => onFieldClick(opportunity.id, field as EvidenceField)}
                className={cn(
                  'flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-left transition-all duration-200 border',
                  active
                    ? 'bg-amber-500/12 border-amber-300/35 text-amber-100'
                    : 'bg-white/[0.03] border-transparent hover:bg-white/[0.05] hover:border-white/10'
                )}
              >
                <Icon className={cn('w-3 h-3 shrink-0', active ? 'text-amber-300' : 'text-slate-500')} />
                <div className="min-w-0">
                  <p className={cn('text-[9px] uppercase tracking-wider font-semibold', active ? 'text-amber-300' : 'text-slate-500')}>
                    {meta.label}
                  </p>
                  <p className={cn('text-xs font-medium truncate', active ? 'text-amber-50' : 'text-slate-300')}>
                    {value}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Expanded section - moved to detail modal */}

        {/* Action row */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
          {opportunity.is_eligible && opportunity.score >= 50 && (
            <button
              onClick={() => onPreparePackage(opportunity)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[linear-gradient(135deg,#ff8a3d,#f97316)] px-3 py-2 text-xs font-semibold text-white transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-orange-500/15"
            >
              <Sparkles className="w-3 h-3" />
              Prepare My Package
            </button>
          )}

          {opportunity.apply_link && (
            <a
              href={opportunity.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition-all duration-200 hover:bg-emerald-500/18"
            >
              <ExternalLink className="w-3 h-3" />
              Apply
            </a>
          )}

          <button
            onClick={() => onViewDetails(opportunity)}
            className="ml-auto flex items-center gap-1 rounded-full px-3 py-2 text-xs text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}
