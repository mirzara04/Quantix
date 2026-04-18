'use client';

import { getScoreColor, getScoreBg, getScoreLabel } from '@/lib/calculateScore';
import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ScoreBadge({ score, size = 'md', showLabel = false }: ScoreBadgeProps) {
  const pulseClass =
    score >= 80 ? 'score-pulse-green' : score >= 50 ? 'score-pulse-amber' : 'score-pulse-red';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 min-w-[44px]',
    md: 'text-sm px-2.5 py-1 min-w-[52px]',
    lg: 'text-base px-3 py-1.5 min-w-[64px]',
  };

  return (
    <div className="flex flex-col items-end gap-0.5">
      <span
        className={cn(
          'rounded-full border font-semibold text-center tabular-nums shadow-sm',
          getScoreBg(score),
          getScoreColor(score),
          sizeClasses[size],
          pulseClass
        )}
      >
        {score}
      </span>
      {showLabel && (
        <span className={cn('text-[11px] font-medium tracking-tight', getScoreColor(score))}>
          {getScoreLabel(score)}
        </span>
      )}
    </div>
  );
}
