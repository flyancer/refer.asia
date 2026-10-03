import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Crown, 
  Flame, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  PlusCircle, 
  Briefcase, 
  Search, 
  ArrowUpRight, 
  Users, 
  Zap, 
  X
} from 'lucide-react';
import { TOP_10_KARMA_LEADERS } from '../data/seed';
import { LeaderboardCategory, LeaderboardMember, Insider } from '../types';
import { playTactileClick } from '../utils/audio';
import { KarmaTierBadge } from './KarmaTierBadge';

interface KarmaLeaderboardProps {
  userKarma: number;
  userName: string;
  userUniversity: string;
  onOpenPostRole: () => void;
  onOpenBuyKarma: () => void;
  onOpenReferralModal: () => void;
  onRequestReferralForInsider?: (insider: Insider) => void;
}

export const KarmaLeaderboard: React.FC<KarmaLeaderboardProps> = ({
  userKarma,
  userName,
  userUniversity,
  onOpenPostRole,
  onOpenBuyKarma,
  onOpenReferralModal,
  onRequestReferralForInsider,
}) => {
  const [activeCategory, setActiveCategory] = useState<LeaderboardCategory>('all-time');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<LeaderboardMember | null>(null);

  // Filter members based on category and search query
  const filteredLeaders = useMemo(() => {
    let list = [...TOP_10_KARMA_LEADERS];

    if (activeCategory === 'month-sprint') {
      list.sort((a, b) => b.weeklyKarmaGain - a.weeklyKarmaGain);
    } else if (activeCategory === 'referees') {
      list.sort((a, b) => b.rolesPosted - a.rolesPosted || b.hiresConfirmed - a.hiresConfirmed);
    } else if (activeCategory === 'rising') {
      list.sort((a, b) => (b.weeklyKarmaGain / b.karmaPoints) - (a.weeklyKarmaGain / a.karmaPoints));
    } else {
      list.sort((a, b) => b.karmaPoints - a.karmaPoints);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((m) => 
        m.name.toLowerCase().includes(q) ||
        m.companyName.toLowerCase().includes(q) ||
        m.cityHub.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.topSkill.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeCategory, searchQuery]);

  // Top 3 champions for podium
  const top1 = TOP_10_KARMA_LEADERS[0];
  const top2 = TOP_10_KARMA_LEADERS[1];
  const top3 = TOP_10_KARMA_LEADERS[2];

  // User progress towards 1,000 karma guarantee
  const targetKarma = 1000;
  const userProgressPercent = Math.min(100, Math.round((userKarma / targetKarma) * 100));
  const pointsNeeded = Math.max(0, targetKarma - userKarma);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D] flex items-center justify-center font-display font-extrabold text-sm shadow-sm ring-2 ring-[#FDE68A]">
          <Crown className="w-4 h-4 text-[#D97706]" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] flex items-center justify-center font-display font-extrabold text-sm shadow-sm ring-2 ring-[#E2E8F0]">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-[#EFF6FF] text-[#1E3A8A] border border-[#93C5FD] flex items-center justify-center font-display font-extrabold text-sm shadow-sm ring-2 ring-[#BFDBFE]">
          3
        </div>
      );
    }
    return (
      <div className="w-7 h-7 rounded-full bg-[#F8FAFC] text-[#64748B] flex items-center justify-center font-mono text-xs border border-[#E2E8F0]">
        {rank}
      </div>
    );
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Grandmaster':
        return 'border-[#93C5FD] text-[#1E3A8A] bg-[#EFF6FF]';
      case 'Archon Referee':
        return 'border-[#BFDBFE] text-[#1D4ED8] bg-[#EFF6FF]';
      case 'Oracle Scout':
        return 'border-[#CBD5E1] text-[#0F172A] bg-[#F8FAFC]';
      case 'Elite Insider':
        return 'border-[#E2E8F0] text-[#334155] bg-white';
      case 'Rising Prodigy':
        return 'border-sky-300 text-sky-700 bg-sky-50';
      default:
        return 'border-[#E2E8F0] text-[#64748B] bg-[#F8FAFC]';
    }
  };

  const handleActionForMember = (member: LeaderboardMember) => {
    playTactileClick();
    if (onRequestReferralForInsider) {
      const syntheticInsider: Insider = {
        id: member.id,
        name: member.name,
        handle: member.handle,
        role: member.role,
        companyId: member.companyId,
        companyName: member.companyName,
        department: member.topSkill,
        cityHub: `${member.cityHub}, ${member.country}`,
        referralsCompleted: member.referralsCompleted,
        karmaScore: member.karmaPoints,
        acceptanceRate: member.acceptanceRate,
        universityAlum: member.cityHub,
        bio: member.bio,
        verified: member.verified,
        tags: [member.topSkill, 'Top 10 Leaderboard', member.badgeTier],
        availableSlots: 3,
      };
      onRequestReferralForInsider(syntheticInsider);
    } else {
      onOpenReferralModal();
    }
  };

  return (
    <section id="leaderboard" className="py-24 bg-[#FFFFFF] relative border-t border-[#E2E8F0] overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#EFF6FF] blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E3A8A] font-mono text-xs tracking-wider uppercase mb-3 font-semibold shadow-2xs">
              <Trophy className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Pan-Asia Community Reputation Network</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0A2540] tracking-tight">
              The <span className="gradient-text-blue">Karma Leaderboard</span>
            </h2>
            <p className="mt-3 text-[#475569] text-sm sm:text-base max-w-2xl font-normal leading-relaxed">
              Where referrals aren’t corporate favors—they’re skin-in-the-game stakes. The top 10 verified referees and tech scouts across Bengaluru, Singapore, Tokyo, and Seoul powering sovereign talent mobility.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2 shadow-2xs">
              <Zap className="w-4 h-4 text-[#2563EB]" />
              <div>
                <div className="font-mono text-xs font-bold text-[#0F172A]">42,850 Pts</div>
                <div className="text-[10px] text-[#64748B] uppercase tracking-wider font-mono">Total Top 10 Karma</div>
              </div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#1E3A8A]" />
              <div>
                <div className="font-mono text-xs font-bold text-[#1E3A8A]">10 / 10 Active</div>
                <div className="text-[10px] text-[#64748B] uppercase tracking-wider font-mono">Lifetime Shields</div>
              </div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2 shadow-2xs">
              <Users className="w-4 h-4 text-[#0F172A]" />
              <div>
                <div className="font-mono text-xs font-bold text-[#0F172A]">108 Hires</div>
                <div className="text-[10px] text-[#64748B] uppercase tracking-wider font-mono">Direct Placements</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Champions Podium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 items-end">
          
          {/* Rank #2: Vikramaditya Sharma (Silver) */}
          <div className="order-2 md:order-1 relative rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] p-6 flex flex-col justify-between hover:border-[#1E3A8A] transition-all duration-300 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-[#E2E8F0] border border-[#CBD5E1] flex items-center justify-center font-display font-extrabold text-[#0F172A] text-lg">
                    VS
                  </div>
                  <span className="absolute -top-1 -right-1 text-base">{top2.flag}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-[#0F172A] text-base">{top2.name}</h3>
                    {top2.verified && <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />}
                  </div>
                  <div className="text-xs text-[#64748B] font-mono">{top2.handle}</div>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#E2E8F0] text-[#334155] border border-[#CBD5E1] flex items-center justify-center font-mono font-bold text-xs">
                #2
              </div>
            </div>

            <div className="my-4 pt-3 border-t border-[#E2E8F0]">
              <div className="text-xs font-semibold text-[#0F172A]">{top2.role}</div>
              <div className="text-xs text-[#1E3A8A] font-mono mt-0.5">{top2.companyName} • {top2.cityHub}</div>
            </div>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-[#E2E8F0]">
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-mono block">Karma Points</span>
                <span className="font-mono text-base font-bold text-[#0F172A]">{top2.karmaPoints.toLocaleString()}</span>
              </div>
              <button
                onClick={() => handleActionForMember(top2)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#1E3A8A] hover:text-white text-[#1E3A8A] border border-[#CBD5E1] text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs"
              >
                <span>Vouch</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Rank #1: Tanmay Sen (Gold Champion) */}
          <div className="order-1 md:order-2 relative rounded-3xl bg-white border-2 border-[#1E3A8A] p-7 flex flex-col justify-between shadow-xl shadow-blue-900/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#1E3A8A] text-white font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md">
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>Grand Champion #1</span>
            </div>

            <div className="flex items-start justify-between mt-2">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] border border-[#93C5FD] flex items-center justify-center font-display font-extrabold text-[#1E3A8A] text-xl">
                    TS
                  </div>
                  <span className="absolute -top-1 -right-1 text-base">{top1.flag}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-[#0A2540] text-lg">{top1.name}</h3>
                    {top1.verified && <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />}
                  </div>
                  <div className="text-xs text-[#64748B] font-mono">{top1.handle}</div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D] flex items-center justify-center font-mono font-bold text-sm">
                #1
              </div>
            </div>

            <div className="my-4 pt-3 border-t border-[#E2E8F0]">
              <div className="text-xs font-semibold text-[#0F172A]">{top1.role}</div>
              <div className="text-xs text-[#1E3A8A] font-mono mt-0.5 font-semibold">{top1.companyName} • {top1.cityHub}</div>
            </div>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-[#E2E8F0]">
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-mono block">Karma Points</span>
                <span className="font-mono text-xl font-extrabold text-[#1E3A8A]">{top1.karmaPoints.toLocaleString()}</span>
              </div>
              <button
                onClick={() => handleActionForMember(top1)}
                className="px-4 py-2 rounded-xl bg-[#1E3A8A] hover:bg-[#1E40AF] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Request Vouch</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Rank #3: Wei Lin (Bronze) */}
          <div className="order-3 relative rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] p-6 flex flex-col justify-between hover:border-[#1E3A8A] transition-all duration-300 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center font-display font-extrabold text-[#1E3A8A] text-lg">
                    WL
                  </div>
                  <span className="absolute -top-1 -right-1 text-base">{top3.flag}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display font-bold text-[#0F172A] text-base">{top3.name}</h3>
                    {top3.verified && <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />}
                  </div>
                  <div className="text-xs text-[#64748B] font-mono">{top3.handle}</div>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#1E3A8A] border border-[#93C5FD] flex items-center justify-center font-mono font-bold text-xs">
                #3
              </div>
            </div>

            <div className="my-4 pt-3 border-t border-[#E2E8F0]">
              <div className="text-xs font-semibold text-[#0F172A]">{top3.role}</div>
              <div className="text-xs text-[#1E3A8A] font-mono mt-0.5">{top3.companyName} • {top3.cityHub}</div>
            </div>

            <div className="flex items-center justify-between text-xs pt-3 border-t border-[#E2E8F0]">
              <div>
                <span className="text-[10px] text-[#64748B] uppercase font-mono block">Karma Points</span>
                <span className="font-mono text-base font-bold text-[#0F172A]">{top3.karmaPoints.toLocaleString()}</span>
              </div>
              <button
                onClick={() => handleActionForMember(top3)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#1E3A8A] hover:text-white text-[#1E3A8A] border border-[#CBD5E1] text-xs font-semibold transition-all flex items-center gap-1 shadow-2xs"
              >
                <span>Vouch</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* Live User Progress & Ladder Motivation Box */}
        <div className="mb-12 p-6 rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] relative overflow-hidden shadow-sm">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E3A8A] font-mono text-xs font-semibold">
                  YOUR REFER.ASIA PROFILE
                </span>
                <span className="text-xs text-[#64748B]">Current Standing: <strong className="text-[#0F172A]">Rank #42 in Asia</strong></span>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="font-display font-extrabold text-[#0A2540] text-lg sm:text-xl">
                  {userName}
                </h3>
                <span className="text-[#64748B] font-mono text-xs">@aditya_sys</span>
                <KarmaTierBadge karmaPoints={userKarma} size="xs" />
                <span className="text-[#64748B] font-normal text-xs sm:text-sm">({userUniversity})</span>
                <span className="px-2 py-0.5 rounded bg-white text-[#1E3A8A] font-mono text-xs font-bold border border-[#CBD5E1]">
                  {userKarma} Karma
                </span>
              </div>
              
              {/* Progress bar towards 1,000 points Lifetime Shield */}
              <div className="w-full max-w-md pt-2">
                <div className="flex items-center justify-between text-xs font-mono text-[#64748B] mb-1.5">
                  <span>Progress to 1,000 Pts Shield:</span>
                  <span className="text-[#1E3A8A] font-bold">{userProgressPercent}% ({userKarma} / 1,000 pts)</span>
                </div>
                <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden border border-[#CBD5E1]">
                  <div 
                    className="h-full bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] rounded-full transition-all duration-500"
                    style={{ width: `${userProgressPercent}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-[#64748B]">
                  {pointsNeeded === 0 ? (
                    <span className="text-[#1E3A8A] font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                      Congratulations! You unlocked the Lifetime Priority Reciprocal Vouch Shield!
                    </span>
                  ) : (
                    <span>
                      Earn <strong className="text-[#1E3A8A]">{pointsNeeded} more points</strong> to unlock your Lifetime Reciprocal Vouch Shield.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Competitive Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenPostRole();
                }}
                className="px-4 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-display font-bold text-xs transition-all shadow-sm flex items-center gap-2 active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>Post a Role (+250 Karma)</span>
              </button>
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenBuyKarma();
                }}
                className="px-4 py-2.5 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] text-[#1E3A8A] font-display font-semibold text-xs transition-colors flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-[#2563EB]" />
                <span>Buy Starter Pack (₹99 / 500 Pts)</span>
              </button>
              <button
                onClick={() => {
                  playTactileClick();
                  onOpenReferralModal();
                }}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-display font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Briefcase className="w-4 h-4 text-[#64748B]" />
                <span>Submit Referral</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] overflow-x-auto">
            <button
              onClick={() => {
                playTactileClick();
                setActiveCategory('all-time');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'all-time'
                  ? 'bg-[#1E3A8A] text-white shadow-xs font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              All-Time Champions
            </button>
            <button
              onClick={() => {
                playTactileClick();
                setActiveCategory('month-sprint');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategory === 'month-sprint'
                  ? 'bg-[#1E3A8A] text-white shadow-xs font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Sprint Movers</span>
            </button>
            <button
              onClick={() => {
                playTactileClick();
                setActiveCategory('referees');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'referees'
                  ? 'bg-[#1E3A8A] text-white shadow-xs font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Top Referees (Roles Posted)
            </button>
            <button
              onClick={() => {
                playTactileClick();
                setActiveCategory('rising');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === 'rising'
                  ? 'bg-[#1E3A8A] text-white shadow-xs font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Rising Talent Catalysts
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member, company, city..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1E3A8A] transition-colors"
            />
          </div>
        </div>

        {/* Top 10 Ranked List Table / Cards */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-mono uppercase tracking-wider text-[#64748B]">
                  <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                  <th className="py-3.5 px-4">Community Member</th>
                  <th className="py-3.5 px-4">Hub & Company</th>
                  <th className="py-3.5 px-4">Tier & Milestone</th>
                  <th className="py-3.5 px-4 text-center">Proof-of-Work</th>
                  <th className="py-3.5 px-4 text-right">Karma Points</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredLeaders.map((member) => (
                  <tr 
                    key={member.id} 
                    className="hover:bg-[#F8FAFC] transition-colors group cursor-pointer"
                    onClick={() => setSelectedMember(member)}
                  >
                    {/* Rank */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">
                        {getRankBadge(member.rank)}
                      </div>
                    </td>

                    {/* Member details */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center font-display font-bold text-[#1E3A8A] text-sm">
                          {member.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-bold text-[#0F172A] text-sm group-hover:text-[#1E3A8A] transition-colors">
                              {member.name}
                            </span>
                            <span className="text-base" title={member.country}>{member.flag}</span>
                            {member.verified && (
                              <span title="Verified Tech Insider">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-[#64748B] font-mono">{member.handle}</span>
                            <KarmaTierBadge karmaPoints={member.karmaPoints} size="xs" />
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Hub & Company */}
                    <td className="py-4 px-4">
                      <div className="text-xs font-semibold text-[#0F172A]">{member.role}</div>
                      <div className="text-xs text-[#1E3A8A] font-mono">{member.companyName} • {member.cityHub}</div>
                    </td>

                    {/* Tier badge & Priority Shield status */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono border font-semibold ${getTierColor(member.badgeTier)}`}>
                          {member.badgeTier}
                        </span>
                        {member.hasPriorityShield && (
                          <div className="flex items-center gap-1 text-[11px] text-[#1E3A8A] font-mono">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                            <span>Reciprocal Shield</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Proof-of-Work breakdown */}
                    <td className="py-4 px-4 text-center">
                      <div className="inline-flex items-center gap-2 text-xs font-mono">
                        <span className="px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155]" title="Referrals completed">
                          <strong>{member.referralsCompleted}</strong> refs
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E3A8A]" title="Roles posted">
                          <strong>{member.rolesPosted}</strong> roles
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[#2563EB]" title="Candidates hired">
                          <strong>{member.hiresConfirmed}</strong> hires
                        </span>
                      </div>
                    </td>

                    {/* Karma points with weekly gain */}
                    <td className="py-4 px-4 text-right">
                      <div className="font-display font-extrabold text-base text-[#0F172A]">
                        {member.karmaPoints.toLocaleString()} <span className="text-xs font-mono text-[#64748B]">pts</span>
                      </div>
                      <div className="text-[11px] font-mono text-[#1E3A8A] flex items-center justify-end gap-1 font-semibold">
                        <TrendingUp className="w-3 h-3 text-[#2563EB]" />
                        <span>+{member.weeklyKarmaGain} wk</span>
                      </div>
                    </td>

                    {/* Action button */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActionForMember(member);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#1E3A8A] hover:text-white text-[#1E3A8A] border border-[#CBD5E1] hover:border-[#1E3A8A] text-xs font-semibold transition-all inline-flex items-center gap-1 shadow-2xs"
                      >
                        <span>Vouch</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Competitive Integrity & Karma Economy Rules Box */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1E3A8A] mb-3">
              <Briefcase className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-[#0A2540] text-sm mb-1">
              Referee Role Posting (+250 to +500 Pts)
            </h4>
            <p className="text-[#475569] text-xs leading-relaxed">
              When employees post open positions from Google, Grab, Flipkart, or their startups, they earn instant Karma rewards that unlock their own career safety net.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-[#0A2540] text-sm mb-1">
              1,000 Karma Lifetime Shield Rule
            </h4>
            <p className="text-[#475569] text-xs leading-relaxed">
              Any member crossing 1,000 points unlocks the Reciprocal Vouch Shield: when you need your next job move, the Refer.asia executive network vouches for you with top priority.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1E3A8A] mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-display font-bold text-[#0A2540] text-sm mb-1">
              Starter Pack Self-Referrals (₹99 INR)
            </h4>
            <p className="text-[#475569] text-xs leading-relaxed">
              Candidates can refer themselves by purchasing a 500 Karma starter pack (₹99 INR / S$1.60 / $1.20 USD). Skin-in-the-game prevents spam while ensuring equal access for non-target college builders.
            </p>
          </div>
        </div>

      </div>

      {/* Member Dossier Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#CBD5E1] shadow-2xl p-6 relative">
            <button
              onClick={() => {
                playTactileClick();
                setSelectedMember(null);
              }}
              className="absolute top-4 right-4 p-2 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center font-display font-black text-[#1E3A8A] text-xl">
                {selectedMember.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-[#0A2540] text-lg">{selectedMember.name}</h3>
                  <span className="text-lg">{selectedMember.flag}</span>
                  {selectedMember.verified && (
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-[#64748B] font-mono">{selectedMember.handle}</span>
                  <KarmaTierBadge karmaPoints={selectedMember.karmaPoints} size="xs" />
                  <span className="text-xs text-slate-400 font-mono">• {selectedMember.cityHub}, {selectedMember.country}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs">
                <div className="text-[#64748B] mb-1 font-medium">Affiliation & Core Track</div>
                <div className="text-[#0F172A] font-semibold text-sm">{selectedMember.role}</div>
                <div className="text-[#1E3A8A] font-mono mt-0.5">{selectedMember.companyName} • Core Focus: {selectedMember.topSkill}</div>
              </div>

              <div className="text-xs text-[#475569] leading-relaxed italic border-l-2 border-[#1E3A8A] pl-3 py-1">
                "{selectedMember.bio}"
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="font-display font-black text-[#1E3A8A] text-base">{selectedMember.karmaPoints.toLocaleString()}</div>
                  <div className="text-[10px] text-[#64748B] uppercase tracking-wider font-mono">Karma Points</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="font-display font-black text-[#0F172A] text-base">{selectedMember.referralsCompleted}</div>
                  <div className="text-[10px] text-[#64748B] uppercase tracking-wider font-mono">Vouches Done</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <div className="font-display font-black text-[#2563EB] text-base">{selectedMember.hiresConfirmed}</div>
                  <div className="text-[10px] text-[#64748B] uppercase tracking-wider font-mono">Hires Landed</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E3A8A]">
                <div className="font-semibold text-[#1E3A8A] flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Recent Community Impact:</span>
                </div>
                <p className="text-[#334155]">{selectedMember.recentHighlight}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedMember(null);
                  handleActionForMember(selectedMember);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-display font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Request Vouch from {selectedMember.name.split(' ')[0]}</span>
                <ArrowUpRight className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => setSelectedMember(null)}
                className="py-2.5 px-4 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#64748B] text-xs font-semibold transition-colors border border-[#CBD5E1]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
