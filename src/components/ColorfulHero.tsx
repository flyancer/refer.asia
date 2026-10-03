import React from 'react';
import { ArrowDown, Sparkles, Send, ShieldCheck, Zap, Compass, PlusCircle, Clock, CheckCircle2, Trophy, Bot, MessageSquare, Building2, ArrowRight } from 'lucide-react';
import { CompanyId } from '../types';
import { TOP_COMPANIES } from '../data/seed';
import { playTactileClick } from '../utils/audio';

interface ColorfulHeroProps {
  onOpenReferralModal: () => void;
  onScrollToScanner: () => void;
  onScrollToWhy: () => void;
  onOpenBuyKarma: () => void;
  onOpenPostRole: () => void;
  onOpenHistory: () => void;
  onOpenKammo?: () => void;
  selectedCompanyId: CompanyId | 'all';
  onSelectCompany: (companyId: CompanyId) => void;
}

export const ColorfulHero: React.FC<ColorfulHeroProps> = ({
  onOpenReferralModal,
  onScrollToScanner,
  onScrollToWhy,
  onOpenBuyKarma,
  onOpenPostRole,
  onOpenHistory,
  onOpenKammo,
  selectedCompanyId,
  onSelectCompany,
}) => {
  const handleCompanyClick = (companyId: CompanyId) => {
    playTactileClick();
    onSelectCompany(companyId);
    const el = document.getElementById('insiders');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[85vh] flex flex-col justify-between pt-8 pb-16 overflow-hidden border-b border-[#E2E8F0] bg-white">
      {/* Background Soft Mesh Gradient (Deep Blue & Cobalt) */}
      <div className="absolute inset-0 mesh-gradient-blue pointer-events-none opacity-80" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
        {/* Subtitle Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DBEAFE] bg-[#EFF6FF] text-[#1E3A8A] text-xs font-semibold mb-5 w-fit shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
          <span>PAN-ASIAN TECH REFERRAL EXCHANGE</span>
        </div>

        {/* Big Bold Title */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0A2540] max-w-5xl leading-[1.08] mb-6">
          Cold applying dies in the ATS. <br />
          <span className="gradient-text-blue">
            Employee referrals get you hired.
          </span>
        </h1>

        {/* Concrete Proposition */}
        <p className="text-base sm:text-lg lg:text-xl text-[#475569] max-w-3xl font-normal leading-relaxed mb-10">
          Over 85% of tech roles across Bengaluru, Singapore, Tokyo, and Seoul are filled internally through referrals. Refer.asia connects ambitious students and candidates directly with verified insiders at Google, Grab, Flipkart, and ByteDance. Candidates can refer themselves with ₹99 Karma tokens, while referees earn points toward their own future job guarantee.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5 mb-12">
          {/* Primary CTA - Dark Blue with Crisp White Text */}
          <button
            type="button"
            onClick={() => {
              playTactileClick();
              onOpenReferralModal();
            }}
            className="px-6 py-3.5 text-xs sm:text-sm font-bold bg-[#1E3A8A] hover:bg-[#1E40AF] text-white rounded-2xl shadow-lg shadow-[#1E3A8A]/20 transition-all flex items-center gap-2 active:scale-95"
          >
            <Send className="w-4 h-4 text-white" />
            <span>Request Insider Referral</span>
          </button>

          {/* Ask Kammo AI button */}
          {onOpenKammo && (
            <button
              type="button"
              onClick={() => {
                playTactileClick();
                onOpenKammo();
              }}
              className="px-5 py-3.5 text-xs sm:text-sm font-semibold text-[#0F172A] bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#1E3A8A] rounded-2xl transition-all flex items-center gap-2.5 shadow-xs"
            >
              <div className="w-5 h-5 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs">
                K
              </div>
              <div className="text-left">
                <span className="text-[#0F172A]">Ask Kammo</span>
                <span className="text-[11px] text-[#64748B] font-mono ml-2 hidden sm:inline">kammo can help you</span>
              </div>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              playTactileClick();
              onOpenBuyKarma();
            }}
            className="px-5 py-3.5 text-xs sm:text-sm font-medium text-[#1E3A8A] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] rounded-2xl transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-[#2563EB]" />
            <span>Buy Karma Starter Pack (₹99)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playTactileClick();
              onOpenPostRole();
            }}
            className="px-5 py-3.5 text-xs sm:text-sm font-medium text-[#0F172A] bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#94A3B8] rounded-2xl transition-all flex items-center gap-2 shadow-2xs"
          >
            <PlusCircle className="w-4 h-4 text-[#1E3A8A]" />
            <span>Post a Role (+250 Referee Karma)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playTactileClick();
              onOpenHistory();
            }}
            className="px-4 py-3.5 text-xs sm:text-sm text-[#64748B] hover:text-[#0F172A] transition-colors flex items-center gap-1.5 font-medium"
          >
            <Clock className="w-4 h-4 text-[#1E3A8A]" />
            <span>Referral History</span>
          </button>

          <a
            href="#leaderboard"
            onClick={playTactileClick}
            className="px-4 py-3.5 text-xs sm:text-sm text-[#1E3A8A] hover:text-[#1D4ED8] transition-colors flex items-center gap-1.5 font-semibold"
          >
            <Trophy className="w-4 h-4 text-[#2563EB]" />
            <span>Top 10 Leaderboard</span>
          </a>
        </div>

        {/* Clean Verified Corridors Showcase (Replaces 3D Mesh) */}
        <div className="mb-12 p-6 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#1E3A8A]" />
              <span className="font-display font-bold text-sm text-[#0A2540]">
                Verified Pan-Asian Employer Corridors
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white text-[#1E3A8A] border border-[#BFDBFE]">
                Active Triage Queues
              </span>
            </div>
            <span className="text-xs text-[#64748B] font-mono">
              Click company to view verified referees
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {TOP_COMPANIES.slice(0, 8).map((comp) => {
              const isSelected = selectedCompanyId === comp.id;
              return (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => handleCompanyClick(comp.id)}
                  className={`p-3 rounded-2xl border text-left transition-all group ${
                    isSelected
                      ? 'border-[#1E3A8A] bg-[#EFF6FF] shadow-xs ring-1 ring-[#1E3A8A]'
                      : 'border-[#E2E8F0] bg-white hover:border-[#93C5FD] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display font-bold text-xs text-[#0F172A] group-hover:text-[#1E3A8A] transition-colors truncate">
                      {comp.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#1E3A8A] font-mono font-semibold">
                    {comp.insiderCount} Insiders
                  </div>
                  <div className="text-[9px] text-[#64748B] font-mono truncate mt-0.5">
                    {comp.avgResponseTime} SLA
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Metrics Proof Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm">
          <div className="flex flex-col">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#1E3A8A] tabular-nums">14X</span>
            <span className="text-xs text-[#64748B] mt-1 font-mono">Higher Callback Rate in Asia</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#2563EB] tabular-nums">₹99 / S$1.60</span>
            <span className="text-xs text-[#64748B] mt-1 font-mono">Self-Referral Karma Starter Pack</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#0A2540] tabular-nums">1,000 Karma</span>
            <span className="text-xs text-[#64748B] mt-1 font-mono">Referee Future Job Vouch Unlock</span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#1E3A8A] tabular-nums">640+</span>
            <span className="text-xs text-[#64748B] mt-1 font-mono">Verified Insiders in Pan-Asia</span>
          </div>
        </div>
      </div>
    </section>
  );
};
