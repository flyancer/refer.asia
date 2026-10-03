import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { playTactileClick } from '../utils/audio';

const FAQS = [
  {
    q: 'How does self-referral work on Refer.asia and why is there a ₹99 INR fee?',
    a: 'If you want to refer yourself for an opening at Google, Grab, Flipkart, or any partner tech company, you stake Karma points. To ensure candidates only submit serious, high-quality portfolios and to prevent automated bot spam from flooding internal corporate inboxes, candidates can purchase an initial 500 Karma starter pack for just ₹99 INR (or local Asian currency equivalents like S$1.60 SGD, ¥180 JPY, or ₩1,600 KRW). This maintains accountability while keeping the network accessible to everyone.',
  },
  {
    q: 'How do referees earn Karma points by posting positions?',
    a: 'Referees (verified employees at partner tech companies) earn +250 to +300 Karma points every time they post an active opening from their company or submit a verified vouch for an applicant. This directly incentivizes employees to source diverse, non-traditional talent.',
  },
  {
    q: 'What happens when a referee accumulates 1,000 Karma points?',
    a: '1,000 Karma points unlocks the Priority Job Vouch Shield. This is your personal career insurance: when you as a referee ever decide to seek a new challenge or transition companies in the future, the entire Refer.asia executive referee circle guarantees you prioritized, top-tier referral vouches at any target company in the network.',
  },
  {
    q: 'I study at a tier-2 or tier-3 college in Asia. Will insiders really refer me?',
    a: 'Yes! That is the core reason Refer.asia exists. In traditional corporate recruiting, resumes from non-target universities are discarded by ATS keyword filters in 3 seconds. Our verified referees evaluate your actual code, GitHub repositories, live demo projects, and problem-solving agency. Proof-of-work matters far more than an institution’s brand.',
  },
  {
    q: 'Where can I track the status of my referral applications?',
    a: 'Click "Referral History" in the navigation bar at any time to open your live audit trail. You can inspect your unique dispatch code (e.g., REF-FLIP-4401), view the assigned insider, and see exact timestamped milestones from initial review to interview scheduling and offer extensions.',
  },
];

export const StudentFaq: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    playTactileClick();
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 border-b border-[#E2E8F0] relative bg-[#FFFFFF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-xs font-mono tracking-widest text-[#1E3A8A] uppercase mb-3 flex items-center justify-center gap-2 font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Refer.asia Member Playbook</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#0A2540] mb-4">
            Frequently Defended Truths
          </h2>
          <p className="text-[#475569] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about ₹99 self-referral packs, referee karma incentives, and the 1,000-point future job guarantee.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden transition-all shadow-2xs hover:border-[#CBD5E1]"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-display text-base sm:text-lg font-bold text-[#0A2540]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#64748B] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#1E3A8A]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm text-[#475569] leading-relaxed border-t border-[#E2E8F0]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
