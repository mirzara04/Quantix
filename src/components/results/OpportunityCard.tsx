import { Opportunity } from '@/lib/types';
import { Calendar, Award, ChevronRight } from 'lucide-react';

interface Props {
  opportunity: Opportunity;
  isSelected?: boolean;
  onClick: () => void;
}

export default function OpportunityCard({ opportunity, isSelected, onClick }: Props) {
  const isUrgent = opportunity.score_breakdown.urgency > 20; 

  return (
    <div 
      onClick={onClick}
      className={`bento-card p-5 cursor-pointer interactive-card relative overflow-hidden group mb-4 ${
        isUrgent ? 'urgent' : ''
      } ${isSelected ? (isUrgent ? '!border-amber-500/50' : '!border-blue-500/50') : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-sm font-semibold text-white/90 pr-12 line-clamp-2 leading-tight">
            {opportunity.title}
          </h3>
          <p className="text-xs text-white/50 mt-1 flex items-center gap-1.5">
            <span className="truncate max-w-[180px]">{opportunity.organization}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="capitalize">{opportunity.type}</span>
          </p>
        </div>
        
        {/* Ranking Badge */}
        <div className={`absolute top-5 right-5 flex flex-col items-end`}>
          <span className={`text-xl font-bold tracking-tighter ${opportunity.score > 80 ? 'text-blue-500' : 'text-blue-500'}`}>
            {opportunity.score}%
          </span>
          <span className="text-[10px] uppercase tracking-widest text-white/30 font-medium">Match</span>
        </div>
      </div>

      {/* Evidence Snippet (Why Box) */}
      {opportunity.rank_reason && (
        <div className="mt-3 mb-4 text-xs text-white/80 bg-[#0a0a0a] border border-[#2563eb] p-3 rounded-md leading-relaxed shadow-[0_0_10px_rgba(37,99,235,0.05)]">
          <span className="font-semibold text-white mr-1">Why:</span>
          {opportunity.rank_reason.replace(`Match: ${opportunity.score}% — `, '')}
        </div>
      )}

      {/* Structured Metadata */}
      <div className="flex flex-wrap gap-3 mt-4">
        {opportunity.deadline && (
          <div className="flex items-center gap-1.5 text-xs text-white/60 bg-[#000000] px-2 py-1 rounded-md border border-white/5">
            <Calendar className={`w-3.5 h-3.5 ${isUrgent ? 'text-amber-500' : 'text-white/40'}`} />
            <span className={isUrgent ? 'text-amber-500/90' : ''}>
              {new Date(opportunity.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        )}
        {(opportunity.min_cgpa ?? 0) > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-white/60 bg-[#000000] px-2 py-1 rounded-md border border-white/5">
            <Award className="w-3.5 h-3.5 text-white/40" />
            <span>&ge; {opportunity.min_cgpa} CGPA</span>
          </div>
        )}
      </div>
      
      {/* Selection indication */}
      <div className={`absolute right-4 bottom-4 transition-all duration-300 ${isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
        <ChevronRight className={`w-5 h-5 ${isUrgent ? 'text-amber-500' : 'text-blue-500'}`} />
      </div>
    </div>
  );
}
