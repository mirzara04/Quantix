'use client';

import { useState } from 'react';
import {
  Clock, MapPin, DollarSign, GraduationCap, Tag,
  Sparkles, AlertTriangle, Ban, ChevronDown, ChevronUp
} from 'lucide-react';
import { Opportunity, ActiveField } from '@/lib/types';
import { getTypeBadgeColor, getTypeIcon, formatDeadline } from '@/lib/utils';
import { getScoreColor } from '@/lib/calculateScore';
import ScoreBadge from '@/components/ui/ScoreBadge';
import { cn } from '@/lib/utils';

interface OpportunityCardProps {
  opportunity: Opportunity;
  activeField: ActiveField;
  onFieldClick: (opportunityId: string, field: string) => void;
  onPreparePackage: (opportunity: Opportunity) => void;
}

const FIELD_META: Record<string, { label: string; icon: React.ElementType }> = {
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
}: OpportunityCardProps) {
  const [expanded, setExpanded] = useState(false);

  if (opportunity.is_spam) {
    return (
      <div className="glass-panel rounded-xl p-3 border border-red-500/10 opacity-50">
        <div className="flex items-center gap-2">
          <Ban className="w-4 h-4 text-red-400 shrink-0" />
          <span className="text-xs text-red-300 font-medium line-through">{opportunity.title}</span>
          <span className="ml-auto text-[10px] text-red-400/60 bg-red-500/10 px-2 py-0.5 rounded-full">
            Filtered Spam
          </span>
        </div>
      </div>
    );
  }

  const isActive = (field: string) =>
    activeField?.opportunityId === opportunity.id && activeField?.field === field;

  const deadlineMs = opportunity.deadline ? new Date(opportunity.deadline).getTime() - Date.now() : null;
  const isUrgent = deadlineMs !== null && deadlineMs < 72 * 60 * 60 * 1000 && deadlineMs > 0;

  return (
    <div
      className={cn(
        'glass-panel glass-panel-hover rounded-xl border transition-all duration-300 cursor-pointer group',
        !opportunity.is_eligible
          ? 'border-red-500/10 opacity-70'
          : opportunity.score >= 80
          ? 'border-emerald-500/15 hover:border-emerald-500/30'
          : opportunity.score >= 50
          ? 'border-amber-500/15 hover:border-amber-500/30'
          : 'border-white/5 hover:border-white/10'
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-lg leading-none">{getTypeIcon(opportunity.type)}</span>
              <span
                className={cn(
                  'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border',
                  getTypeBadgeColor(opportunity.type)
                )}
              >
                {opportunity.type}
              </span>
              {isUrgent && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-red-300 bg-red-500/15 border border-red-500/25 px-2 py-0.5 rounded-full animate-pulse">
                  <Clock className="w-2.5 h-2.5" />
                  URGENT
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
            <p className="text-xs text-slate-500 mt-0.5">{opportunity.organization}</p>
          </div>

          <div className="shrink-0">
            <ScoreBadge score={opportunity.score} size="md" showLabel />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 mt-3">
          {Object.entries(FIELD_META).map(([field, meta]) => {
            const Icon = meta.icon;
            let value = '';
            if (field === 'deadline') value = formatDeadline(opportunity.deadline);
            else if (field === 'stipend') value = opportunity.stipend || 'Not specified';
            else if (field === 'min_cgpa') value = opportunity.min_cgpa > 0 ? `${opportunity.min_cgpa}+` : 'Any';
            else if (field === 'location') value = opportunity.location || 'Any';
            else if (field === 'keywords') value = opportunity.keywords.slice(0, 2).join(', ') || 'General';

            const active = isActive(field);

            return (
              <button
                key={field}
                onClick={() => onFieldClick(opportunity.id, field)}
                className={cn(
                  'flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-left transition-all duration-200',
                  active
                    ? 'bg-yellow-500/15 border border-yellow-500/40 text-yellow-300'
                    : 'bg-white/3 border border-transparent hover:bg-white/6 hover:border-white/10'
                )}
              >
                <Icon className={cn('w-3 h-3 shrink-0', active ? 'text-yellow-400' : 'text-slate-500')} />
                <div className="min-w-0">
                  <p className={cn('text-[9px] uppercase tracking-wider font-semibold', active ? 'text-yellow-400' : 'text-slate-500')}>
                    {meta.label}
                  </p>
                  <p className={cn('text-xs font-medium truncate', active ? 'text-yellow-200' : 'text-slate-300')}>
                    {value}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {expanded && (
          <div className="mt-3 space-y-3 border-t border-white/5 pt-3">
            <p className="text-xs text-slate-400 leading-relaxed">{opportunity.description}</p>

            {opportunity.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {opportunity.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300/80 border border-cyan-500/15"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}

            {opportunity.score_breakdown && opportunity.score_breakdown.urgency_reason && (
              <div className="glass-panel rounded-lg p-2.5 space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">Score Breakdown</p>
                {[
                  { label: 'Urgency (40%)', value: opportunity.score_breakdown.urgency, reason: opportunity.score_breakdown.urgency_reason },
                  { label: 'Fit (40%)', value: opportunity.score_breakdown.fit, reason: opportunity.score_breakdown.fit_reason },
                  { label: 'Status (20%)', value: opportunity.score_breakdown.status, reason: opportunity.score_breakdown.status_reason },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 w-20 shrink-0">{item.label}</span>
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', getScoreColor(item.value as number).replace('text-', 'bg-').replace('-400', '-500'))}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                    <span className={cn('text-[10px] font-bold w-6 text-right', getScoreColor(item.value as number))}>
                      {item.value}
                    </span>
                    <span className="text-[10px] text-slate-500 flex-1 truncate">{item.reason as string}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
          {opportunity.is_eligible && opportunity.score >= 50 && (
            <button
              onClick={() => onPreparePackage(opportunity)}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600/80 to-cyan-500/80 hover:from-cyan-500 hover:to-cyan-400 rounded-lg px-3 py-1.5 transition-all duration-200 flex-1 justify-center hover:shadow-md hover:shadow-cyan-500/20"
            >
              <Sparkles className="w-3 h-3" />
              Prepare My Package
            </button>
          )}

          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors ml-auto px-2 py-1.5 rounded-lg hover:bg-white/5"
          >
            {expanded ? (
              <>Less <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>Details <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
