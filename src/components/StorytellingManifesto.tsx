import React, { useState } from 'react';
import { STORY_CHAPTERS } from '../data/seed';
import { Quote, CheckCircle2, XCircle, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { playTactileClick } from '../utils/audio';

export const StorytellingManifesto: React.FC = () => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const activeChapter = STORY_CHAPTERS[activeChapterIndex];

  return (
    <section id="why" className="py-24 border-b border-[#E2E8F0] relative bg-[#FFFFFF] overflow-hidden">
      <div className="absolute inset-0 mesh-gradient-blue pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-mono tracking-widest text-[#1E3A8A] uppercase mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
            <span>The Why / Why Zero University Philosophy for Referrals</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0A2540] mb-6 leading-tight">
            Why Cold Applying Is Dead. <br />
            <span className="gradient-text-blue">
              The Asian Inside Track Is Sovereign.
            </span>
          </h2>
          <p className="text-[#475569] text-base sm:text-lg leading-relaxed font-normal">
            Universities across India, Singapore, and Asia tell students to send hundreds of cold PDF applications. They never tell you that 85% of tech hires happen through employee referrals. Refer.asia breaks the gatekeeping.
          </p>
        </div>

        {/* Chapter Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-12 border-b border-[#E2E8F0]">
          {STORY_CHAPTERS.map((chapter, idx) => (
            <button
              key={chapter.id}
              onClick={() => {
                playTactileClick();
                setActiveChapterIndex(idx);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2.5 ${
                activeChapterIndex === idx
                  ? 'bg-[#1E3A8A] text-white font-bold shadow-md shadow-[#1E3A8A]/20'
                  : 'text-[#475569] hover:text-[#0F172A] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
              }`}
            >
              <span className="font-mono text-xs opacity-80">{chapter.number}</span>
              <span>{chapter.title}</span>
            </button>
          ))}
        </div>

        {/* Active Chapter Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Argument Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-8 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-[#1E3A8A] uppercase tracking-widest font-bold">
                  Chapter {activeChapter.number} Thesis
                </span>
                <span className="text-xs font-mono text-[#2563EB] font-bold">REFER.ASIA MANIFESTO</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0A2540] mb-4">
                {activeChapter.title}
              </h3>

              <p className="text-base sm:text-lg text-[#334155] font-normal leading-relaxed mb-6 border-l-2 border-[#1E3A8A] pl-4 py-1">
                {activeChapter.lead}
              </p>

              {/* Numbered Arguments */}
              <div className="space-y-4 pt-2">
                {activeChapter.thesis.map((point, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-[#475569] leading-relaxed">
                    <span className="font-mono text-xs text-[#1E3A8A] mt-1 shrink-0 font-bold">[{i + 1}]</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Editorial Quote Box */}
              <div className="mt-8 pt-6 border-t border-[#E2E8F0] bg-white -mx-8 -mb-8 p-8 rounded-b-3xl">
                <div className="flex items-start gap-3">
                  <Quote className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm italic text-[#334155] font-normal leading-relaxed">
                      "{activeChapter.quote.text}"
                    </p>
                    <div className="text-xs font-mono text-[#64748B] mt-2 font-medium">
                      — {activeChapter.quote.attribution}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* High Impact Stat & Contrast Card */}
          <div className="lg:col-span-5 space-y-6">
            {/* Giant Stat Monolith */}
            <div className="p-8 rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] shadow-sm">
              <div className="text-xs font-mono text-[#1E3A8A] uppercase tracking-widest mb-2 font-semibold">
                {activeChapter.statKicker}
              </div>
              <div className="font-mono text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0A2540] via-[#1E3A8A] to-[#2563EB] mb-2 tabular-nums">
                {activeChapter.statValue}
              </div>
              <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                {activeChapter.statLabel}
              </p>
            </div>

            {/* Critique of The Old Way */}
            <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50/70">
              <div className="flex items-center gap-2 text-rose-700 font-mono text-xs uppercase tracking-wider mb-2 font-bold">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>The Cold Portal Trap in Asia</span>
              </div>
              <p className="text-[#475569] text-xs sm:text-sm leading-relaxed">
                {activeChapter.critique}
              </p>
            </div>

            {/* The Refer.asia Solution */}
            <div className="p-6 rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF]">
              <div className="flex items-center gap-2 text-[#1E3A8A] font-mono text-xs uppercase tracking-wider mb-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                <span>The Refer.asia Inside Track</span>
              </div>
              <p className="text-[#334155] text-xs sm:text-sm leading-relaxed">
                {activeChapter.remedy}
              </p>
            </div>
          </div>
        </div>

        {/* Structural Comparison Table */}
        <div className="mt-16 pt-12 border-t border-[#E2E8F0]">
          <div className="text-xs font-mono text-[#1E3A8A] uppercase tracking-widest mb-3 font-bold">
            Direct Comparison
          </div>
          <h3 className="font-display text-2xl font-bold text-[#0A2540] mb-6">
            Cold Online Applications vs. Refer.asia Employee Vouches
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#334155] border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-xs font-mono text-[#64748B] uppercase">
                  <th className="py-4 pr-6">Application Metric</th>
                  <th className="py-4 px-6 text-[#64748B]">Cold Careers Page / Mass Portals</th>
                  <th className="py-4 pl-6 text-[#1E3A8A] font-bold">Refer.asia Employee Inside Track</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                <tr>
                  <td className="py-4 pr-6 font-semibold text-[#0F172A]">Interview Callback Rate</td>
                  <td className="py-4 px-6 text-[#64748B]">~1.2% to 2.8% (Drowned in 8,000 resumes)</td>
                  <td className="py-4 pl-6 text-[#1E3A8A] font-bold">28% to 44% (14x to 20x higher chance)</td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 font-semibold text-[#0F172A]">Recruiter Review Queue</td>
                  <td className="py-4 px-6 text-[#64748B]">Filtered by automated ATS keyword scraper</td>
                  <td className="py-4 pl-6 text-[#1E3A8A] font-bold">Direct entry into Recruiter Priority Referral Portal</td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 font-semibold text-[#0F172A]">Self-Referral Option</td>
                  <td className="py-4 px-6 text-[#64748B]">Not possible without personal insider friends</td>
                  <td className="py-4 pl-6 text-[#1E3A8A] font-bold">Unlock 500 Karma starter pack for just ₹99 INR / S$1.60</td>
                </tr>
                <tr>
                  <td className="py-4 pr-6 font-semibold text-[#0F172A]">Referee Incentive</td>
                  <td className="py-4 px-6 text-[#64748B]">None. Engineers ignore cold LinkedIn messages</td>
                  <td className="py-4 pl-6 text-[#1E3A8A] font-bold">+250 Karma per role; 1,000 Karma future job guarantee</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
