import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Insider, CompanyId } from '../types';
import { TOP_COMPANIES } from '../data/seed';
import { Search, Sparkles, CheckCircle2, ShieldCheck, GraduationCap, Send, ExternalLink, ArrowRight, MapPin } from 'lucide-react';
import { playTactileClick } from '../utils/audio';

interface InsidersDirectoryProps {
  insiders: Insider[];
  selectedCompanyFilter: CompanyId | 'all';
  onCompanyFilterChange: (company: CompanyId | 'all') => void;
  onRequestReferral: (insider: Insider) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 340,
      damping: 26,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    transition: { duration: 0.12 },
  },
};

export const InsidersDirectory: React.FC<InsidersDirectoryProps> = ({
  insiders,
  selectedCompanyFilter,
  onCompanyFilterChange,
  onRequestReferral,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<'all' | 'swe' | 'systems' | 'infra' | 'data'>('all');

  const filteredInsiders = insiders.filter((ins) => {
    const matchesCompany = selectedCompanyFilter === 'all' || ins.companyId === selectedCompanyFilter;
    
    let matchesDept = true;
    if (selectedDept === 'swe') matchesDept = ins.role.toLowerCase().includes('software') || ins.role.toLowerCase().includes('sde') || ins.tags.includes('Java');
    if (selectedDept === 'systems') matchesDept = ins.role.toLowerCase().includes('systems') || ins.tags.includes('C++') || ins.tags.includes('Kernel');
    if (selectedDept === 'infra') matchesDept = ins.role.toLowerCase().includes('architect') || ins.role.toLowerCase().includes('cloud') || ins.tags.includes('Go');
    if (selectedDept === 'data') matchesDept = ins.department.toLowerCase().includes('algorithms') || ins.department.toLowerCase().includes('ai') || ins.tags.includes('PyTorch');

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      ins.name.toLowerCase().includes(query) ||
      ins.role.toLowerCase().includes(query) ||
      ins.companyName.toLowerCase().includes(query) ||
      ins.cityHub.toLowerCase().includes(query) ||
      ins.universityAlum.toLowerCase().includes(query) ||
      ins.tags.some((t) => t.toLowerCase().includes(query));

    return matchesCompany && matchesDept && matchesSearch;
  });

  return (
    <section id="insiders" className="py-24 border-b border-[#E2E8F0] relative bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs font-mono tracking-widest text-[#1E3A8A] uppercase mb-3 flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              <span>Verified Employee Directory // Refer.asia Referees</span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#0A2540] mb-4">
              Connect Directly with Verified Tech Referees
            </h2>
            <p className="text-[#475569] text-sm sm:text-base leading-relaxed font-normal">
              Every referee listed below is an active verified engineer or architect across Bengaluru, Singapore, Tokyo, and Asian tech corridors with verified employee referral submission access.
            </p>
          </div>

          <div className="px-4 py-2 rounded-2xl border border-[#DBEAFE] bg-[#EFF6FF] self-start md:self-auto text-xs font-mono text-[#1E3A8A] flex items-center gap-3 font-semibold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></span>
            <span>640+ Verified Pan-Asian Referees Online</span>
          </div>
        </div>

        {/* Company Quick-Select Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
          <button
            type="button"
            onClick={() => {
              playTactileClick();
              onCompanyFilterChange('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCompanyFilter === 'all'
                ? 'bg-[#1E3A8A] text-white font-bold shadow-sm'
                : 'text-[#475569] hover:text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0]'
            }`}
          >
            All Companies ({insiders.length})
          </button>
          {TOP_COMPANIES.map((comp) => {
            const isSelected = selectedCompanyFilter === comp.id;
            return (
              <button
                key={comp.id}
                type="button"
                onClick={() => {
                  playTactileClick();
                  onCompanyFilterChange(comp.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white font-bold shadow-sm'
                    : 'text-[#475569] hover:text-[#0F172A] bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#2563EB]'}`}></span>
                <span>{comp.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Department Toolbar */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] mb-8 flex flex-col md:flex-row gap-4 justify-between items-center border border-[#E2E8F0] shadow-2xs">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by referee name, role, Go, C++, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1E3A8A]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-xs">
            {[
              { id: 'all', label: 'All Disciplines' },
              { id: 'swe', label: 'SDE & Backend' },
              { id: 'systems', label: 'Systems & Kernels' },
              { id: 'infra', label: 'Cloud Infrastructure' },
              { id: 'data', label: 'AI & Algorithms' },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  playTactileClick();
                  setSelectedDept(d.id as any);
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  selectedDept === d.id
                    ? 'bg-[#1E3A8A] text-white font-bold'
                    : 'text-[#475569] hover:text-[#0F172A] bg-white border border-[#E2E8F0]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Insiders Cards Grid with Framer Motion Entrance Animation */}
        <AnimatePresence mode="wait">
          {filteredInsiders.length > 0 ? (
            <motion.div
              key={`insiders-grid-${selectedCompanyFilter}-${selectedDept}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {filteredInsiders.map((insider) => (
                <motion.div
                  key={insider.id}
                  variants={cardVariants}
                  layout
                  className="p-6 rounded-3xl bg-white hover:border-[#1E3A8A] transition-all flex flex-col justify-between group border border-[#E2E8F0] relative overflow-hidden shadow-sm hover:shadow-md"
                >
                  <div>
                    {/* Header Lockup */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-2xl flex items-center justify-center font-display font-bold text-white text-sm shadow-sm bg-[#1E3A8A]"
                        >
                          {insider.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-[#0F172A] text-base group-hover:text-[#1E3A8A] transition-colors">
                            {insider.name}
                          </h4>
                          <div className="text-[11px] font-mono text-[#64748B] flex items-center gap-1">
                            <span>{insider.companyName}</span>
                            <span>·</span>
                            <span className="text-[#2563EB] font-semibold">Verified</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#1E3A8A] border border-[#BFDBFE] font-medium">
                        {insider.availableSlots} slots left
                      </span>
                    </div>

                    {/* Role & Location */}
                    <div className="text-xs font-semibold text-[#0F172A] mb-1">
                      {insider.role}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#64748B] mb-2 font-mono">
                      <MapPin className="w-3 h-3 text-[#2563EB] shrink-0" />
                      <span>{insider.cityHub}</span>
                    </div>

                    {/* University Background */}
                    <div className="flex items-center gap-1.5 text-[11px] text-[#1E3A8A] mb-3 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 shrink-0 text-[#2563EB]" />
                      <span className="truncate">{insider.universityAlum}</span>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-[#475569] font-normal leading-relaxed mb-4 line-clamp-3">
                      {insider.bio}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {insider.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Metrics & Action */}
                  <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-[#64748B] block uppercase font-mono">Referrals Done</span>
                        <span className="font-mono text-[#0F172A] font-bold">
                          {insider.referralsCompleted} placed
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#64748B] block uppercase font-mono">Vouch Ratio</span>
                        <span className="font-mono text-[#1E3A8A] font-bold">
                          {insider.acceptanceRate}
                        </span>
                      </div>
                    </div>

                    {/* Dark Blue action button */}
                    <button
                      type="button"
                      onClick={() => {
                        playTactileClick();
                        onRequestReferral(insider);
                      }}
                      className="w-full py-2.5 text-xs font-bold bg-[#1E3A8A] hover:bg-[#1E40AF] text-white rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-white" />
                      <span>Request Employee Vouch</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="insiders-empty-state"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-center py-16 rounded-3xl border border-dashed border-[#CBD5E1] p-8"
            >
              <p className="text-[#64748B] text-sm mb-3">No verified referees match this filter.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  onCompanyFilterChange('all');
                  setSelectedDept('all');
                }}
                className="text-xs text-[#1E3A8A] hover:underline font-mono font-semibold"
              >
                Reset all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
