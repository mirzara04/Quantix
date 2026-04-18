import { Opportunity } from '@/lib/types';
import { CheckCircle2, ArrowLeft, ExternalLink } from 'lucide-react';

export default function ActionCenter({ 
  opportunity, 
  onBack 
}: { 
  opportunity: Opportunity, 
  onBack: () => void 
}) {
  const tasks = opportunity.required_documents?.length 
    ? opportunity.required_documents.map(d => `Acquire and verify ${d}`)
    : ['Review official guidelines', 'Update resume/CV', 'Draft Statement of Purpose', 'Request recommendations'];

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-300">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md transition-colors text-white/60 border border-white/10">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Action Center</h2>
      </div>

      <div className="bento-card p-6 flex flex-col gap-6 flex-1 bg-gradient-to-b from-[#0a0a0a] to-[#000000] border-t-blue-600/30">
        <div>
          <h1 className="text-xl font-bold text-white mb-2 tracking-tight leading-snug">{opportunity.title}</h1>
          <p className="text-sm text-white/50">{opportunity.organization}</p>
        </div>
        
        <div className="flex gap-3">
           <a href={opportunity.apply_link || '#'} target="_blank" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm transition-colors cursor-pointer">
              <ExternalLink className="w-4 h-4" /> Apply Now
           </a>
        </div>

        <div className="h-px w-full bg-white/10 my-2" />

        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white/80">Application Checklist</h3>
          <div className="flex flex-col gap-3">
             {tasks.map((task, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-md border border-white/5 bg-[#050505] group hover:border-blue-500/30 transition-colors cursor-pointer">
                  <CheckCircle2 className="w-5 h-5 text-white/20 group-hover:text-amber-500 transition-colors mt-0.5 shrink-0" />
                  <span className="text-sm text-white/70 group-hover:text-white/90">{task}</span>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
