import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDeadline(deadline: string | null | undefined): string {
  if (!deadline) return 'No deadline';
  const d = new Date(deadline);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  if (diffHours < 0) return 'Deadline passed';
  if (diffHours < 24) return `${Math.floor(diffHours)}h remaining`;
  if (diffDays < 7) return `${Math.floor(diffDays)}d remaining`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    scholarship: '🎓',
    internship: '💼',
    fellowship: '🔬',
    competition: '🏆',
    grant: '💰',
    spam: '🚫',
    unknown: '📋',
  };
  return icons[type] || '📋';
}

export function getTypeBadgeColor(type: string): string {
  const colors: Record<string, string> = {
    scholarship: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    internship: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    fellowship: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    competition: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    grant: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    spam: 'bg-red-500/20 text-red-300 border-red-500/30',
    unknown: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  };
  return colors[type] || colors.unknown;
}
