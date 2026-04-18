'use client';

import { useState, useRef } from 'react';
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

gsap.registerPlugin(useGSAP);

function scoreAndSort(opps: Opportunity[], profile: StudentProfile) {
  return opps.map(raw => {
    if (raw.is_spam) {
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
}

export default function DashboardPage() {
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const [profile, setProfile] = useState<StudentProfile>(DEMO_PROFILE);
  const [emailText, setEmailText] = useState(DEMO_EMAIL_TEXT);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const mainDashRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Intro fade-in when loading screen finishes
  useGSAP(() => {
    if (isAppLoaded && mainDashRef.current) {
      gsap.fromTo(mainDashRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [isAppLoaded]);

  // GSAP Stagger Entrance for Ranked Opportunities
  useGSAP(() => {
    if (opportunities.length > 0 && !selectedOppId && listRef.current) {
      const cards = gsap.utils.toArray('.opp-card-wrapper');
      gsap.fromTo(cards, 
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "power3.out",
          clearProps: "all" 
        }
      );
    }
  }, [opportunities, selectedOppId]);

  const handleScan = () => {
    setIsExtracting(true);
    setTimeout(() => {
      const scored = scoreAndSort(DEMO_OPPORTUNITIES as Opportunity[], profile);
      setOpportunities(scored);
      setIsExtracting(false);
      setSelectedOppId(null);
    }, 1500);
  };

  const handleSaveProfile = (updated: StudentProfile) => {
    setProfile(updated);
    // Real-time recalculation if opportunities exist
    if (opportunities.length > 0) {
      const rescored = scoreAndSort(opportunities, updated);
      setOpportunities(rescored);
    }
  };

  const selectedOpp = opportunities.find(o => o.id === selectedOppId);

  return (
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
                <h2 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">Ranked Results</h2>
                
                {opportunities.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-white/30 text-sm">
                    <div className="w-16 h-16 rounded-full border border-white/5 bg-white/5 flex items-center justify-center mb-4">
                      <div className="w-8 h-8 border-2 border-transparent border-t-blue-500 rounded-full animate-spin opacity-50" />
                    </div>
                    Waiting for ingestion stream...
                  </div>
                ) : (
                  <div ref={listRef} className="flex flex-col pb-20">
                    {opportunities.map((opp) => (
                      <div key={opp.id} className="opp-card-wrapper relative z-10 hover:z-20">
                        <OpportunityCard
                          opportunity={opp}
                          isSelected={selectedOppId === opp.id}
                          onClick={() => setSelectedOppId(opp.id)}
                        />
                      </div>
                    ))}
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
        />
      )}
    </div>
  );
}
