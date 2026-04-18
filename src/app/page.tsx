'use client';

<<<<<<< HEAD
import { useState, useCallback, useEffect, useRef } from 'react';
import { Opportunity, StudentProfile, ActiveField, EvidenceField, EvidenceMarker } from '@/lib/types';
import { calculateScore, DEFAULT_WEIGHTS, normalizeWeights, type ScoringWeights } from '@/lib/calculateScore';
import { DEMO_PROFILE, DEMO_EMAIL_TEXT, DEMO_OPPORTUNITIES } from '@/lib/demoData';
import { downloadRankedReportPdf } from '@/lib/pdfReport';
import Header from '@/components/layout/Header';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileModal from '@/components/profile/ProfileModal';
import EmailPane from '@/components/dashboard/EmailPane';
import OpportunitiesPane from '@/components/dashboard/OpportunitiesPane';
import PackageModal from '@/components/dashboard/PackageModal';
import OpportunityDetailModal from '@/components/dashboard/OpportunityDetailModal';
=======
import { useState, useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Opportunity, StudentProfile } from '@/lib/types';
import { DEMO_PROFILE, DEMO_EMAIL_TEXT, DEMO_OPPORTUNITIES } from '@/lib/demoData';
import { calculateScore } from '@/lib/calculateScore';

import Navbar from '@/components/layout/Navbar';
import DashboardGrid from '@/components/layout/DashboardGrid';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileModal from '@/components/profile/ProfileModal';
import EmailInput from '@/components/inbox/EmailInput';
import OpportunityCard from '@/components/results/OpportunityCard';
import ActionCenter from '@/components/checklist/ActionCenter';
import LoadingScreen from '@/components/layout/LoadingScreen';
>>>>>>> origin/talha

gsap.registerPlugin(useGSAP);

<<<<<<< HEAD
const WEIGHTS_STORAGE_KEY = 'quantix.scoring.weights.v1';
const GMAIL_STORAGE_KEY = 'quantix.gmail.connector.v1';

const EVIDENCE_PATTERNS: Record<EvidenceField, RegExp[]> = {
  deadline: [/\bdeadline\b/i, /\bapply by\b/i, /\bapplications? close\b/i],
  stipend: [/\bstipend\b/i, /\bcompensation\b/i, /\bprize pool\b/i, /\bscholarship amount\b/i],
  min_cgpa: [/\bcgpa\b/i, /\bgpa\b/i, /\bminimum\b/i],
  location: [/\blocation\b/i, /\bhybrid\b/i, /\bremote\b/i, /\bin-person\b/i],
  keywords: [/\bskills?\b/i, /\brequired\b/i, /\bpreferred\b/i, /\bfields?\b/i, /\bfocus\b/i],
};

const SPAM_SIGNAL_RULES: Array<{ label: string; test: (text: string) => boolean }> = [
  { label: 'Promotional language detected (sale/discount/offer)', test: (t) => /(sale|discount|offer|buy now|limited time|deal)/i.test(t) },
  { label: 'Prize or lucky draw phrasing detected', test: (t) => /(lucky draw|winner|claim prize|congratulations you won)/i.test(t) },
  { label: 'Suspicious urgency pattern (click now / act fast)', test: (t) => /(click now|act fast|urgent action required|expires today)/i.test(t) },
  { label: 'Non-academic retail/commercial context', test: (t) => /(shopping|coupon|flash sale|retail)/i.test(t) },
];

interface GmailConnectorSettings {
  enabled: boolean;
  endpoint: string;
  token: string;
  connectedEmail: string;
  lastSyncAt: string | null;
}

type PersistedGmailConnectorSettings = Omit<GmailConnectorSettings, 'token'>;

const DEFAULT_GMAIL_SETTINGS: GmailConnectorSettings = {
  enabled: false,
  endpoint: '',
  token: '',
  connectedEmail: '',
  lastSyncAt: null,
};

type RawOpportunity = Omit<Opportunity, 'score' | 'score_breakdown' | 'is_eligible'> & { evidence_markers?: EvidenceMarker[] };

function pickEvidenceLine(sourceText: string, field: EvidenceField): string | null {
  const lines = sourceText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const patterns = EVIDENCE_PATTERNS[field];
  const match = lines.find((line) => patterns.some((pattern) => pattern.test(line)));
  return match ?? null;
}

function buildEvidenceMarkers(raw: RawOpportunity): EvidenceMarker[] {
  if (raw.evidence_markers?.length) {
    return raw.evidence_markers;
  }

  return (Object.keys(EVIDENCE_PATTERNS) as EvidenceField[])
    .map((field) => {
      const text = pickEvidenceLine(raw.source_text, field);
      if (!text) return null;
      return { field, text, start: 0, end: text.length };
    })
    .filter((marker): marker is EvidenceMarker => marker !== null);
}

function deriveSpamSignals(raw: RawOpportunity): string[] {
  const source = `${raw.title}\n${raw.description}\n${raw.source_text}`;
  const detected = SPAM_SIGNAL_RULES.filter((rule) => rule.test(source)).map((rule) => rule.label);

  if (detected.length > 0) return detected;
  return ['Classifier marked this item as non-opportunity or spam content'];
}

function stripScoringFields(opportunity: Opportunity): RawOpportunity {
  const { score, score_breakdown, is_eligible, ...raw } = opportunity;
  return raw;
}

function scoreAndSortOpportunities(
  rawOpportunities: RawOpportunity[],
  profile: StudentProfile,
  weights: ScoringWeights
): Opportunity[] {
  return rawOpportunities.map((raw, idx) => {
    const extracted = {
      title: raw.title,
      organization: raw.organization,
      type: raw.type,
      deadline: raw.deadline ?? undefined,
      stipend: raw.stipend,
      min_cgpa: raw.min_cgpa,
      keywords: raw.keywords,
      requires_financial_need: raw.requires_financial_need,
      location: raw.location,
      description: raw.description,
      source_text: raw.source_text,
      apply_link: raw.apply_link,
      required_documents: raw.required_documents,
      is_spam: raw.is_spam,
    };
    const evidenceMarkers = buildEvidenceMarkers(raw);
    const id = raw.id || `opp-${idx}-${Date.now()}`;
=======
const FILTER_TABS = ['All', 'Scholarships', 'Internships', 'Fellowships', 'Competitions', 'Admissions'];
>>>>>>> origin/talha

function scoreAndSort(opps: Opportunity[], profile: StudentProfile) {
  return opps.map(raw => {
    if (raw.is_spam) {
<<<<<<< HEAD
      const spamSignals = deriveSpamSignals(raw);
      return {
        ...raw,
        id,
        score: 0,
        score_breakdown: { urgency: 0, fit: 0, status: 0, completeness: 0, total: 0 },
        is_eligible: false,
        rank_reason: `Filtered as spam · ${spamSignals[0]}`,
        eligibility_gap: null,
        evidence_markers: evidenceMarkers,
        spam_signals: spamSignals,
        apply_link: raw.apply_link ?? null,
        required_documents: raw.required_documents ?? [],
        status: 'complete' as const,
      } as Opportunity;
    }

    const { score, breakdown, is_eligible, rank_reason, eligibility_gap } = calculateScore(extracted, profile, weights);

    return {
      ...raw,
      id,
      score,
      score_breakdown: breakdown,
      is_eligible,
      rank_reason,
      eligibility_gap: eligibility_gap ?? null,
      evidence_markers: evidenceMarkers,
      spam_signals: [],
      apply_link: raw.apply_link ?? null,
      required_documents: raw.required_documents ?? [],
      status: 'complete' as const,
    } as Opportunity;
  });
=======
      return { ...raw, score: 0 };
    }
    const { score, breakdown, is_eligible, rank_reason } = calculateScore(raw, profile);
    return {
      ...raw,
      score,
      score_breakdown: breakdown,
      is_eligible,
      rank_reason
    };
  }).sort((a, b) => b.score - a.score).filter(o => !o.is_spam);
>>>>>>> origin/talha
}

function formatInboxPayload(data: unknown): string {
  if (!data || typeof data !== 'object') return '';
  const maybeEmails = (data as { emails?: Array<Record<string, unknown>> }).emails;
  if (!Array.isArray(maybeEmails) || maybeEmails.length === 0) return '';

  return maybeEmails
    .map((email, index) => {
      const from = typeof email.from === 'string' ? email.from : 'Unknown sender';
      const subject = typeof email.subject === 'string' ? email.subject : 'No subject';
      const body = typeof email.body === 'string' ? email.body : '';
      const date = typeof email.date === 'string' ? email.date : '';
      return `---------- Email ${index + 1} ----------\nFrom: ${from}\nSubject: ${subject}${date ? `\nDate: ${date}` : ''}\n\n${body}`;
    })
    .join('\n\n');
}

export default function DashboardPage() {
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const [profile, setProfile] = useState<StudentProfile>(DEMO_PROFILE);
  const [emailText, setEmailText] = useState(DEMO_EMAIL_TEXT);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
<<<<<<< HEAD
  const [isSyncingInbox, setIsSyncingInbox] = useState(false);
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [packageTarget, setPackageTarget] = useState<Opportunity | null>(null);
  const [detailTarget, setDetailTarget] = useState<Opportunity | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [weights, setWeights] = useState<ScoringWeights>(DEFAULT_WEIGHTS);
  const [gmailSettings, setGmailSettings] = useState<GmailConnectorSettings>(DEFAULT_GMAIL_SETTINGS);
  const [connectorModalOpen, setConnectorModalOpen] = useState(false);
  const [connectorDraft, setConnectorDraft] = useState<GmailConnectorSettings>(DEFAULT_GMAIL_SETTINGS);
  const connectorModalRef = useRef<HTMLDivElement>(null);
  const connectorFirstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const rawWeights = window.localStorage.getItem(WEIGHTS_STORAGE_KEY);
      if (rawWeights) {
        const parsed = JSON.parse(rawWeights) as Partial<ScoringWeights>;
        setWeights(normalizeWeights({
          urgency: Number(parsed.urgency) || 0,
          fit: Number(parsed.fit) || 0,
          status: Number(parsed.status) || 0,
          completeness: Number(parsed.completeness) || 0,
        }));
      }
    } catch {
      setWeights(DEFAULT_WEIGHTS);
    }

    try {
      const rawConnector = window.localStorage.getItem(GMAIL_STORAGE_KEY);
      if (rawConnector) {
        const parsed = JSON.parse(rawConnector) as Partial<PersistedGmailConnectorSettings>;
        setGmailSettings({
          ...DEFAULT_GMAIL_SETTINGS,
          enabled: Boolean(parsed.enabled),
          endpoint: typeof parsed.endpoint === 'string' ? parsed.endpoint : '',
          connectedEmail: typeof parsed.connectedEmail === 'string' ? parsed.connectedEmail : '',
          lastSyncAt: typeof parsed.lastSyncAt === 'string' ? parsed.lastSyncAt : null,
        });
      }
    } catch {
      setGmailSettings(DEFAULT_GMAIL_SETTINGS);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(WEIGHTS_STORAGE_KEY, JSON.stringify(weights));
  }, [weights]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const persisted: PersistedGmailConnectorSettings = {
      enabled: gmailSettings.enabled,
      endpoint: gmailSettings.endpoint,
      connectedEmail: gmailSettings.connectedEmail,
      lastSyncAt: gmailSettings.lastSyncAt,
    };
    window.localStorage.setItem(GMAIL_STORAGE_KEY, JSON.stringify(persisted));
  }, [gmailSettings]);

  useEffect(() => {
    if (!connectorModalOpen) return;

    const focusTimer = window.setTimeout(() => {
      connectorFirstInputRef.current?.focus();
    }, 0);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setConnectorModalOpen(false);
        return;
      }

      if (event.key !== 'Tab') return;

      const modalEl = connectorModalRef.current;
      if (!modalEl) return;

      const focusable = modalEl.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !modalEl.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !modalEl.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [connectorModalOpen]);

  useEffect(() => {
    if (opportunities.length === 0) return;
    setOpportunities((prev) => scoreAndSortOpportunities(prev.map(stripScoringFields), profile, weights));
    setActiveField(null);
  }, [weights]);
=======
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState('All');
>>>>>>> origin/talha

  const containerRef = useRef<HTMLDivElement>(null);
  const mainDashRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

<<<<<<< HEAD
    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailText }),
      });

      const data = await res.json();

      if (!res.ok) {
        setExtractError(data.error || 'Extraction failed');
        return;
      }

      const scored = scoreAndSortOpportunities(data.opportunities as RawOpportunity[], profile, weights);
      setOpportunities(scored);
      setIsDemoMode(false);
    } catch {
      setExtractError('Network error — check your connection');
    } finally {
      setIsExtracting(false);
    }
  }, [emailText, isExtracting, profile, weights]);

  const handleDemoMode = useCallback(() => {
    setEmailText(DEMO_EMAIL_TEXT);
    const scored = scoreAndSortOpportunities(DEMO_OPPORTUNITIES.map(stripScoringFields), DEMO_PROFILE, weights);
    setOpportunities(scored);
    setProfile(DEMO_PROFILE);
    setIsDemoMode(true);
    setActiveField(null);
    setExtractError(null);
  }, [weights]);

  const handleProfileSave = useCallback(
    (updated: StudentProfile) => {
      setProfile(updated);
      if (opportunities.length > 0) {
        const rescored = scoreAndSortOpportunities(opportunities.map(stripScoringFields), updated, weights);
        setOpportunities(rescored);
      }
    },
    [opportunities, weights]
  );

  const handleFieldClick = useCallback((opportunityId: string, field: EvidenceField) => {
    setActiveField((prev) =>
      prev?.opportunityId === opportunityId && prev?.field === field
        ? null
        : { opportunityId, field }
    );
  }, []);
=======
  // Intro fade-in when loading screen finishes
  useGSAP(() => {
    if (isAppLoaded && mainDashRef.current) {
      gsap.fromTo(mainDashRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [isAppLoaded]);

  // Derived Filter State
  const filteredOpps = useMemo(() => {
    if (activeTab === 'All') return opportunities;
    const mappedType = activeTab.toLowerCase().replace(/s$/, ''); // e.g. "Scholarships" -> "scholarship"
    return opportunities.filter(o => o.type.toLowerCase() === mappedType);
  }, [opportunities, activeTab]);

  // GSAP Stagger Entrance for Ranked Opportunities on filter change
  useGSAP(() => {
    if (filteredOpps.length > 0 && !selectedOppId && listRef.current) {
      const cards = gsap.utils.toArray('.opp-card-wrapper');
      // Set to invisible then fade up
      gsap.fromTo(cards, 
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
          clearProps: "all" 
        }
      );
    }
  }, [filteredOpps, selectedOppId]);

  const handleScan = () => {
    setIsExtracting(true);
    setTimeout(() => {
      const scored = scoreAndSort(DEMO_OPPORTUNITIES as Opportunity[], profile);
      setOpportunities(scored);
      setIsExtracting(false);
      setSelectedOppId(null);
      setActiveTab('All');
    }, 1500);
  };

  const handleSaveProfile = (updated: StudentProfile) => {
    setProfile(updated);
    if (opportunities.length > 0) {
      const rescored = scoreAndSort(opportunities, updated);
      setOpportunities(rescored);
    }
  };

  const selectedOpp = opportunities.find(o => o.id === selectedOppId);
>>>>>>> origin/talha

  const handleViewDetails = useCallback((opportunity: Opportunity) => {
    setDetailTarget(opportunity);
  }, []);

  const handleWeightsChange = useCallback((next: ScoringWeights) => {
    setWeights(normalizeWeights(next));
  }, []);

  const handleExportReport = useCallback(() => {
    downloadRankedReportPdf(profile, opportunities);
  }, [profile, opportunities]);

  const handleOpenConnector = useCallback(() => {
    setConnectorDraft(gmailSettings);
    setConnectorModalOpen(true);
  }, [gmailSettings]);

  const handleSaveConnector = useCallback(() => {
    setGmailSettings({
      ...connectorDraft,
      endpoint: connectorDraft.endpoint.trim(),
      token: connectorDraft.token.trim(),
      connectedEmail: connectorDraft.connectedEmail.trim(),
      enabled: connectorDraft.enabled && Boolean(connectorDraft.endpoint.trim()),
    });
    setConnectorModalOpen(false);
  }, [connectorDraft]);

  const handleSyncInbox = useCallback(async () => {
    if (isSyncingInbox) return;

    if (!gmailSettings.enabled || !gmailSettings.endpoint.trim()) {
      setExtractError('Gmail connector is not configured yet. Use Connector settings, or continue with paste/upload.');
      return;
    }

    setIsSyncingInbox(true);
    setExtractError(null);

    try {
      const res = await fetch('/api/proxySyncInbox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mailboxId: gmailSettings.connectedEmail,
          endpoint: gmailSettings.endpoint,
          token: gmailSettings.token,
          limit: 8,
        }),
      });

      if (!res.ok) {
        throw new Error(`Sync endpoint returned ${res.status}`);
      }

      const payload = await res.json();
      const formatted = formatInboxPayload(payload);
      if (!formatted.trim()) {
        throw new Error('No emails were returned by the connector endpoint');
      }

      setEmailText(formatted);
      setGmailSettings((prev) => ({ ...prev, lastSyncAt: new Date().toISOString() }));
      setIsDemoMode(false);
    } catch {
      setExtractError('Gmail sync failed. Paste/upload mode is still available as fallback.');
    } finally {
      setIsSyncingInbox(false);
    }
  }, [gmailSettings, isSyncingInbox]);

  return (
<<<<<<< HEAD
    <div className="app-shell flex h-screen flex-col overflow-hidden">
      <Header
        onDemoMode={handleDemoMode}
        onProfileOpen={() => setProfileModalOpen(true)}
        onExportReport={handleExportReport}
        onOpenGmailSettings={handleOpenConnector}
        profileName={profile.name}
        isDemoMode={isDemoMode}
      />

      <div className="mx-auto flex max-w-screen-2xl w-full flex-1 gap-4 overflow-hidden px-4 py-4 sm:px-6">
        <aside className="hidden w-56 shrink-0 flex-col gap-4 lg:flex xl:w-64">
          <ProfileSidebar profile={profile} onEdit={() => setProfileModalOpen(true)} />
        </aside>

        <div className="relative flex min-w-0 flex-1 flex-col">
          {extractError && (
            <div className="mb-3 flex items-center justify-between rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
              <span>{extractError}</span>
              <button onClick={() => setExtractError(null)} className="ml-4 text-red-400 hover:text-red-200">✕</button>
            </div>
          )}
          <EmailPane
            emailText={emailText}
            onEmailChange={setEmailText}
            onExtract={handleExtract}
            onSyncInbox={handleSyncInbox}
            onOpenConnector={handleOpenConnector}
            isExtracting={isExtracting}
            isSyncingInbox={isSyncingInbox}
            lastSyncAt={gmailSettings.lastSyncAt}
            gmailConnected={gmailSettings.enabled}
            activeField={activeField}
            opportunities={opportunities}
          />
        </div>

        <div className="flex w-80 shrink-0 flex-col xl:w-96">
          <OpportunitiesPane
            opportunities={opportunities}
            isExtracting={isExtracting}
            activeField={activeField}
            profile={profile}
            weights={weights}
            onWeightsChange={handleWeightsChange}
            onFieldClick={handleFieldClick}
            onPreparePackage={setPackageTarget}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>

      {profileModalOpen && (
        <ProfileModal
          profile={profile}
          onSave={handleProfileSave}
          onClose={() => setProfileModalOpen(false)}
        />
      )}

      {connectorModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setConnectorModalOpen(false)} />
          <div ref={connectorModalRef} className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#09101c] p-5 shadow-2xl shadow-black/50">
            <h3 className="text-base font-semibold text-white">Gmail Connector Settings</h3>
            <p className="mt-1 text-xs text-slate-400">Configure an optional MCP/connector endpoint for live inbox pull. Paste/upload still works if disabled.</p>

            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="text-xs text-slate-400">Connected Email</span>
                <input
                  ref={connectorFirstInputRef}
                  type="email"
                  value={connectorDraft.connectedEmail}
                  onChange={(e) => setConnectorDraft((prev) => ({ ...prev, connectedEmail: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-300/30 focus:outline-none"
                  placeholder="student@example.com"
                />
              </label>

              <label className="block">
                <span className="text-xs text-slate-400">Sync Endpoint URL</span>
                <input
                  type="url"
                  value={connectorDraft.endpoint}
                  onChange={(e) => setConnectorDraft((prev) => ({ ...prev, endpoint: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-300/30 focus:outline-none"
                  placeholder="https://your-mcp-endpoint/sync"
                />
              </label>

              <label className="block">
                <span className="text-xs text-slate-400">Auth Token (optional)</span>
                <input
                  type="password"
                  value={connectorDraft.token}
                  onChange={(e) => setConnectorDraft((prev) => ({ ...prev, token: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-300/30 focus:outline-none"
                  placeholder="Bearer token"
                />
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={connectorDraft.enabled}
                  onChange={(e) => setConnectorDraft((prev) => ({ ...prev, enabled: e.target.checked }))}
                  className="accent-cyan-500"
                />
                Enable live Gmail sync
              </label>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setConnectorModalOpen(false)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConnector}
                className="rounded-full border border-cyan-300/30 bg-cyan-500/12 px-4 py-2 text-xs font-semibold text-cyan-200"
              >
                Save connector
              </button>
            </div>
          </div>
        </div>
      )}

      {detailTarget && (
        <OpportunityDetailModal
          opportunity={detailTarget}
          onClose={() => setDetailTarget(null)}
          onPreparePackage={setPackageTarget}
        />
      )}

      {packageTarget && (
        <PackageModal
          opportunity={packageTarget}
          profile={profile}
          onClose={() => setPackageTarget(null)}
=======
    <div ref={containerRef} className="flex flex-col h-screen bg-[#000000] overflow-hidden text-slate-200 selection:bg-blue-500/30 relative">
      
      {!isAppLoaded && (
        <LoadingScreen onComplete={() => setIsAppLoaded(true)} />
      )}

      {/* Main app rendered behind/faded in after load */}
      <div 
        ref={mainDashRef} 
        className="flex flex-col h-full w-full"
        style={{ opacity: 0 }}
      >
        <Navbar onOpenProfile={() => setIsProfileModalOpen(true)} />
        
        <DashboardGrid
          left={
            <ProfileSidebar profile={profile} onEdit={() => setIsProfileModalOpen(true)} />
          }
          center={
            <EmailInput 
              value={emailText} 
              onChange={setEmailText} 
              onScan={handleScan} 
              isScanning={isExtracting} 
            />
          }
          right={
            selectedOpp ? (
              <ActionCenter 
                opportunity={selectedOpp} 
                onBack={() => setSelectedOppId(null)} 
              />
            ) : (
              <div className="flex flex-col h-full w-full relative">
                <div className="flex items-center justify-between mb-4 mt-1 shrink-0">
                  <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest">Ranked Results</h2>
                  <span className="text-xs font-medium text-white/30">{filteredOpps.length} Results</span>
                </div>
                
                {/* Horizontal Scrolling Filter Tabs */}
                {opportunities.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-3 mb-2 shrink-0">
                    {FILTER_TABS.map(tab => (
                      <button 
                        key={tab} 
                        onClick={() => {
                          setActiveTab(tab);
                        }}
                        className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-all border ${
                          activeTab === tab 
                            ? 'bg-blue-600/20 text-blue-500 border-blue-600/40 font-medium' 
                            : 'bg-white/5 text-white/50 border-white/5 hover:text-white/80 hover:bg-white/10'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                )}
                
                {opportunities.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-white/30 text-sm">
                    <div className="w-16 h-16 rounded-full border border-white/5 bg-white/5 flex items-center justify-center mb-4">
                      <div className="w-8 h-8 border-2 border-transparent border-t-blue-500 rounded-full animate-spin opacity-50" />
                    </div>
                    Waiting for ingestion stream...
                  </div>
                ) : (
                  <div ref={listRef} key={activeTab} className="flex flex-col pb-20 overflow-y-auto pr-1">
                    {filteredOpps.length === 0 ? (
                      <div className="flex-1 flex justify-center text-white/40 text-xs mt-10">No matching opportunities found for this filter.</div>
                    ) : (
                      filteredOpps.map((opp) => (
                        <div key={opp.id} className="opp-card-wrapper relative z-10 hover:z-20">
                          <OpportunityCard
                            opportunity={opp}
                            isSelected={selectedOppId === opp.id}
                            onClick={() => setSelectedOppId(opp.id)}
                          />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )
          }
        />
      </div>

      {isProfileModalOpen && (
        <ProfileModal 
          profile={profile} 
          onSave={handleSaveProfile} 
          onClose={() => setIsProfileModalOpen(false)} 
>>>>>>> origin/talha
        />
      )}
    </div>
  );
}
