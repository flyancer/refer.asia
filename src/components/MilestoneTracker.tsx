import React, { useState } from 'react';
import { 
  Send, 
  Flame, 
  Zap, 
  ShieldCheck, 
  Award, 
  Code2, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight,
  Info
} from 'lucide-react';
import { UserStudentProfile } from '../types';
import { playTactileClick, playSuccessChime } from '../utils/audio';

export interface MilestoneBadge {
  id: string;
  title: string;
  description: string;
  requirement: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  isUnlocked: boolean;
  unlockedDate?: string;
  perkDescription: string;
}

interface MilestoneTrackerProps {
  profile: UserStudentProfile;
  onOpenBuyKarma?: () => void;
  onOpenPostRole?: () => void;
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({
  profile,
  onOpenBuyKarma,
  onOpenPostRole,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<MilestoneBadge | null>(null);

  const totalReferrals = (profile.activeRequests?.length || 0) + (profile.referralHistory?.length || 0);
  const skillsCount = profile.skills?.length || 0;
  const karma = profile.karmaPoints || 0;
  const rolesPosted = profile.totalRolesPosted || 0;

  const badges: MilestoneBadge[] = [
    {
      id: 'first-referral',
      title: 'First Referral',
      description: 'Submitted your first direct employee vouch request.',
      requirement: 'Dispatch at least 1 referral request to a verified insider.',
      icon: Send,
      iconColor: 'text-[#2563EB]',
      bgColor: 'bg-[#EFF6FF]',
      borderColor: 'border-[#BFDBFE]',
      isUnlocked: totalReferrals >= 1,
      unlockedDate: totalReferrals >= 1 ? 'Audited On-Chain' : undefined,
      perkDescription: 'Bypasses standard public ATS queue with verified employee tracking.',
    },
    {
      id: 'speedy-applicant',
      title: 'Speedy Applicant',
      description: 'Maintained fast dispatch readiness and configured technical skills.',
      requirement: 'Configure 3+ technical skills & submit within active SLA queues.',
      icon: Zap,
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      isUnlocked: skillsCount >= 3 && (totalReferrals >= 1 || karma >= 500),
      unlockedDate: skillsCount >= 3 && (totalReferrals >= 1 || karma >= 500) ? 'Active Speed Pass' : undefined,
      perkDescription: 'Prioritizes your dossier in referee 24-hr SLA review queues.',
    },
    {
      id: 'top-contributor',
      title: 'Top Contributor',
      description: 'Strengthened the Asian tech network by staking karma or posting roles.',
      requirement: 'Post 1 verified role opening or achieve 500+ Karma points.',
      icon: Flame,
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      isUnlocked: rolesPosted >= 1 || karma >= 500,
      unlockedDate: rolesPosted >= 1 || karma >= 500 ? 'Level 2 Catalyst' : undefined,
      perkDescription: 'Increases peer invitation karma bonus and unlocks referee status.',
    },
    {
      id: 'skill-champion',
      title: 'Skill Champion',
      description: 'Equipped 4+ validated technical proficiencies on your member passport.',
      requirement: 'Add 4 or more verified skills (e.g. React, Go, Python, TypeScript).',
      icon: Code2,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      isUnlocked: skillsCount >= 4,
      unlockedDate: skillsCount >= 4 ? `${skillsCount} Stacks Verified` : undefined,
      perkDescription: 'Enables 1-click tailored resume keyword alignment on job cards.',
    },
    {
      id: 'vip-vouch-shield',
      title: 'VIP Vouch Shield',
      description: 'Attained 1,000+ Karma to unlock the lifetime reciprocal job guarantee.',
      requirement: 'Accumulate 1,000 Karma points through referrals, posting, or packs.',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      isUnlocked: karma >= 1000,
      unlockedDate: karma >= 1000 ? 'Lifetime Shield Active' : undefined,
      perkDescription: 'Guarantees priority referral support from senior referees on career shifts.',
    },
    {
      id: 'pinnacle-archon',
      title: 'Pan-Asian Archon',
      description: 'Recognized among top tier community catalysts across Asia-Pacific.',
      requirement: 'Reach 2,500 Karma or complete 5+ successful referral loops.',
      icon: Award,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      isUnlocked: karma >= 2500 || totalReferrals >= 5,
      unlockedDate: karma >= 2500 || totalReferrals >= 5 ? 'Elite Tier Achieved' : undefined,
      perkDescription: 'Direct access to executive talent leads and bespoke engineering roles.',
    },
  ];

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;
  const progressPercent = Math.round((unlockedCount / badges.length) * 100);

  const handleBadgeClick = (badge: MilestoneBadge) => {
    if (badge.isUnlocked) {
      playSuccessChime();
    } else {
      playTactileClick();
    }
    setSelectedBadge(selectedBadge?.id === badge.id ? null : badge);
  };

  return (
    <div className="p-4 rounded-3xl border border-[#E2E8F0] bg-white shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E3A8A] flex items-center justify-center">
            <Award className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div>
            <div className="text-xs font-display font-bold text-[#0F172A]">
              Member Milestone Badges
            </div>
            <div className="text-[10px] text-[#64748B] font-mono">
              Reputation & Achievement Milestones
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono font-semibold text-[#1E3A8A]">
          <Sparkles className="w-3 h-3 text-[#2563EB]" />
          <span>{unlockedCount} / {badges.length} Unlocked</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden p-0.5 border border-[#CBD5E1]/60">
          <div
            className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B]">
          <span>{progressPercent}% Milestone Progress</span>
          <span>{badges.length - unlockedCount} remaining to Pinnacle</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {badges.map((badge) => {
          const Icon = badge.icon;
          const isSelected = selectedBadge?.id === badge.id;

          return (
            <button
              key={badge.id}
              type="button"
              onClick={() => handleBadgeClick(badge)}
              className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between group ${
                badge.isUnlocked
                  ? `${badge.bgColor} ${badge.borderColor} hover:shadow-xs ${isSelected ? 'ring-2 ring-[#1E3A8A]' : ''}`
                  : `bg-[#F8FAFC] border-[#E2E8F0] opacity-75 hover:opacity-100 ${isSelected ? 'ring-2 ring-slate-400' : ''}`
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center border shadow-2xs ${
                      badge.isUnlocked
                        ? `bg-white ${badge.borderColor} ${badge.iconColor}`
                        : 'bg-slate-200 border-slate-300 text-slate-500'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>

                  {badge.isUnlocked ? (
                    <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-700 bg-white/90 px-1.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      <span>UNLOCKED</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-mono font-medium text-slate-500 bg-white/60 px-1.5 py-0.5 rounded-full border border-slate-200">
                      <Lock className="w-2.5 h-2.5" />
                      <span>LOCKED</span>
                    </span>
                  )}
                </div>

                <div className="font-display font-bold text-xs text-[#0F172A] leading-tight mb-1">
                  {badge.title}
                </div>
                <p className="text-[10px] text-[#64748B] leading-snug line-clamp-2">
                  {badge.description}
                </p>
              </div>

              {badge.isUnlocked && badge.unlockedDate && (
                <div className="mt-2 text-[9px] font-mono text-[#1E3A8A] font-semibold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-[#2563EB]" />
                  <span className="truncate">{badge.unlockedDate}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Badge Detail Drawer / Callout */}
      {selectedBadge && (
        <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-2 animate-fadeIn text-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${selectedBadge.isUnlocked ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <strong className="text-[#0F172A] font-bold">{selectedBadge.title}</strong>
            </div>
            <span className="text-[10px] font-mono text-[#64748B]">
              {selectedBadge.isUnlocked ? 'Earned Milestone' : 'Upcoming Goal'}
            </span>
          </div>

          <div className="text-[11px] text-[#475569] space-y-1">
            <div>
              <span className="font-semibold text-[#0F172A]">Requirement: </span>
              {selectedBadge.requirement}
            </div>
            <div>
              <span className="font-semibold text-[#1E3A8A]">Active Benefit: </span>
              {selectedBadge.perkDescription}
            </div>
          </div>

          {!selectedBadge.isUnlocked && (
            <div className="pt-2 flex items-center gap-2">
              {onOpenBuyKarma && (
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    onOpenBuyKarma();
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-[#1E3A8A] hover:bg-[#1E40AF] text-white rounded-lg transition-colors"
                >
                  Buy Karma Pack (₹99)
                </button>
              )}
              {onOpenPostRole && (
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    onOpenPostRole();
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] rounded-lg transition-colors"
                >
                  Post Role (+250)
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
