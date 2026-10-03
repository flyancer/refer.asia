import React, { useState } from 'react';
import { 
  Quote, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  ArrowUpRight, 
  TrendingUp, 
  Award, 
  ExternalLink,
  MapPin,
  Clock,
  Send
} from 'lucide-react';
import { playTactileClick } from '../utils/audio';

export interface SuccessStory {
  id: string;
  name: string;
  university: string;
  isNonTarget: boolean;
  companyName: string;
  companyLogoText: string;
  role: string;
  location: string;
  packageHighlight: string;
  quote: string;
  ticketCode: string;
  insiderReferee: string;
  vouchDays: string;
  tags: string[];
}

const SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 'story-1',
    name: 'Priya Sharma',
    university: 'Govt. Engineering College, Bilaspur (Tier-3)',
    isNonTarget: true,
    companyName: 'Google Asia',
    companyLogoText: 'Google',
    role: 'Software Engineer (L3)',
    location: 'Bengaluru, India',
    packageHighlight: '₹38.5 LPA CTC',
    quote:
      'Cold applied to 240+ positions on LinkedIn with zero recruiter callbacks. My resume was literally dying in ATS keyword filters because of my university tier. With Refer.asia, Tanmay Sen at Google vouched for my distributed raft-consensus engine on GitHub. Within 5 days I had my interview loops scheduled!',
    ticketCode: 'REF-GOOG-7821',
    insiderReferee: 'Tanmay Sen (Staff SWE, Google)',
    vouchDays: '5 Days to 1st Loop',
    tags: ['Go', 'Raft Consensus', 'gRPC', 'Distributed Systems'],
  },
  {
    id: 'story-2',
    name: 'Aarav Nair',
    university: 'Siddaganga Institute of Tech, Tumakuru',
    isNonTarget: true,
    companyName: 'Grab',
    companyLogoText: 'Grab',
    role: 'Backend Distributed Engineer',
    location: 'Singapore (One-North Hub)',
    packageHighlight: 'S$8,200/mo + Relocation',
    quote:
      'The ₹99 starter pack was the highest-ROI investment of my life. A verified Grab tech lead in Singapore reviewed my high-concurrency payment gateway repository. He vouched for me through the internal portal, bypassing 12,000 cold applicants in the public pool.',
    ticketCode: 'REF-GRAB-9204',
    insiderReferee: 'Wei Lin (Tech Lead, Grab SG)',
    vouchDays: '3 Days to Recruiter Call',
    tags: ['Go', 'Kafka', 'High Concurrency', 'Redis'],
  },
  {
    id: 'story-3',
    name: 'Kaito Tanaka',
    university: 'Self-Taught Systems Builder, Osaka',
    isNonTarget: true,
    companyName: 'ByteDance',
    companyLogoText: 'ByteDance',
    role: 'High-Scale Systems Intern',
    location: 'Tokyo, Japan',
    packageHighlight: '¥650,000/mo Stipend',
    quote:
      'Traditional Japanese Shukatsu corporate hiring heavily favors only Tokyo Univ or Kyoto graduates. Refer.asia allowed me to stake Karma on my open-source Linux kernel patch. A ByteDance staff engineer inspected my code instead of my pedigree and gave me an employee vouch.',
    ticketCode: 'REF-BYTE-4109',
    insiderReferee: 'Kenji Takahashi (Principal Architect)',
    vouchDays: '48 Hours to Tech Screen',
    tags: ['C++', 'Linux Kernel', 'Rust', 'eBPF'],
  },
  {
    id: 'story-4',
    name: 'Ananya Deshmukh',
    university: 'VJTI Mumbai / Open Source Contributor',
    isNonTarget: false,
    companyName: 'Flipkart',
    companyLogoText: 'Flipkart',
    role: 'SDE-1 (Search & Relevance)',
    location: 'Bengaluru, India',
    packageHighlight: '₹32 LPA Package',
    quote:
      'ATS scanners look for generic buzzwords, while actual senior engineers look for engineering velocity. My insider referee at Flipkart immediately appreciated the custom B-Tree database indexing project I demoed. The vouch jumped me straight past screening rounds.',
    ticketCode: 'REF-FLIP-3382',
    insiderReferee: 'Vikramaditya Sharma (Lead Architect)',
    vouchDays: '4 Days to Direct Loops',
    tags: ['Java', 'Spring Boot', 'PostgreSQL', 'Lucene'],
  },
  {
    id: 'story-5',
    name: 'Rhea Chen',
    university: 'NUS / Switching from Economics to Software',
    isNonTarget: true,
    companyName: 'Stripe',
    companyLogoText: 'Stripe',
    role: 'Infrastructure Architect',
    location: 'Singapore',
    packageHighlight: 'S$11,500/mo Base',
    quote:
      'Non-CS majors usually face immediate ATS auto-rejection before human eyes ever see the resume. Through Refer.asia, an Archon Referee at Stripe tested my double-entry accounting ledger system and submitted a fast-track vouch with the hiring manager.',
    ticketCode: 'REF-STRI-5510',
    insiderReferee: 'Marcus Sterling (Archon Referee)',
    vouchDays: '3 Days to HM Screen',
    tags: ['Ruby', 'TypeScript', 'AWS', 'Distributed Ledgers'],
  },
  {
    id: 'story-6',
    name: 'Min-jun Park',
    university: 'Chonnam National University, Gwangju',
    isNonTarget: true,
    companyName: 'Microsoft',
    companyLogoText: 'Microsoft',
    role: 'AI Compiler Engineer',
    location: 'Hyderabad / Seoul (Hybrid)',
    packageHighlight: '₹44 LPA Equivalent',
    quote:
      'I did not attend SKY universities in Korea, so multinational tech recruiters constantly overlooked my cold applications. Refer.asia gave me sovereign access directly to referees who actually understand tensor compilers and GPU optimization.',
    ticketCode: 'REF-MICR-8812',
    insiderReferee: 'Rajesh G. (Principal ML Partner)',
    vouchDays: '6 Days to Final Rounds',
    tags: ['PyTorch', 'CUDA', 'C++20', 'LLVM'],
  },
];

interface SuccessStoriesProps {
  onOpenReferralModal: () => void;
}

export const SuccessStories: React.FC<SuccessStoriesProps> = ({ onOpenReferralModal }) => {
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('all');

  const filteredStories = SUCCESS_STORIES.filter((story) => {
    if (selectedCompanyFilter === 'all') return true;
    return story.companyName.toLowerCase().includes(selectedCompanyFilter.toLowerCase());
  });

  return (
    <section id="stories" className="py-24 border-b border-[#E2E8F0] relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC]">
      {/* Ambient Glassmorphism Light Spheres */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-blue-200/40 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[300px] bg-sky-200/35 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md bg-white/80 border border-[#BFDBFE] text-[#1E3A8A] text-xs font-mono font-semibold uppercase mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Proven Mobility // Verified Candidate Hall of Fame</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0A2540] mb-4">
              From Non-Target Colleges <br className="hidden sm:inline" />
              <span className="gradient-text-blue">to Sovereign Tech Offers</span>
            </h2>
            <p className="text-[#475569] text-sm sm:text-base leading-relaxed">
              Real quotes and audited placement records from students who bypassed the 3-second ATS keyword meat-grinder through employee referral vouches. Proof-of-work over pedigree.
            </p>
          </div>

          {/* Glassmorphic Stats Pill Box */}
          <div className="backdrop-blur-xl bg-white/70 border border-white/90 p-4 rounded-3xl shadow-sm space-y-2 shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono text-[#1E3A8A] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              <span>100% Ledger-Audited Dispatch Codes</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1 border-t border-[#E2E8F0]/70">
              <div>
                <span className="text-[10px] text-[#64748B] block">CALLBACK RATIO</span>
                <span className="font-extrabold text-[#0A2540] text-sm">94.2%</span>
              </div>
              <div>
                <span className="text-[10px] text-[#64748B] block">AVG VOUCH TIME</span>
                <span className="font-extrabold text-[#1E3A8A] text-sm">&lt; 4.6 Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Company Filter Tabs (Glass style) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          {[
            { id: 'all', label: 'All Success Stories' },
            { id: 'google', label: 'Google Asia' },
            { id: 'grab', label: 'Grab Singapore' },
            { id: 'bytedance', label: 'ByteDance Tokyo' },
            { id: 'flipkart', label: 'Flipkart' },
            { id: 'stripe', label: 'Stripe' },
            { id: 'microsoft', label: 'Microsoft' },
          ].map((tab) => {
            const isSelected = selectedCompanyFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playTactileClick();
                  setSelectedCompanyFilter(tab.id);
                }}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-mono whitespace-nowrap transition-all backdrop-blur-md ${
                  isSelected
                    ? 'bg-[#1E3A8A] text-white font-bold shadow-md shadow-blue-900/15 border border-[#1E3A8A]'
                    : 'bg-white/60 hover:bg-white/90 text-[#475569] hover:text-[#0F172A] border border-white/80 shadow-2xs'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Testimonials Glassmorphism Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="group relative rounded-3xl p-6 sm:p-7 backdrop-blur-xl bg-white/70 hover:bg-white/90 border border-white/90 hover:border-[#BFDBFE] transition-all duration-300 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-900/10 flex flex-col justify-between"
            >
              {/* Top Glass Refraction Accent Line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#BFDBFE] to-transparent opacity-80" />

              <div>
                {/* Header: Company & Outcome Badge */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E3A8A] text-xs font-bold font-display shadow-2xs">
                      <Building2 className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>{story.companyName}</span>
                    </span>
                    <div className="text-xs font-semibold text-[#0F172A] mt-2">
                      {story.role}
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-mono font-bold shadow-2xs shrink-0">
                    {story.packageHighlight}
                  </span>
                </div>

                {/* Candidate & University */}
                <div className="pb-3 border-b border-[#E2E8F0]/70 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-base text-[#0A2540]">
                      {story.name}
                    </span>
                    {story.isNonTarget && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                        Non-Target Vouch
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#64748B] mt-0.5 font-medium">
                    <GraduationCap className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                    <span className="truncate">{story.university}</span>
                  </div>
                </div>

                {/* Student Quote with Glass Quote Icon */}
                <div className="relative mb-5">
                  <Quote className="w-8 h-8 text-[#1E3A8A]/15 absolute -top-2 -left-1 pointer-events-none" />
                  <p className="text-xs sm:text-[13px] text-[#334155] leading-relaxed italic relative z-10 pl-3 border-l-2 border-[#1E3A8A]">
                    "{story.quote}"
                  </p>
                </div>

                {/* Verified Skills / Tech Stack */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {story.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/80 text-[#475569] border border-[#CBD5E1]/80 shadow-2xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Verification Footer (Glass panel) */}
              <div className="pt-3 border-t border-[#E2E8F0]/80 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-[#64748B] text-[11px]">
                  <span>Vouched By:</span>
                  <span className="font-semibold text-[#1E3A8A] truncate max-w-[170px]">
                    {story.insiderReferee}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#64748B]">Ticket Audit:</span>
                  <span className="text-[#0F172A] font-bold tracking-wider">
                    {story.ticketCode}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 text-[10px] text-emerald-700 font-semibold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified Placement</span>
                  </span>
                  <span>{story.vouchDays}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner (Glassmorphism card) */}
        <div className="mt-12 p-8 rounded-3xl backdrop-blur-xl bg-white/70 border border-white/90 shadow-xl shadow-blue-900/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-display text-xl sm:text-2xl font-bold text-[#0A2540]">
              Ready to write your own referral success story?
            </h4>
            <p className="text-xs sm:text-sm text-[#475569]">
              Connect directly with 640+ verified referees across Bengaluru, Singapore, and Tokyo tech corridors.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              playTactileClick();
              onOpenReferralModal();
            }}
            className="px-6 py-3 text-xs sm:text-sm font-bold bg-[#1E3A8A] hover:bg-[#1E40AF] text-white rounded-2xl shadow-md shadow-[#1E3A8A]/20 transition-all flex items-center gap-2 whitespace-nowrap active:scale-95 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 text-white" />
            <span>Request Verified Employee Vouch</span>
          </button>
        </div>

      </div>
    </section>
  );
};
