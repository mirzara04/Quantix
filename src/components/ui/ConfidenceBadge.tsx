'use client';

import { cn } from '@/lib/utils';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

interface ConfidenceBadgeProps {
  completeness: number; // 0-100
  showLabel?: boolean;
}

export default function ConfidenceBadge({ completeness, showLabel = true }: ConfidenceBadgeProps) {
  const tier =
    completeness >= 80 ? 'high' :
    completeness >= 40 ? 'medium' : 'low';

  const config = {
    high:   { label: 'High Confidence', Icon: ShieldCheck, classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' },
    medium: { label: 'Medium Confidence', Icon: ShieldAlert, classes: 'bg-amber-500/10 text-amber-400 border-amber-500/25' },
    low:    { label: 'Low Confidence', Icon: ShieldX,    classes: 'bg-red-500/10 text-red-400 border-red-500/25' },
  }[tier];

  const { label, Icon, classes } = config;

  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold', classes)}>
      <Icon className="w-2.5 h-2.5" />
      {showLabel ? label : `${completeness}%`}
    </span>
  );
}
