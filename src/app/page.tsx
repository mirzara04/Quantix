'use client';

import { useState, useCallback } from 'react';
import { Opportunity, StudentProfile, ActiveField } from '@/lib/types';
import { calculateScore } from '@/lib/calculateScore';
import { DEMO_PROFILE, DEMO_EMAIL_TEXT, DEMO_OPPORTUNITIES } from '@/lib/demoData';
import Header from '@/components/layout/Header';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import ProfileModal from '@/components/profile/ProfileModal';
import EmailPane from '@/components/dashboard/EmailPane';
import OpportunitiesPane from '@/components/dashboard/OpportunitiesPane';
import PackageModal from '@/components/dashboard/PackageModal';

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Your Name',
  degree: 'B.Tech Computer Science',
  semester: 6,
  cgpa: 7.5,
  skills: ['Python', 'JavaScript', 'React'],
  financial_need: false,
  location_preference: 'Remote',
};

function scoreAndSortOpportunities(
  rawOpportunities: Omit<Opportunity, 'id' | 'score' | 'score_breakdown' | 'is_eligible' | 'evidence_markers'>[],
  profile: StudentProfile
): Opportunity[] {
  return rawOpportunities.map((raw, idx) => {
    const extracted = {
      title: raw.title,
      organization: raw.organization,
      type: raw.type,
      deadline: raw.deadline,
      stipend: raw.stipend,
      min_cgpa: raw.min_cgpa,
      keywords: raw.keywords,
      requires_financial_need: raw.requires_financial_need,
      location: raw.location,
      description: raw.description,
      source_text: raw.source_text,
      is_spam: raw.is_spam,
    };

    if (raw.is_spam) {
      return {
        ...raw,
        id: `opp-${idx}-${Date.now()}`,
        score: 0,
        score_breakdown: { urgency: 0, fit: 0, status: 0, total: 0 },
        is_eligible: false,
        evidence_markers: [],
        status: 'complete' as const,
      } as Opportunity;
    }

    const { score, breakdown, is_eligible } = calculateScore(extracted, profile);

    return {
      ...raw,
      id: `opp-${idx}-${Date.now()}`,
      score,
      score_breakdown: breakdown,
      is_eligible,
      evidence_markers: [],
      status: 'complete' as const,
    } as Opportunity;
  });
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [emailText, setEmailText] = useState('');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [activeField, setActiveField] = useState<ActiveField>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [packageTarget, setPackageTarget] = useState<Opportunity | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  const handleExtract = useCallback(async () => {
    if (!emailText.trim() || isExtracting) return;
    setIsExtracting(true);
    setExtractError(null);
    setActiveField(null);

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

      const scored = scoreAndSortOpportunities(data.opportunities, profile);
      setOpportunities(scored);
      setIsDemoMode(false);
    } catch {
      setExtractError('Network error — check your connection');
    } finally {
      setIsExtracting(false);
    }
  }, [emailText, isExtracting, profile]);

  const handleDemoMode = useCallback(() => {
    setEmailText(DEMO_EMAIL_TEXT);
    const scored = scoreAndSortOpportunities(
      DEMO_OPPORTUNITIES.map((o) => ({
        ...o,
        source_text: o.source_text,
      })),
      DEMO_PROFILE
    );
    setOpportunities(scored);
    setProfile(DEMO_PROFILE);
    setIsDemoMode(true);
    setActiveField(null);
    setExtractError(null);
  }, []);

  const handleProfileSave = useCallback(
    (updated: StudentProfile) => {
      setProfile(updated);
      if (opportunities.length > 0) {
        const rescored = scoreAndSortOpportunities(
          opportunities.map((o) => ({
            title: o.title,
            organization: o.organization,
            type: o.type,
            deadline: o.deadline,
            stipend: o.stipend,
            min_cgpa: o.min_cgpa,
            keywords: o.keywords,
            requires_financial_need: o.requires_financial_need,
            location: o.location,
            description: o.description,
            source_text: o.source_text,
            is_spam: o.is_spam,
            batch_id: o.batch_id,
            created_at: o.created_at,
            status: o.status,
          })),
          updated
        );
        setOpportunities(rescored);
      }
    },
    [opportunities]
  );

  const handleFieldClick = useCallback((opportunityId: string, field: string) => {
    setActiveField((prev) =>
      prev?.opportunityId === opportunityId && prev?.field === field
        ? null
        : { opportunityId, field }
    );
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#050505]">
      <Header
        onDemoMode={handleDemoMode}
        onProfileOpen={() => setProfileModalOpen(true)}
        profileName={profile.name}
        isDemoMode={isDemoMode}
      />

      <div className="flex flex-1 overflow-hidden max-w-screen-2xl mx-auto w-full px-4 sm:px-6 py-4 gap-4">
        {/* Left sidebar */}
        <aside className="hidden lg:flex flex-col w-56 xl:w-64 shrink-0 gap-4">
          <ProfileSidebar profile={profile} onEdit={() => setProfileModalOpen(true)} />
        </aside>

        {/* Email pane */}
        <div className="flex flex-col flex-1 min-w-0 relative">
          {extractError && (
            <div className="mb-3 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-300 flex items-center justify-between">
              <span>{extractError}</span>
              <button onClick={() => setExtractError(null)} className="ml-4 text-red-400 hover:text-red-200">✕</button>
            </div>
          )}
          <EmailPane
            emailText={emailText}
            onEmailChange={setEmailText}
            onExtract={handleExtract}
            isExtracting={isExtracting}
            activeField={activeField}
            opportunities={opportunities}
          />
        </div>

        {/* Opportunities pane */}
        <div className="flex flex-col w-80 xl:w-96 shrink-0">
          <OpportunitiesPane
            opportunities={opportunities}
            isExtracting={isExtracting}
            activeField={activeField}
            profile={profile}
            onFieldClick={handleFieldClick}
            onPreparePackage={setPackageTarget}
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

      {packageTarget && (
        <PackageModal
          opportunity={packageTarget}
          profile={profile}
          onClose={() => setPackageTarget(null)}
        />
      )}
    </div>
  );
}
