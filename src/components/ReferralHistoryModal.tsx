import React, { useState } from 'react';
import { ReferralSubmission } from '../types';
import { X, Search, Clock, CheckCircle2, ShieldCheck, ExternalLink, Calendar, User, ArrowUpRight } from 'lucide-react';
import { playTactileClick } from '../utils/audio';

interface ReferralHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ReferralSubmission[];
}

export const ReferralHistoryModal: React.FC<ReferralHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'interview' | 'offer'>('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    let matchesStatus = true;
    if (filter === 'active') matchesStatus = item.status === 'In Review' || item.status === 'Matched with Insider' || item.status === 'Submitted to Internal ATS';
    if (filter === 'interview') matchesStatus = item.status === 'Interview Scheduled';
    if (filter === 'offer') matchesStatus = item.status === 'Offer Extended';

    const q = search.toLowerCase();
    const matchesSearch =
      item.candidateName.toLowerCase().includes(q) ||
      item.targetCompanyName.toLowerCase().includes(q) ||
      item.targetRole.toLowerCase().includes(q) ||
      item.referralCode.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: ReferralSubmission['status']) => {
    switch (status) {
      case 'Offer Extended':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
      case 'Interview Scheduled':
        return 'bg-[#EFF6FF] text-[#1E3A8A] border-[#BFDBFE] font-bold';
      case 'Submitted to Internal ATS':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Matched with Insider':
        return 'bg-[#F8FAFC] text-[#334155] border-[#CBD5E1]';
      default:
        return 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white border border-[#CBD5E1] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#1E3A8A] flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A8A] font-bold">
                REFER.ASIA // AUDIT TRAIL
              </div>
              <h3 className="font-display text-xl font-bold text-[#0A2540]">
                Referral Dispatch & Application History
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="p-1 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="p-6 border-b border-[#E2E8F0] bg-white flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by company, candidate, role, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1E3A8A]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
            {[
              { id: 'all', label: `All (${history.length})` },
              { id: 'active', label: 'Active Pipeline' },
              { id: 'interview', label: 'Interview Scheduled' },
              { id: 'offer', label: 'Offers Extended' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  playTactileClick();
                  setFilter(tab.id as any);
                }}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors font-medium ${
                  filter === tab.id
                    ? 'bg-[#1E3A8A] text-white font-bold shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-[#F8FAFC]">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#1E3A8A] transition-all space-y-4 shadow-sm"
            >
              {/* Item Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-display font-bold text-base text-[#0A2540]">
                    {item.targetCompanyName}
                  </span>
                  <span className="text-xs text-[#94A3B8]">·</span>
                  <span className="text-xs text-[#334155] font-mono">
                    {item.targetRole}
                  </span>
                  {item.isSelfReferral && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFF6FF] text-[#1E3A8A] border border-[#BFDBFE] font-medium">
                      Self-Referral (₹99 pack)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <span className="text-xs font-mono text-[#64748B]">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {/* Candidate Info & Assigned Insider */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs">
                <div>
                  <span className="text-[#64748B] text-[10px] block font-mono">CANDIDATE</span>
                  <span className="font-semibold text-[#0F172A]">{item.candidateName}</span>
                  <span className="text-[11px] text-[#64748B] block truncate">{item.university}</span>
                </div>
                <div>
                  <span className="text-[#64748B] text-[10px] block font-mono">VOUCHED BY INSIDER</span>
                  <span className="font-semibold text-[#1E3A8A]">
                    {item.assignedInsiderName || 'Matching with Certified Referee...'}
                  </span>
                  <span className="text-[10px] text-[#64748B] block">Verified Employee</span>
                </div>
                <div>
                  <span className="text-[#64748B] text-[10px] block font-mono">DISPATCH CODE / PROOF</span>
                  <span className="font-mono text-[#0F172A] font-semibold">{item.referralCode}</span>
                  <a
                    href={item.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#2563EB] hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <span>View Submitted Artifact</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Timeline Logs */}
              {item.timelineNotes && item.timelineNotes.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono uppercase text-[#64748B] block font-medium">
                    Verification Milestones:
                  </span>
                  <div className="space-y-1">
                    {item.timelineNotes.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#475569]">
                        <span className="font-mono text-[#1E3A8A] text-[11px] shrink-0 font-bold">[{step.date}]</span>
                        <span>{step.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="text-center py-12 rounded-2xl border border-dashed border-[#CBD5E1] p-6 text-[#64748B] text-xs">
              No referral records match your filter.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white flex items-center justify-between text-xs text-[#64748B] font-mono">
          <span>REFER.ASIA AUDIT COMPLIANT · PAN-ASIAN DISPATCH</span>
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] rounded-lg transition-colors font-medium border border-[#CBD5E1]"
          >
            Close History
          </button>
        </div>
      </div>
    </div>
  );
};
