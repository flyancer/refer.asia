import React, { useState } from 'react';
import { CompanyId, JobPosition } from '../types';
import { TOP_COMPANIES } from '../data/seed';
import { X, Sparkles, PlusCircle, CheckCircle2, ShieldAlert, Award, Briefcase } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTactileClick, playSuccessChime } from '../utils/audio';

interface PostRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKarma: number;
  onSuccessPostRole: (newJob: JobPosition, karmaEarned: number) => void;
}

export const PostRoleModal: React.FC<PostRoleModalProps> = ({
  isOpen,
  onClose,
  currentKarma,
  onSuccessPostRole,
}) => {
  const [roleTitle, setRoleTitle] = useState('');
  const [companyId, setCompanyId] = useState<CompanyId>('google');
  const [location, setLocation] = useState('Bengaluru / Singapore (Hybrid)');
  const [roleType, setRoleType] = useState<JobPosition['type']>('Internship');
  const [department, setDepartment] = useState('Core Engineering');
  const [salaryRange, setSalaryRange] = useState('₹1,20,000 / month / S$7,500');
  const [refereeName, setRefereeName] = useState('You (Verified Referee)');
  const [tags, setTags] = useState('Distributed Systems, Go, Kubernetes');
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim()) return;

    const compName = TOP_COMPANIES.find((c) => c.id === companyId)?.name || 'Google Asia';
    const karmaEarned = 250;

    const newJob: JobPosition = {
      id: `job-posted-${Date.now()}`,
      title: roleTitle,
      company: compName,
      companyId: companyId,
      location: location,
      type: roleType,
      department: department,
      salaryRange: salaryRange,
      urgent: true,
      referralBonus: 'Company Standard Bonus',
      refereeKarmaReward: karmaEarned,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      postedBy: refereeName,
    };

    playSuccessChime();
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#1E3A8A', '#2563EB', '#38BDF8'],
      });
    } catch {
      // graceful
    }

    onSuccessPostRole(newJob, karmaEarned);
    setIsCompleted(true);
  };

  const handleClose = () => {
    setIsCompleted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white border border-[#CBD5E1] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#1E3A8A] flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5 text-[#2563EB]" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A8A] font-bold">
                REFEREE PRIVILEGE // POST OPEN POSITION
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#0A2540]">
                {isCompleted ? 'Role Published & +250 Karma Awarded!' : 'Post a Position & Earn Referee Karma'}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              playTactileClick();
              handleClose();
            }}
            className="p-1 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {!isCompleted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Referee Incentive Banner */}
              <div className="p-4 rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] text-xs text-[#334155] leading-relaxed space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-[#1E3A8A]">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#2563EB]" />
                    <span>Earn +250 Karma Points per Posted Role</span>
                  </span>
                  <span className="font-mono text-[#1E3A8A] text-[11px] bg-white px-2 py-0.5 rounded border border-[#BFDBFE] font-bold">
                    Current: {currentKarma} / 1,000
                  </span>
                </div>
                <p>
                  Referees earn Karma whenever they post an opening or vouch for candidates. Once you accumulate <strong className="text-[#0F172A]">1,000 Karma points</strong>, you unlock the <strong className="text-[#1E3A8A]">Future Priority Job Vouch Shield</strong>—guaranteeing top-priority referrals when you need a job in the future!
                </p>
              </div>

              {/* Form Fields */}
              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">
                  Job Position Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SDE-1 Backend Systems, AI Compiler Intern"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    Your Company *
                  </label>
                  <select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value as CompanyId)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#1E3A8A]"
                  >
                    {TOP_COMPANIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    Job Classification *
                  </label>
                  <select
                    value={roleType}
                    onChange={(e) => setRoleType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#1E3A8A]"
                  >
                    <option value="Internship">Internship (Summer 2027)</option>
                    <option value="New Grad">New Grad (2026/2027)</option>
                    <option value="Entry-Level">Entry-Level (0–2 YOE)</option>
                    <option value="Early Career">Early Career (2–4 YOE)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    Location / Asian Tech Hub *
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    Stipend / Salary Range
                  </label>
                  <input
                    type="text"
                    value={salaryRange}
                    onChange={(e) => setSalaryRange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">
                  Required Skills & Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1E3A8A] font-mono"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    onClose();
                  }}
                  className="px-4 py-2.5 text-xs text-[#64748B] hover:text-[#0F172A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold bg-[#1E3A8A] hover:bg-[#1E40AF] text-white rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-white" />
                  <span>Publish Role (+250 Referee Karma)</span>
                </button>
              </div>
            </form>
          ) : (
            /* Completed Confirmation */
            <div className="py-6 text-center space-y-5 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-[#EFF6FF] text-[#1E3A8A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-[#2563EB]" />
              </div>
              <div>
                <h4 className="font-display text-2xl font-bold text-[#0A2540] mb-1">
                  Role Published to Refer.asia!
                </h4>
                <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                  Candidates can now discover this opening and submit their proof-of-work directly to you. You received <strong className="text-[#1E3A8A]">+250 Referee Karma Points</strong>!
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] text-xs text-[#64748B] space-y-1">
                <div className="font-mono text-[#1E3A8A] font-bold">
                  PROGRESS TOWARD 1,000 KARMA FUTURE JOB SHIELD
                </div>
                <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden mt-2 border border-[#CBD5E1]">
                  <div
                    className="bg-[#1E3A8A] h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, ((currentKarma + 250) / 1000) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-[#64748B] font-mono mt-1">
                  {currentKarma + 250 >= 1000 ? '🎉 1,000 Milestone Reached! Future VIP Job Vouch Unlocked' : `${1000 - (currentKarma + 250)} points remaining to unlock future career insurance`}
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 text-xs font-bold bg-[#1E3A8A] hover:bg-[#1E40AF] text-white rounded-xl transition-all shadow-sm"
              >
                Done & View on Board
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
