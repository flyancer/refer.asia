import React, { useState } from 'react';
import { UserStudentProfile } from '../types';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Gift, 
  Send, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  Trophy, 
  Layers, 
  Code2, 
  Plus,
  Zap,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { playTactileClick, playSuccessChime } from '../utils/audio';
import { KarmaTierBadge } from './KarmaTierBadge';
import { MilestoneTracker } from './MilestoneTracker';
import { getKarmaProgressToNextTier, KARMA_TIERS } from '../utils/karmaTier';
import { POPULAR_TECH_SKILLS } from '../utils/skillMatcher';

interface StudentPassportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserStudentProfile;
  onUpdateSkills?: (skills: string[]) => void;
  onClaimDailyReward: () => void;
  canClaimDaily: boolean;
  onOpenBuyKarma: () => void;
  onOpenPostRole: () => void;
  onOpenHistory: () => void;
}

export const StudentPassportDrawer: React.FC<StudentPassportDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateSkills,
  onClaimDailyReward,
  canClaimDaily,
  onOpenBuyKarma,
  onOpenPostRole,
  onOpenHistory,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  if (!isOpen) return null;

  const currentSkills = profile.skills && profile.skills.length > 0
    ? profile.skills
    : ['React', 'Go', 'Python', 'TypeScript'];

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (!currentSkills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      playTactileClick();
      const updated = [...currentSkills, trimmed];
      if (onUpdateSkills) onUpdateSkills(updated);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    playTactileClick();
    const updated = currentSkills.filter(s => s !== skillToRemove);
    if (onUpdateSkills) onUpdateSkills(updated);
  };

  const handleCopyInvite = () => {
    playTactileClick();
    navigator.clipboard.writeText(`${window.location.origin}/#invite=${profile.handle.replace('@', '')}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const tierProgress = getKarmaProgressToNextTier(profile.karmaPoints);
  const { currentTier, nextTier, progressPercent, pointsRemaining } = tierProgress;
  const progressShieldPercent = Math.min(100, (profile.karmaPoints / 1000) * 100);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white border-l border-[#E2E8F0] h-full flex flex-col justify-between shadow-2xl p-6 overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-[#E2E8F0]">
            <div>
              <div className="text-[10px] font-mono text-[#1E3A8A] uppercase tracking-widest font-semibold">
                REFER.ASIA // PASSPORT & REPUTATION
              </div>
              <h3 className="font-display text-xl font-bold text-[#0F172A]">
                Your Member Dossier
              </h3>
            </div>
            <button
              onClick={() => {
                playTactileClick();
                onClose();
              }}
              className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Card */}
          <div className="mt-5 p-5 rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A] relative shadow-2xs">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="font-display font-bold text-lg text-[#0F172A]">{profile.name}</div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[#64748B] font-mono">{profile.handle}</span>
                  <KarmaTierBadge karmaPoints={profile.karmaPoints} size="xs" />
                </div>
                <div className="text-[11px] text-[#64748B] mt-0.5">{profile.university} · {profile.city}</div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white text-[#1E3A8A] border border-[#CBD5E1] font-semibold">
                {profile.karmaPoints >= 1000 ? 'VIP SHIELD ACTIVE' : 'ACTIVE MEMBER'}
              </span>
            </div>

            <div className="pt-4 border-t border-[#E2E8F0] grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#64748B] text-[10px] uppercase font-mono block">Karma Balance</span>
                <span className="font-mono text-2xl font-bold text-[#1E3A8A] tabular-nums">
                  {profile.karmaPoints.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] text-[10px] uppercase font-mono block">Dispatched Referrals</span>
                <span className="font-mono text-2xl font-bold text-[#0F172A] tabular-nums">
                  {profile.activeRequests.length}
                </span>
              </div>
            </div>
          </div>

          {/* PROMINENT VISUAL PROGRESS BAR TO NEXT KARMA TIER */}
          <div className="mt-5 p-5 rounded-3xl border-2 border-[#BFDBFE] bg-gradient-to-br from-[#EFF6FF] to-white shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#1E3A8A]" />
                <span className="font-display font-bold text-sm text-[#0F172A]">
                  Tier Progression Bar
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#1E3A8A] bg-white px-2.5 py-1 rounded-full border border-[#BFDBFE] shadow-2xs">
                {progressPercent}% COMPLETE
              </span>
            </div>

            {/* Current & Next Tier Milestones */}
            <div className="flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[10px] text-[#64748B] block uppercase">Current Tier</span>
                <strong className="text-[#0F172A] font-semibold text-sm">{currentTier.name}</strong>
                <span className="text-[10px] text-[#64748B] block">{currentTier.minPoints} pts</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#64748B] block uppercase">Target Tier</span>
                <strong className="text-[#1E3A8A] font-semibold text-sm">
                  {nextTier ? nextTier.name : 'Legend Pinnacle'}
                </strong>
                <span className="text-[10px] text-[#64748B] block">
                  {nextTier ? `${nextTier.minPoints} pts` : 'Max reached'}
                </span>
              </div>
            </div>

            {/* Visual Progress Bar Component */}
            <div className="space-y-1.5">
              <div className="w-full bg-[#E2E8F0] h-3.5 rounded-full overflow-hidden p-0.5 border border-[#CBD5E1]">
                <div
                  className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#38BDF8] h-full rounded-full transition-all duration-700 ease-out shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] pt-0.5">
                <span>{profile.karmaPoints.toLocaleString()} current pts</span>
                {nextTier ? (
                  <span className="text-[#1E3A8A] font-semibold">
                    {pointsRemaining} points needed for {nextTier.name}
                  </span>
                ) : (
                  <span className="text-[#1E3A8A] font-semibold">Max Tier Achieved</span>
                )}
              </div>
            </div>

            {/* Next Tier Perks Preview */}
            {nextTier && (
              <div className="pt-2 border-t border-[#DBEAFE] text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] block mb-1">
                  Unlocks at {nextTier.name}:
                </span>
                <div className="space-y-1">
                  {nextTier.perks.map((perk, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-[#1E3A8A]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fast-track Buttons to Gain Karma */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  onOpenBuyKarma();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-[#1E3A8A] hover:bg-[#1E40AF] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Buy ₹99 Pack (+500)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playTactileClick();
                  onOpenPostRole();
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#1E3A8A]" />
                <span>Post Role (+250)</span>
              </button>
            </div>
          </div>

          {/* Member Milestone Badges Tracker */}
          <div className="mt-5">
            <MilestoneTracker
              profile={profile}
              onOpenBuyKarma={onOpenBuyKarma}
              onOpenPostRole={onOpenPostRole}
            />
          </div>

          {/* Candidate Technical Stack & Job Filter Skills */}
          <div className="mt-5 p-4 rounded-2xl border border-[#E2E8F0] bg-white space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#1E3A8A]" />
                <span className="text-xs font-semibold text-[#0F172A]">Your Technical Skills</span>
              </div>
              <span className="text-[10px] font-mono text-[#1E3A8A] bg-[#EFF6FF] px-2 py-0.5 rounded-full border border-[#BFDBFE] font-semibold">
                {currentSkills.length} Skills Configured
              </span>
            </div>

            <p className="text-[11px] text-[#64748B] leading-relaxed">
              These skills match your profile on the 2027 Roles Board (e.g. <strong className="text-[#0F172A]">React, Go, Python</strong>).
            </p>

            {/* Configured Skills Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-xl text-xs font-mono bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] flex items-center gap-1.5 shadow-2xs"
                >
                  <Check className="w-3 h-3 text-[#1E3A8A]" />
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-[#94A3B8] hover:text-red-500 transition-colors ml-0.5"
                    title={`Remove ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Quick Add Form */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0]">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSkill(skillInput);
                }}
                placeholder="Add skill (e.g. React, Go, Python)..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1E3A8A] font-mono"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(skillInput)}
                className="px-3 py-1.5 rounded-xl bg-[#0F172A] hover:bg-[#1E3A8A] text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* 1,000 Karma Referee Future Job Guarantee Progress */}
          <div className="mt-5 p-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#1E3A8A] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#1E3A8A]" />
                <span>1,000 Karma Referee Milestone</span>
              </span>
              <span className="font-mono text-[#0F172A] text-[11px]">
                {profile.karmaPoints} / 1,000
              </span>
            </div>

            <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden border border-[#CBD5E1]">
              <div
                className="bg-[#1E3A8A] h-full rounded-full transition-all"
                style={{ width: `${progressShieldPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-[#64748B] leading-relaxed">
              {profile.karmaPoints >= 1000 ? (
                <span className="text-[#1E3A8A] font-medium">
                  ✓ Priority Job Vouch Shield Unlocked! When you need a career transition, the Refer.asia referee network guarantees your priority referral.
                </span>
              ) : (
                <span>
                  Referees earn Karma whenever they post an opening (+250 points). Reach 1,000 Karma to unlock your personal future job vouch guarantee!
                </span>
              )}
            </p>
          </div>

          {/* Daily Reward Claim */}
          <div className="mt-5 p-4 rounded-2xl border border-[#E2E8F0] bg-white flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E3A8A] flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#0F172A]">Daily Member Telemetry</div>
                <div className="text-[11px] text-[#64748B]">+50 Karma points daily allocation</div>
              </div>
            </div>
            <button
              disabled={!canClaimDaily}
              onClick={() => {
                playSuccessChime();
                onClaimDailyReward();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                canClaimDaily
                  ? 'bg-[#1E3A8A] hover:bg-[#1E40AF] text-white shadow-2xs'
                  : 'bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed border border-[#E2E8F0]'
              }`}
            >
              {canClaimDaily ? 'Claim +50' : 'Claimed'}
            </button>
          </div>

          {/* Referral History Quick Button */}
          <div className="mt-5 space-y-2">
            <button
              type="button"
              onClick={() => {
                playTactileClick();
                onClose();
                onOpenHistory();
              }}
              className="w-full py-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-xs text-[#0F172A] font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <Clock className="w-4 h-4 text-[#1E3A8A]" />
              <span>Open Detailed Referral History & Timeline</span>
            </button>
          </div>

          {/* Invite Peer Link */}
          <div className="mt-5">
            <label className="block text-xs font-medium text-[#0F172A] mb-1.5">
              Invite Peer Engineers & Candidates (+150 Karma each)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/#invite=${profile.handle.replace('@', '')}`}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] text-xs font-mono text-[#64748B] select-all"
              />
              <button
                onClick={handleCopyInvite}
                className="px-3.5 py-2 bg-[#0F172A] hover:bg-[#1E3A8A] text-white rounded-xl text-xs font-medium flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-5 mt-5 border-t border-[#E2E8F0] text-[11px] text-[#64748B] font-mono flex items-center justify-between">
          <span>REFER.ASIA PASSPORT</span>
          <span>TIER: {currentTier.name.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
