import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Send, 
  PlusCircle, 
  Clock, 
  Zap, 
  Trophy, 
  Compass, 
  X, 
  Menu, 
  ShieldCheck, 
  Search, 
  Briefcase, 
  HelpCircle, 
  Bot, 
  ArrowRight,
  User,
  Award
} from 'lucide-react';
import { playTactileClick } from '../utils/audio';
import { KarmaTierBadge } from './KarmaTierBadge';
import { getKarmaProgressToNextTier } from '../utils/karmaTier';

interface NavbarProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  karmaBalance: number;
  onOpenPassport: () => void;
  onOpenReferralModal: () => void;
  onOpenBuyKarma: () => void;
  onOpenPostRole: () => void;
  onOpenHistory: () => void;
  onOpenKammo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  soundEnabled,
  onToggleSound,
  karmaBalance,
  onOpenPassport,
  onOpenReferralModal,
  onOpenBuyKarma,
  onOpenPostRole,
  onOpenHistory,
  onOpenKammo,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Calculate tier progression for Circular SVG indicator
  const tierProgress = getKarmaProgressToNextTier(karmaBalance);
  const { currentTier, nextTier, progressPercent, pointsRemaining } = tierProgress;

  // SVG circular progress calculation
  const size = 44;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const handleNavClick = (callback?: () => void) => {
    playTactileClick();
    setIsMenuOpen(false);
    if (callback) callback();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 border-b border-[#E2E8F0] shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Clean Minimal Wordmark & Explore Directory Alternative */}
          <div className="flex items-center gap-4">
            <a
              href="#top"
              onClick={playTactileClick}
              className="font-display text-xl font-extrabold tracking-tight text-[#0A2540] flex items-center gap-1.5 hover:opacity-90 transition-opacity"
            >
              <span>REFER.ASIA</span>
              <span className="w-2 h-2 rounded-full bg-[#1E3A8A]" />
            </a>

            {/* Alternative Clean Menu Trigger */}
            <button
              type="button"
              onClick={() => {
                playTactileClick();
                setIsMenuOpen(!isMenuOpen)}
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#F1F5F9] hover:border-[#CBD5E1] text-[#0F172A] text-xs font-medium transition-all"
              aria-label="Explore Directory Menu"
            >
              <Compass className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span className="font-semibold text-xs">Directory</span>
            </button>
          </div>

          {/* Right: Quick Actions, Sound, Avatar with Circular SVG Progress Ring, and Primary CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Audio Toggle */}
            <button
              onClick={() => {
                playTactileClick();
                onToggleSound();
              }}
              title={soundEnabled ? 'Mute audio' : 'Unmute audio'}
              aria-label="Toggle Sound"
              className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#1E3A8A]" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            {/* Post a Role (+250 Referee Karma) */}
            <button
              onClick={() => {
                playTactileClick();
                onOpenPostRole();
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#0F172A] text-xs font-medium transition-colors shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>Post a Role (+250)</span>
            </button>

            {/* Buy Karma (₹99) */}
            <button
              onClick={() => {
                playTactileClick();
                onOpenBuyKarma();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#93C5FD] text-[#1E3A8A] text-xs font-mono font-medium transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>₹99 Starter Pack</span>
            </button>

            {/* CIRCULAR SVG PROGRESS INDICATOR + USER AVATAR */}
            <button
              type="button"
              onClick={() => {
                playTactileClick();
                onOpenPassport();
              }}
              className="group relative flex items-center gap-2.5 p-1 sm:pr-3 rounded-full border border-[#E2E8F0] bg-white hover:border-[#93C5FD] hover:shadow-xs transition-all cursor-pointer text-left"
              title={`${progressPercent}% progress to ${nextTier?.name || 'Max Tier'} (${karmaBalance} Karma)`}
            >
              {/* SVG Circular Progress Ring surrounding Avatar */}
              <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
                <svg
                  className="w-10 h-10 -rotate-90 transform"
                  viewBox={`0 0 ${size} ${size}`}
                >
                  {/* Background Track */}
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#E2E8F0"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  {/* Dynamic Progress Stroke (Dark / Cobalt Blue) */}
                  <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#1E3A8A"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                {/* Avatar Core Center inside the SVG ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-display font-bold text-[11px] shadow-xs group-hover:scale-105 transition-transform">
                    AR
                  </div>
                </div>

                {/* Mini Active Indicator dot */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#2563EB] border-2 border-white" />
              </div>

              {/* Progress & Karma Balance Label */}
              <div className="hidden md:flex flex-col pr-1">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-mono text-xs font-bold text-[#0F172A] tabular-nums">
                    {karmaBalance.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#64748B] font-mono">pts</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] font-mono font-semibold text-[#1E3A8A]">
                    {progressPercent}%
                  </span>
                  <span className="text-[10px] font-mono text-[#64748B] truncate max-w-[80px]">
                    to {nextTier ? nextTier.name : 'Legend'}
                  </span>
                </div>
              </div>
            </button>

            {/* Primary Action Button - Dark Blue with White Text */}
            <button
              onClick={() => {
                playTactileClick();
                onOpenReferralModal();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 text-xs font-bold text-white bg-[#0F172A] hover:bg-[#1E3A8A] rounded-xl shadow-xs hover:shadow-md transition-all whitespace-nowrap active:scale-95"
            >
              <span>Request Referral</span>
              <Send className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Alternative Lightweight Directory Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-white border border-[#E2E8F0] rounded-3xl shadow-2xl overflow-hidden p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-5">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#1E3A8A]" />
                <h3 className="font-display font-bold text-base text-[#0F172A]">
                  Refer.asia Platform Directory
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categorized Navigation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <a
                href="#why"
                onClick={() => handleNavClick()}
                className="p-3.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#93C5FD] transition-all flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#1E3A8A] shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#0F172A] group-hover:text-[#1E3A8A]">The Why (Manifesto)</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">Why cold applying is dead in Asian tech.</div>
                </div>
              </a>

              <a
                href="#scanner"
                onClick={() => handleNavClick()}
                className="p-3.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#93C5FD] transition-all flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] shrink-0 group-hover:scale-105 transition-transform">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#0F172A] group-hover:text-[#2563EB]">ATS Scanner Simulation</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">Test your resume vs. referral multiplier.</div>
                </div>
              </a>

              <a
                href="#insiders"
                onClick={() => handleNavClick()}
                className="p-3.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#93C5FD] transition-all flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#1E3A8A] shrink-0 group-hover:scale-105 transition-transform">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#0F172A] group-hover:text-[#1E3A8A]">Verified Insiders</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">640+ engineers across Google, Grab, Flipkart.</div>
                </div>
              </a>

              <a
                href="#stories"
                onClick={() => handleNavClick()}
                className="p-3.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#93C5FD] transition-all flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#2563EB] shrink-0 group-hover:scale-105 transition-transform">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#0F172A] group-hover:text-[#1E3A8A]">Success Stories</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">Audited testimonials from non-target students.</div>
                </div>
              </a>

              <a
                href="#leaderboard"
                onClick={() => handleNavClick()}
                className="p-3.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#93C5FD] transition-all flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-amber-500 shrink-0 group-hover:scale-105 transition-transform">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#0F172A] group-hover:text-amber-600">Karma Leaderboard</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">Top 10 Asian referees & talent catalysts.</div>
                </div>
              </a>

              <a
                href="#jobs"
                onClick={() => handleNavClick()}
                className="p-3.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#93C5FD] transition-all flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#1E3A8A] shrink-0 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#0F172A] group-hover:text-[#1E3A8A]">2027 Roles</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">Curated internships & new grad engineering jobs.</div>
                </div>
              </a>

              <button
                type="button"
                onClick={() => handleNavClick(onOpenHistory)}
                className="p-3.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#93C5FD] transition-all flex items-start gap-3 text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#1E3A8A] shrink-0 group-hover:scale-105 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#0F172A] group-hover:text-[#1E3A8A]">Referral History</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">Track dispatched applications & vouchers.</div>
                </div>
              </button>

              <a
                href="#faq"
                onClick={() => handleNavClick()}
                className="p-3.5 rounded-2xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] hover:border-[#93C5FD] transition-all flex items-start gap-3 group"
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] shrink-0 group-hover:scale-105 transition-transform">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-[#0F172A] group-hover:text-[#1E3A8A]">Member FAQ</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5">₹99 tokens, 1,000 Karma guarantee & rules.</div>
                </div>
              </a>

              {onOpenKammo && (
                <button
                  type="button"
                  onClick={() => handleNavClick(onOpenKammo)}
                  className="p-3.5 rounded-2xl bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] transition-all flex items-start gap-3 text-left group"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-[#1E3A8A] flex items-center gap-1.5">
                      <span>kammo AI</span>
                      <span className="text-[9px] font-mono bg-blue-200 text-blue-900 px-1 rounded">GEMINI</span>
                    </div>
                    <div className="text-[11px] text-[#1E40AF] mt-0.5">kammo can help you navigate referrals.</div>
                  </div>
                </button>
              )}
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-3 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between text-xs text-[#64748B] font-mono">
              <span>REFER.ASIA PLATFORM</span>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#1E3A8A] hover:underline font-semibold"
              >
                Close Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
