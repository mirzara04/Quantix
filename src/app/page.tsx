'use client';

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

gsap.registerPlugin(useGSAP);

const FILTER_TABS = ['All', 'Scholarships', 'Internships', 'Fellowships', 'Competitions', 'Admissions'];

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
  
  const [activeTab, setActiveTab] = useState('All');

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
        />
      )}
    </div>
  );
}
