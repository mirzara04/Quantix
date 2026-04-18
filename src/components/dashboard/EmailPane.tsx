'use client';

import { useRef, useEffect, useState } from 'react';
import { Mail, Trash2, Loader2, Sparkles } from 'lucide-react';
import { Opportunity, ActiveField } from '@/lib/types';
import { cn } from '@/lib/utils';

interface EmailPaneProps {
  emailText: string;
  onEmailChange: (text: string) => void;
  onExtract: () => void;
  onSyncInbox: () => void;
  onOpenConnector: () => void;
  isExtracting: boolean;
  isSyncingInbox: boolean;
  lastSyncAt: string | null;
  gmailConnected: boolean;
  activeField: ActiveField;
  opportunities: Opportunity[];
}

export default function EmailPane({
  emailText,
  onEmailChange,
  onExtract,
  onSyncInbox,
  onOpenConnector,
  isExtracting,
  isSyncingInbox,
  lastSyncAt,
  gmailConnected,
  activeField,
  opportunities,
}: EmailPaneProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [highlightedHTML, setHighlightedHTML] = useState('');
  const timeoutRef = useRef<number | null>(null);
  const parsedSyncDate = lastSyncAt ? new Date(lastSyncAt) : null;
  const hasValidSyncDate = Boolean(parsedSyncDate && !Number.isNaN(parsedSyncDate.getTime()));

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

    const escapedMarkerHtml = marker.text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const escapedMarker = escapedMarkerHtml.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedMarker})`, 'gi');
    const escapedEmail = emailText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const highlighted = escapedEmail.replace(regex, '<mark class="highlight-evidence">$1</mark>');

    setHighlightedHTML(highlighted);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      const markEl = highlightRef.current?.querySelector('mark');
      if (markEl) {
        markEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [activeField, emailText, opportunities]);

  const syncScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="relative flex flex-col h-full glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-xl shadow-black/20">
      {/* The inbox now uses a tighter editor layout so the highlighted evidence reads like a real analysis workspace. */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/6 shrink-0 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-orange-300" />
          <span className="text-sm font-semibold text-white">Email Inbox</span>
          <span className={cn(
            'rounded-full border px-2 py-0.5 text-[11px] font-medium',
            gmailConnected
              ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
              : 'border-white/10 bg-white/[0.03] text-slate-400'
          )}>
            {gmailConnected ? 'Gmail connected' : 'Paste mode'}
          </span>
          {emailText && (
            <span className="rounded-full border border-white/8 bg-white/[0.04] px-2 py-0.5 text-[11px] text-slate-400">
              {emailText.split('\n').length} lines
            </span>
          )}
          {hasValidSyncDate && parsedSyncDate && (
            <span className="text-[11px] text-slate-500">
              Synced {parsedSyncDate.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenConnector}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-300 transition-colors hover:border-cyan-300/30 hover:text-cyan-200"
          >
            Connector
          </button>
          <button
            onClick={onSyncInbox}
            disabled={isSyncingInbox}
            className={cn(
              'rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors',
              isSyncingInbox
                ? 'border-white/10 bg-white/5 text-slate-500 cursor-not-allowed'
                : 'border-cyan-400/25 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/16'
            )}
          >
            {isSyncingInbox ? 'Syncing...' : 'Sync Gmail'}
          </button>
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
              'flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-all duration-200',
              emailText.trim() && !isExtracting
                ? 'bg-[linear-gradient(135deg,#ff8a3d,#f97316)] text-white shadow-lg shadow-orange-500/15 hover:brightness-110'
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
        <div className="px-3 py-2 bg-amber-500/10 border-b border-amber-500/20 shrink-0">
          <p className="text-xs text-amber-200 font-medium">
            Evidence highlighted for: <span className="uppercase font-bold">{activeField.field}</span>
          </p>
        </div>
      )}

      <div className="relative flex-1 overflow-hidden">
        {activeField && highlightedHTML ? (
          <div
            ref={highlightRef}
            className="absolute inset-0 overflow-auto p-4 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap break-words pointer-events-none"
            dangerouslySetInnerHTML={{ __html: highlightedHTML }}
            style={{ fontFamily: 'var(--font-body), ui-monospace, monospace', lineHeight: '1.75' }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={emailText}
            onChange={(e) => onEmailChange(e.target.value)}
            onScroll={syncScroll}
            placeholder={`Paste your batch of emails here...\n\nExample:\n---------- Email 1 ----------\nFrom: scholarships@example.com\nSubject: INSPIRE Fellowship 2024\n\nDear Student,\nApplications are open for...\n\n---------- Email 2 ----------\n...`}
            className="absolute inset-0 h-full w-full resize-none bg-transparent p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none"
            style={{ fontFamily: 'var(--font-body), ui-monospace, monospace', lineHeight: '1.75' }}
            spellCheck={false}
          />
        )}
      </div>

      {!emailText && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center gap-3 opacity-30">
            <Mail className="w-10 h-10 text-slate-400" />
            <p className="text-xs text-slate-500 text-center max-w-[200px]">
              Paste emails above then click Extract to identify opportunities
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
