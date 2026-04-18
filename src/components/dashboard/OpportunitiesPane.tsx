'use client';

import { useState, useMemo } from 'react';
import { Target, Filter, SortDesc, AlertTriangle, Ban } from 'lucide-react';
import { Opportunity, ActiveField, StudentProfile } from '@/lib/types';
import OpportunityCard from './OpportunityCard';
import SkeletonCard from '@/components/ui/SkeletonCard';
import { cn } from '@/lib/utils';

interface OpportunitiesPaneProps {
  opportunities: Opportunity[];
  isExtracting: boolean;
  activeField: ActiveField;
  profile: StudentProfile;
  onFieldClick: (opportunityId: string, field: string) => void;
  onPreparePackage: (opportunity: Opportunity) => void;
}

type SortOption = 'score' | 'deadline' | 'type';
type FilterOption = 'all' | 'scholarship' | 'internship' | 'fellowship' | 'competition';

export default function OpportunitiesPane({
  opportunities,
  isExtracting,
  activeField,
  onFieldClick,
  onPreparePackage,
}: OpportunitiesPaneProps) {
  const [sortBy, setSortBy] = useState<SortOption>('score');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const eligible = useMemo(
    () =>
      opportunities
        .filter((o) => !o.is_spam && o.is_eligible)
        .filter((o) => filterBy === 'all' || o.type === filterBy)
        .sort((a, b) => {
          if (sortBy === 'score') return b.score - a.score;
          if (sortBy === 'deadline') {
            const aD = a.deadline ? new Date(a.deadline).getTime() : Infinity;
            const bD = b.deadline ? new Date(b.deadline).getTime() : Infinity;
            return aD - bD;
          }
          return a.type.localeCompare(b.type);
        }),
    [opportunities, sortBy, filterBy]
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

  return (
    <div className="flex flex-col h-full glass-panel rounded-xl border border-white/8 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/5 shrink-0 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">Opportunities</span>
            {opportunities.length > 0 && (
              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/15 px-2 py-0.5 rounded-full">
                {eligible.length} eligible
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-white/5 border border-white/8 rounded-lg text-xs text-slate-300 px-2 py-1 focus:outline-none focus:border-cyan-500/40"
            >
              <option value="score">Sort: Score</option>
              <option value="deadline">Sort: Deadline</option>
              <option value="type">Sort: Type</option>
            </select>
          </div>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-0.5">
          {(['all', 'scholarship', 'internship', 'fellowship', 'competition'] as FilterOption[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilterBy(f)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-200',
                filterBy === f
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-white/3 text-slate-500 border border-white/5 hover:border-white/15 hover:text-slate-300'
              )}
            >
              {f}
              {counts[f] !== undefined && (
                <span className={cn('rounded-full px-1', filterBy === f ? 'bg-cyan-500/30' : 'bg-white/10')}>
                  {counts[f]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {isExtracting ? (
          <>
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </>
        ) : opportunities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-12 opacity-50">
            <div className="w-14 h-14 rounded-2xl bg-white/3 border border-white/8 flex items-center justify-center">
              <Target className="w-7 h-7 text-slate-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-400">No opportunities yet</p>
              <p className="text-xs text-slate-600 mt-1">
                Paste emails and click Extract to begin
              </p>
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
              />
            ))}

            {eligible.length === 0 && filterBy !== 'all' && (
              <div className="text-center py-8 text-slate-500 text-sm">
                No {filterBy} opportunities found
              </div>
            )}

            {ineligible.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
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
                    />
                  ))}
                </div>
              </div>
            )}

            {spam.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Ban className="w-3.5 h-3.5 text-red-400/60" />
                  <span className="text-xs font-semibold text-red-400/60 uppercase tracking-wider">
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
