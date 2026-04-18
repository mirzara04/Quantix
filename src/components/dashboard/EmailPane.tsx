'use client';

import { useRef, useEffect, useState } from 'react';
import { Mail, Trash2, Loader2, Sparkles } from 'lucide-react';
import { Opportunity, ActiveField } from '@/lib/types';
import { cn } from '@/lib/utils';

interface EmailPaneProps {
  emailText: string;
  onEmailChange: (text: string) => void;
  onExtract: () => void;
  isExtracting: boolean;
  activeField: ActiveField;
  opportunities: Opportunity[];
}

export default function EmailPane({
  emailText,
  onEmailChange,
  onExtract,
  isExtracting,
  activeField,
  opportunities,
}: EmailPaneProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [highlightedHTML, setHighlightedHTML] = useState('');

  useEffect(() => {
    if (!activeField || !emailText) {
      setHighlightedHTML('');
      return;
    }

    const opp = opportunities.find((o) => o.id === activeField.opportunityId);
    if (!opp) {
      setHighlightedHTML('');
      return;
    }

    const marker = opp.evidence_markers.find((m) => m.field === activeField.field);
    if (!marker || !marker.text) {
      setHighlightedHTML('');
      return;
    }

    const escaped = marker.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const highlighted = emailText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(regex, '<mark class="highlight-evidence">$1</mark>');

    setHighlightedHTML(highlighted);

    setTimeout(() => {
      const markEl = highlightRef.current?.querySelector('mark');
      if (markEl) {
        markEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }, [activeField, emailText, opportunities]);

  const syncScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-xl border border-white/8 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">Email Inbox</span>
          {emailText && (
            <span className="text-xs text-slate-500">
              {emailText.split('\n').length} lines
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {emailText && (
            <button
              onClick={() => onEmailChange('')}
              className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onExtract}
            disabled={!emailText.trim() || isExtracting}
            className={cn(
              'flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all duration-200',
              emailText.trim() && !isExtracting
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:from-cyan-500 hover:to-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-white/5 text-slate-500 cursor-not-allowed'
            )}
          >
            {isExtracting ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Extracting...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3" />
                Extract
              </>
            )}
          </button>
        </div>
      </div>

      {activeField && highlightedHTML && (
        <div className="px-3 py-2 bg-yellow-500/10 border-b border-yellow-500/20 shrink-0">
          <p className="text-xs text-yellow-300 font-medium">
            Evidence highlighted for: <span className="uppercase font-bold">{activeField.field}</span>
          </p>
        </div>
      )}

      <div className="relative flex-1 overflow-hidden">
        {activeField && highlightedHTML ? (
          <div
            ref={highlightRef}
            className="absolute inset-0 overflow-auto p-4 text-xs font-mono leading-relaxed text-slate-300 whitespace-pre-wrap break-words pointer-events-none"
            dangerouslySetInnerHTML={{ __html: highlightedHTML }}
            style={{ fontFamily: 'ui-monospace, monospace', lineHeight: '1.7' }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={emailText}
            onChange={(e) => onEmailChange(e.target.value)}
            onScroll={syncScroll}
            placeholder={`Paste your batch of emails here...\n\nExample:\n---------- Email 1 ----------\nFrom: scholarships@example.com\nSubject: INSPIRE Fellowship 2024\n\nDear Student,\nApplications are open for...\n\n---------- Email 2 ----------\n...`}
            className="absolute inset-0 w-full h-full bg-transparent resize-none p-4 text-xs font-mono leading-relaxed text-slate-300 placeholder-slate-600 focus:outline-none"
            style={{ fontFamily: 'ui-monospace, monospace', lineHeight: '1.7' }}
            spellCheck={false}
          />
        )}
      </div>

      {!emailText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-3 opacity-30">
            <Mail className="w-10 h-10 text-slate-500" />
            <p className="text-xs text-slate-500 text-center max-w-[200px]">
              Paste emails above then click Extract to identify opportunities
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
