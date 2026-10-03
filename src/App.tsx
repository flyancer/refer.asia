import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ColorfulHero } from './components/ColorfulHero';
import { StorytellingManifesto } from './components/StorytellingManifesto';
import { ResumeAtsScanner } from './components/ResumeAtsScanner';
import { InsidersDirectory } from './components/InsidersDirectory';
import { SuccessStories } from './components/SuccessStories';
import { KarmaLeaderboard } from './components/KarmaLeaderboard';
import { StudentJobsBoard } from './components/StudentJobsBoard';
import { StudentFaq } from './components/StudentFaq';
import { StudentFooter } from './components/StudentFooter';
import { RequestReferralModal } from './components/RequestReferralModal';
import { StudentPassportDrawer } from './components/StudentPassportDrawer';
import { BuyKarmaModal } from './components/BuyKarmaModal';
import { PostRoleModal } from './components/PostRoleModal';
import { ReferralHistoryModal } from './components/ReferralHistoryModal';
import { KammoChatbot } from './components/KammoChatbot';
import { VERIFIED_INSIDERS, FEATURED_JOBS, INITIAL_REFERRAL_HISTORY } from './data/seed';
import { CompanyId, CurrencyOption, Insider, JobPosition, ReferralSubmission, UserStudentProfile } from './types';
import { setSoundEnabled } from './utils/audio';
import { getKarmaTier } from './utils/karmaTier';

const STORAGE_KEYS = {
  KARMA: 'referasia_karma_v3',
  PROFILE: 'referasia_profile_v3',
  INSIDERS: 'referasia_insiders_v3',
  JOBS: 'referasia_jobs_v3',
  HISTORY: 'referasia_history_v3',
  DAILY_CLAIM: 'referasia_daily_claim_v3',
};

export default function App() {
  const [soundOn, setSoundOn] = useState(true);

  // User Karma Points
  const [karmaBalance, setKarmaBalance] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.KARMA);
    return saved ? Number(saved) : 500;
  });

  // Insiders List
  const [insiders, setInsiders] = useState<Insider[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INSIDERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return VERIFIED_INSIDERS;
      }
    }
    return VERIFIED_INSIDERS;
  });

  // Jobs List
  const [jobs, setJobs] = useState<JobPosition[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return FEATURED_JOBS;
      }
    }
    return FEATURED_JOBS;
  });

  // Referral History List
  const [history, setHistory] = useState<ReferralSubmission[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_REFERRAL_HISTORY;
      }
    }
    return INITIAL_REFERRAL_HISTORY;
  });

  // Active Company Filter
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<CompanyId | 'all'>('all');

  // User Profile
  const [studentProfile, setStudentProfile] = useState<UserStudentProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          skills: parsed.skills && Array.isArray(parsed.skills) && parsed.skills.length > 0
            ? parsed.skills
            : ['React', 'Go', 'Python', 'TypeScript'],
        };
      } catch {
        // default
      }
    }
    return {
      name: 'Aditya Kashyap',
      handle: '@aditya_sys',
      university: 'NIT Trichy / Self-Taught',
      gradYear: '2027',
      city: 'Bengaluru',
      karmaPoints: 500,
      karmaTier: 'Insider',
      skills: ['React', 'Go', 'Python', 'TypeScript'],
      isReferee: false,
      totalRolesPosted: 1,
      unlockedPriorityShield: false,
      activeRequests: INITIAL_REFERRAL_HISTORY.slice(0, 1),
      referralHistory: INITIAL_REFERRAL_HISTORY,
    };
  });

  const handleUpdateSkills = (skills: string[]) => {
    setStudentProfile((prev) => ({
      ...prev,
      skills,
    }));
  };

  // Modals & Drawers State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isBuyKarmaOpen, setIsBuyKarmaOpen] = useState(false);
  const [isPostRoleOpen, setIsPostRoleOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isKammoOpen, setIsKammoOpen] = useState(false);

  // Pre-fill state for referral request
  const [modalTargetCompany, setModalTargetCompany] = useState<CompanyId>('google');
  const [modalTargetInsider, setModalTargetInsider] = useState<Insider | null>(null);
  const [modalTargetJob, setModalTargetJob] = useState<JobPosition | null>(null);
  const [modalInitialResume, setModalInitialResume] = useState<string>('');

  const [canClaimDaily, setCanClaimDaily] = useState<boolean>(() => {
    const lastClaim = localStorage.getItem(STORAGE_KEYS.DAILY_CLAIM);
    if (!lastClaim) return true;
    return Date.now() - Number(lastClaim) > 24 * 60 * 60 * 1000;
  });

  // Local storage synchronization
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.KARMA, karmaBalance.toString());
    setStudentProfile((prev) => ({
      ...prev,
      karmaPoints: karmaBalance,
      karmaTier: getKarmaTier(karmaBalance).name,
      unlockedPriorityShield: karmaBalance >= 1000,
    }));
  }, [karmaBalance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(studentProfile));
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSIDERS, JSON.stringify(insiders));
  }, [insiders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }, [history]);

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  const handleSelectCompanyFrom3D = (companyId: CompanyId) => {
    setSelectedCompanyFilter(companyId);
    const el = document.getElementById('insiders');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRequestReferralForInsider = (insider: Insider) => {
    setModalTargetCompany(insider.companyId);
    setModalTargetInsider(insider);
    setModalTargetJob(null);
    setModalInitialResume('');
    setIsRequestModalOpen(true);
  };

  const handleApplyForJob = (job: JobPosition) => {
    setModalTargetCompany(job.companyId);
    setModalTargetJob(job);
    setModalTargetInsider(null);
    setModalInitialResume('');
    setIsRequestModalOpen(true);
  };

  const handleRequestReferralWithData = (companyId: CompanyId, resumeSample: string) => {
    setModalTargetCompany(companyId);
    setModalTargetInsider(null);
    setModalTargetJob(null);
    setModalInitialResume(resumeSample);
    setIsRequestModalOpen(true);
  };

  // Submit Referral & Update History
  const handleSubmitReferral = (submission: ReferralSubmission, karmaStake: number) => {
    setKarmaBalance((prev) => Math.max(0, prev - karmaStake));

    setHistory((prev) => [submission, ...prev]);

    setStudentProfile((prev) => ({
      ...prev,
      activeRequests: [submission, ...prev.activeRequests],
      referralHistory: [submission, ...prev.referralHistory],
    }));

    // Increment insider referral count
    setInsiders((prev) =>
      prev.map((ins) =>
        ins.companyId === submission.targetCompanyId
          ? { ...ins, referralsCompleted: ins.referralsCompleted + 1 }
          : ins
      )
    );
  };

  // Buy Karma Starter Pack (₹99 INR / S$1.60)
  const handleSuccessBuyKarma = (pointsAwarded: number, currency: CurrencyOption) => {
    setKarmaBalance((prev) => prev + pointsAwarded);
  };

  // Referee Posts a Role and Earns +250 Karma
  const handleSuccessPostRole = (newJob: JobPosition, karmaEarned: number) => {
    setJobs((prev) => [newJob, ...prev]);
    setKarmaBalance((prev) => prev + karmaEarned);

    setStudentProfile((prev) => ({
      ...prev,
      isReferee: true,
      totalRolesPosted: prev.totalRolesPosted + 1,
    }));
  };

  // Daily Telemetry Reward
  const handleClaimDailyReward = () => {
    setKarmaBalance((prev) => prev + 50);
    localStorage.setItem(STORAGE_KEYS.DAILY_CLAIM, Date.now().toString());
    setCanClaimDaily(false);
  };

  const scrollToWhy = () => {
    const el = document.getElementById('why');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToScanner = () => {
    const el = document.getElementById('scanner');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="top" className="min-h-screen bg-white text-[#0F172A] selection:bg-[#1E3A8A]/20 selection:text-[#1E3A8A]">
      {/* Top Navbar */}
      <Navbar
        soundEnabled={soundOn}
        onToggleSound={handleToggleSound}
        karmaBalance={karmaBalance}
        onOpenPassport={() => setIsPassportOpen(true)}
        onOpenReferralModal={() => {
          setModalTargetInsider(null);
          setModalTargetJob(null);
          setModalInitialResume('');
          setIsRequestModalOpen(true);
        }}
        onOpenBuyKarma={() => setIsBuyKarmaOpen(true)}
        onOpenPostRole={() => setIsPostRoleOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenKammo={() => setIsKammoOpen(true)}
      />

      <main>
        {/* Spatial 3D Storytelling Hero */}
        <ColorfulHero
          onOpenReferralModal={() => {
            setModalTargetInsider(null);
            setModalTargetJob(null);
            setModalInitialResume('');
            setIsRequestModalOpen(true);
          }}
          onScrollToScanner={scrollToScanner}
          onScrollToWhy={scrollToWhy}
          onOpenBuyKarma={() => setIsBuyKarmaOpen(true)}
          onOpenPostRole={() => setIsPostRoleOpen(true)}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenKammo={() => setIsKammoOpen(true)}
          selectedCompanyId={selectedCompanyFilter}
          onSelectCompany={handleSelectCompanyFrom3D}
        />

        {/* Why Zero University Style Storytelling Manifesto */}
        <StorytellingManifesto />

        {/* Interactive AI ATS Resume Scanner vs Referral Boost */}
        <ResumeAtsScanner onRequestReferralWithData={handleRequestReferralWithData} />

        {/* Verified Referees Directory (Refer.asia content) */}
        <InsidersDirectory
          insiders={insiders}
          selectedCompanyFilter={selectedCompanyFilter}
          onCompanyFilterChange={(c) => setSelectedCompanyFilter(c)}
          onRequestReferral={handleRequestReferralForInsider}
        />

        {/* Success Stories Testimonials with Glassmorphism */}
        <SuccessStories
          onOpenReferralModal={() => {
            setModalTargetInsider(null);
            setModalTargetJob(null);
            setModalInitialResume('');
            setIsRequestModalOpen(true);
          }}
        />

        {/* Top 10 Community Karma Leaderboard (Competitive Participation) */}
        <KarmaLeaderboard
          userKarma={karmaBalance}
          userName={studentProfile.name}
          userUniversity={studentProfile.university}
          onOpenPostRole={() => setIsPostRoleOpen(true)}
          onOpenBuyKarma={() => setIsBuyKarmaOpen(true)}
          onOpenReferralModal={() => {
            setModalTargetInsider(null);
            setModalTargetJob(null);
            setModalInitialResume('');
            setIsRequestModalOpen(true);
          }}
          onRequestReferralForInsider={handleRequestReferralForInsider}
        />

        {/* Curated 2027 Asian Student & Candidate Roles */}
        <StudentJobsBoard
          jobs={jobs}
          userProfile={studentProfile}
          onUpdateSkills={handleUpdateSkills}
          onApplyForJob={handleApplyForJob}
          onOpenPostRole={() => setIsPostRoleOpen(true)}
          onOpenPassport={() => setIsPassportOpen(true)}
        />

        {/* Student FAQ & Playbook */}
        <StudentFaq />
      </main>

      {/* Footer */}
      <StudentFooter />

      {/* Referral Request Ticket Modal */}
      <RequestReferralModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        userKarmaBalance={karmaBalance}
        initialCompanyId={modalTargetCompany}
        initialInsider={modalTargetInsider}
        initialJob={modalTargetJob}
        initialResumeText={modalInitialResume}
        onOpenBuyKarma={() => {
          setIsRequestModalOpen(false);
          setIsBuyKarmaOpen(true);
        }}
        onSubmitReferral={handleSubmitReferral}
      />

      {/* Buy Karma Starter Pack Modal (₹99 INR & Asian Currencies) */}
      <BuyKarmaModal
        isOpen={isBuyKarmaOpen}
        onClose={() => setIsBuyKarmaOpen(false)}
        onSuccessBuy={handleSuccessBuyKarma}
      />

      {/* Post a Role & Earn Referee Karma Modal */}
      <PostRoleModal
        isOpen={isPostRoleOpen}
        onClose={() => setIsPostRoleOpen(false)}
        currentKarma={karmaBalance}
        onSuccessPostRole={handleSuccessPostRole}
      />

      {/* Detailed Referral History Modal */}
      <ReferralHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
      />

      {/* Slide-over Member Passport Drawer */}
      <StudentPassportDrawer
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        profile={studentProfile}
        onUpdateSkills={handleUpdateSkills}
        onClaimDailyReward={handleClaimDailyReward}
        canClaimDaily={canClaimDaily}
        onOpenBuyKarma={() => {
          setIsPassportOpen(false);
          setIsBuyKarmaOpen(true);
        }}
        onOpenPostRole={() => {
          setIsPassportOpen(false);
          setIsPostRoleOpen(true);
        }}
        onOpenHistory={() => {
          setIsPassportOpen(false);
          setIsHistoryOpen(true);
        }}
      />

      {/* Kammo Gemini Chatbot */}
      <KammoChatbot
        isOpen={isKammoOpen}
        onToggle={() => setIsKammoOpen((prev) => !prev)}
        onOpenReferralModal={() => {
          setIsRequestModalOpen(true);
        }}
        onOpenBuyKarma={() => {
          setIsBuyKarmaOpen(true);
        }}
        onOpenAtsScanner={() => {
          scrollToScanner();
        }}
      />
    </div>
  );
}
