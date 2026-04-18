'use client';

import { useMemo, useState } from 'react';
import { Target, SortDesc, AlertTriangle, Ban, SlidersHorizontal, CalendarDays } from 'lucide-react';
import { Opportunity, ActiveField, StudentProfile, EvidenceField, DeadlineBucket } from '@/lib/types';
import { ScoringWeights } from '@/lib/calculateScore';
import OpportunityCard from './OpportunityCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { cn } from '@/lib/utils';

interface OpportunitiesPaneProps {
  opportunities: Opportunity[];
  isExtracting: boolean;
  activeField: ActiveField;
  profile: StudentProfile;
  weights: ScoringWeights;
  onWeightsChange: (weights: ScoringWeights) => void;
  onFieldClick: (opportunityId: string, field: EvidenceField) => void;
  onPreparePackage: (opportunity: Opportunity) => void;
  onViewDetails: (opportunity: Opportunity) => void;
}

type SortOption = 'score' | 'deadline' | 'type';
type FilterOption = 'all' | 'scholarship' | 'internship' | 'fellowship' | 'competition';

const DEADLINE_BUCKETS: DeadlineBucket[] = ['all', 'overdue', '0-3d', '4-7d', '8-14d', '15d+'];

function getDeadlineBucket(deadline?: string | null): DeadlineBucket {
  if (!deadline) return '15d+';
  const diffMs = new Date(deadline).getTime() - Date.now();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 0) return 'overdue';
  if (diffDays <= 3) return '0-3d';
  if (diffDays <= 7) return '4-7d';
  if (diffDays <= 14) return '8-14d';
  return '15d+';
}

function bucketLabel(bucket: DeadlineBucket): string {
  switch (bucket) {
    case 'all': return 'All';
    case 'overdue': return 'Overdue';
    case '0-3d': return '0-3d';
    case '4-7d': return '4-7d';
    case '8-14d': return '8-14d';
    case '15d+': return '15d+';
    default: return bucket;
  }
}

export default function OpportunitiesPane({
  opportunities,
  isExtracting,
  activeField,
  profile,
  weights,
  onWeightsChange,
  onFieldClick,
  onPreparePackage,
  onViewDetails,
}: OpportunitiesPaneProps) {
  const [sortBy, setSortBy] = useState<SortOption>('score');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [deadlineFilter, setDeadlineFilter] = useState<DeadlineBucket>('all');

  const eligible = useMemo(
    () =>
      opportunities
        .filter((o) => !o.is_spam && o.is_eligible)
        .filter((o) => filterBy === 'all' || o.type === filterBy)
        .filter((o) => deadlineFilter === 'all' || getDeadlineBucket(o.deadline) === deadlineFilter)
        .sort((a, b) => {
          if (sortBy === 'score') return b.score - a.score;
          if (sortBy === 'deadline') {
            const aParsed = a.deadline ? Date.parse(a.deadline) : NaN;
            const bParsed = b.deadline ? Date.parse(b.deadline) : NaN;
            const aD = Number.isFinite(aParsed) ? aParsed : Infinity;
            const bD = Number.isFinite(bParsed) ? bParsed : Infinity;
            return aD - bD;
          }
          return a.type.localeCompare(b.type);
        }),
    [opportunities, sortBy, filterBy, deadlineFilter]
  );

  const ineligible = useMemo(
    () => opportunities.filter((o) => !o.is_spam && !o.is_eligible),
    [opportunities]
  );

  const spam = useMemo(() => opportunities.filter((o) => o.is_spam), [opportunities]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: 0 };
    opportunities.filter((o) => !o.is_spam && o.is_eligible).forEach((o) => {
      c.all = (c.all || 0) + 1;
      c[o.type] = (c[o.type] || 0) + 1;
    });
    return c;
  }, [opportunities]);

  const deadlineCounts = useMemo(() => {
    const c: Record<DeadlineBucket, number> = {
      all: 0,
      overdue: 0,
      '0-3d': 0,
      '4-7d': 0,
      '8-14d': 0,
      '15d+': 0,
    };

    opportunities.filter((o) => !o.is_spam && o.is_eligible).forEach((o) => {
      c.all += 1;
      c[getDeadlineBucket(o.deadline)] += 1;
    });

    return c;
  }, [opportunities]);

  const handleWeightInput = (key: keyof ScoringWeights, value: number) => {
    const next = { ...weights, [key]: Math.max(0, value / 100) };
    onWeightsChange(next);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 glass-panel shadow-xl shadow-black/20">
      <div className="shrink-0 space-y-3 border-b border-white/6 bg-white/[0.02] px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-orange-300" />
            <span className="text-sm font-semibold text-white">Opportunities</span>
            {opportunities.length > 0 && (
              <span className="rounded-full border border-orange-300/20 bg-orange-300/10 px-2 py-0.5 text-xs font-semibold text-orange-200">
                {eligible.length} eligible
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <SortDesc className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 focus:border-orange-300/30 focus:outline-none"
            >
              <option value="score">Sort: Score</option>
              <option value="deadline">Sort: Deadline</option>
              <option value="type">Sort: Type</option>
            </select>
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2 text-[11px] text-slate-400 flex items-center justify-between gap-2">
          <span>{profile.degree}</span>
          <span>CGPA {profile.cgpa.toFixed(1)} · {profile.skills.length} skills tuned</span>
        </div>

        <div className="space-y-2 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-cyan-300" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">Re-rank sliders</p>
          </div>
          {(['urgency', 'fit', 'status', 'completeness'] as Array<keyof ScoringWeights>).map((key) => (
            <label key={key} className="block">
              <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400">
                <span>{key}</span>
                <span>{Math.round(weights[key] * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(weights[key] * 100)}
                onChange={(e) => handleWeightInput(key, Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </label>
          ))}
          <p className="text-[10px] text-slate-500">Weights auto-normalize to 100% and rerank instantly.</p>
        </div>

        <div className="space-y-2 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-amber-300" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">Deadline heatmap</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DEADLINE_BUCKETS.map((bucket) => (
              <button
                key={bucket}
                onClick={() => setDeadlineFilter(bucket)}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors',
                  deadlineFilter === bucket
                    ? 'border-amber-300/30 bg-amber-300/12 text-amber-200'
                    : 'border-white/8 bg-white/[0.02] text-slate-400 hover:text-slate-200'
                )}
              >
                {bucketLabel(bucket)} · {deadlineCounts[bucket]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-0.5">
          {(['all', 'scholarship', 'internship', 'fellowship', 'competition'] as FilterOption[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilterBy(f)}
              className={cn(
                'whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1',
                filterBy === f
                  ? 'border border-orange-300/25 bg-orange-300/10 text-orange-200'
                  : 'border border-white/6 bg-white/[0.03] text-slate-500 hover:border-white/15 hover:text-slate-300'
              )}
            >
              {f}
              {counts[f] !== undefined && (
                <span className={cn('rounded-full px-1', filterBy === f ? 'bg-orange-300/20' : 'bg-white/10')}>
                  {counts[f]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {isExtracting ? (
          <>
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </>
        ) : opportunities.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 py-12 opacity-60">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.03]">
              <Target className="h-7 w-7 text-slate-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-300">No opportunities yet</p>
              <p className="mt-1 text-xs text-slate-500">Paste emails and click Extract to begin</p>
            </div>
          </div>
        ) : (
          <>
            {eligible.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                activeField={activeField}
                onFieldClick={onFieldClick}
                onPreparePackage={onPreparePackage}
                onViewDetails={onViewDetails}
              />
            ))}

            {eligible.length === 0 && (filterBy !== 'all' || deadlineFilter !== 'all') && (
              <div className="py-8 text-center text-sm text-slate-500">
                No opportunities found for current type/deadline filters
              </div>
            )}

            {ineligible.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                    Ineligible ({ineligible.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {ineligible.map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      opportunity={opp}
                      activeField={activeField}
                      onFieldClick={onFieldClick}
                      onPreparePackage={onPreparePackage}
                      onViewDetails={onViewDetails}
                    />
                  ))}
                </div>
              </div>
            )}

            {spam.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 flex items-center gap-2">
                  <Ban className="h-3.5 w-3.5 text-red-400/60" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-red-400/60">
                    Filtered Spam ({spam.length})
                  </span>
                </div>
                <div className="space-y-1">
                  {spam.map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      opportunity={opp}
                      activeField={activeField}
                      onFieldClick={onFieldClick}
                      onPreparePackage={onPreparePackage}
                      onViewDetails={onViewDetails}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
