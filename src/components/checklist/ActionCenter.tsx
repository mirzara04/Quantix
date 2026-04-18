import { Opportunity } from '@/lib/types';
import { CheckCircle2, ArrowLeft, ExternalLink, FileText, AlertCircle } from 'lucide-react';

export default function ActionCenter({ 
  opportunity, 
  onBack 
}: { 
  opportunity: Opportunity, 
  onBack: () => void 
}) {
  const documents = opportunity.required_documents?.length 
    ? opportunity.required_documents
    : ['Official Transcript', 'Statement of Purpose (SOP)', '2x Letters of Recommendation'];

  const tasks = [
    `Step 1: Review official guidelines via external link`,
    `Step 2: Collect all ${documents.length} required documents`,
    `Step 3: Draft initial proposal/application text`,
    `Step 4: Request final review and submit before deadline`
  ];

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-300">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md transition-colors text-white/60 border border-white/10">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Extraction Details</h2>
      </div>

      <div className="bento-card p-6 flex flex-col gap-6 flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#0a0a0a] to-[#000000] border-t-blue-600/30">
        <div>
          <h1 className="text-xl font-bold text-white mb-2 tracking-tight leading-snug">{opportunity.title}</h1>
          <p className="text-sm text-white/50 flex items-center gap-2">
             <span className="truncate">{opportunity.organization}</span>
             <span className="w-1 h-1 rounded-full bg-white/20" />
             <span className="capitalize">{opportunity.type}</span>
          </p>
        </div>
        
        <div className="flex gap-3">
           <a href={opportunity.apply_link || '#'} target="_blank" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md text-sm transition-colors cursor-pointer">
              <ExternalLink className="w-4 h-4" /> Apply Now
           </a>
        </div>

        <div className="h-px w-full bg-white/10 my-1" />

        {/* Section 1: Eligibility Criteria */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-widest flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" /> Eligibility Criteria
          </h3>
          <div className="bg-[#050505] border border-white/5 rounded-md p-4 text-sm text-white/80 leading-relaxed flex flex-col gap-2">
             <div className="flex justify-between">
                <span className="text-white/50">Minimum CGPA</span>
                <span className="font-medium">{opportunity.min_cgpa > 0 ? opportunity.min_cgpa : 'Not specified'}</span>
             </div>
             {opportunity.requires_financial_need && (
                <div className="flex justify-between">
                  <span className="text-white/50">Financial Need</span>
                  <span className="text-amber-500 font-medium">Required</span>
               </div>
             )}
             <div className="flex flex-col gap-1 mt-2 lg:mt-1">
                <span className="text-white/50">Skill Requirements:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                   {opportunity.keywords.length > 0 ? opportunity.keywords.map((k, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white/10 border border-white/5 rounded text-xs">{k}</span>
                   )) : <span className="text-xs text-white/30 italic">None specifically parsed</span>}
                </div>
             </div>
          </div>
        </div>

        {/* Section 2: Required Documents */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-widest flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Required Documents
          </h3>
          <ul className="bg-[#050505] border border-white/5 rounded-md p-4 text-sm text-white/80 leading-relaxed list-disc list-inside space-y-2">
             {documents.map((doc, idx) => (
                <li key={idx} className="text-white/70">{doc}</li>
             ))}
          </ul>
        </div>

        {/* Section 3: Action Checklist */}
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold text-blue-500 uppercase tracking-widest flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Action Checklist
          </h3>
          <div className="flex flex-col gap-3">
             {tasks.map((task, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-md border border-white/5 bg-[#0a0a0a] group hover:border-blue-500/30 transition-colors cursor-pointer shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-white/20 group-hover:text-blue-500 transition-colors mt-0.5 shrink-0" />
                  <span className="text-sm text-white/70 group-hover:text-white/90">{task}</span>
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
