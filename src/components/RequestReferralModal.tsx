import React, { useState } from 'react';
import { CompanyId, ReferralSubmission, Insider, JobPosition } from '../types';
import { TOP_COMPANIES } from '../data/seed';
import { X, Sparkles, CheckCircle2, Copy, Check, Send, ShieldCheck, QrCode, Zap, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTactileClick, playSuccessChime } from '../utils/audio';

interface RequestReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  userKarmaBalance: number;
  initialCompanyId?: CompanyId;
  initialInsider?: Insider | null;
  initialJob?: JobPosition | null;
  initialResumeText?: string;
  onOpenBuyKarma: () => void;
  onSubmitReferral: (submission: ReferralSubmission, karmaStake: number) => void;
}

export const RequestReferralModal: React.FC<RequestReferralModalProps> = ({
  isOpen,
  onClose,
  userKarmaBalance,
  initialCompanyId = 'google',
  initialInsider,
  initialJob,
  initialResumeText = '',
  onOpenBuyKarma,
  onSubmitReferral,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSelfReferral, setIsSelfReferral] = useState(true);
  const [validationError, setValidationError] = useState('');

  // Form State
  const [candidateName, setCandidateName] = useState('Alex Rivera');
  const [candidateEmail, setCandidateEmail] = useState('alex.rivera@edu.com');
  const [university, setUniversity] = useState('NIT Trichy / Self-Taught');
  const [gradYear, setGradYear] = useState('2027');
  const [companyId, setCompanyId] = useState<CompanyId>(initialCompanyId);
  const [role, setRole] = useState(initialJob?.title || initialInsider?.role || 'SDE-1 Systems Engineer');
  const [resumeUrl, setResumeUrl] = useState('https://github.com/alex-rivera/distributed-cache');
  const [pitch, setPitch] = useState(
    initialResumeText ||
      'Hi! I built a sub-millisecond distributed cache with Raft consensus handling 45k req/sec. Looking for an employee vouch for the SDE team.'
  );
  const [karmaStake, setKarmaStake] = useState<number>(100);

  // Success State
  const [mintedCode, setMintedCode] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (userKarmaBalance < karmaStake) {
      setValidationError(`Insufficient Karma balance (${userKarmaBalance} available, need ${karmaStake}). Buy a ₹99 starter pack!`);
      return;
    }

    if (!pitch.trim() || !candidateName.trim() || !resumeUrl.trim()) {
      setValidationError('Please complete all required fields.');
      return;
    }

    const companyObj = TOP_COMPANIES.find((c) => c.id === companyId) || TOP_COMPANIES[0];
    const ticketCode = `REF-${companyId.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}`;
    setMintedCode(ticketCode);

    const submission: ReferralSubmission = {
      id: `sub-${Date.now()}`,
      candidateName,
      candidateEmail,
      university,
      gradYear,
      targetCompanyId: companyId,
      targetCompanyName: companyObj.name,
      targetRole: role,
      resumeUrl,
      pitch,
      karmaStake,
      status: 'In Review',
      timestamp: 'Just now',
      assignedInsiderName: initialInsider ? initialInsider.name : `${companyObj.name} Verified Insider Pool`,
      referralCode: ticketCode,
      isSelfReferral,
      timelineNotes: [
        { date: 'Just now', note: 'Referral dispatched into Priority Review Queue' }
      ]
    };

    onSubmitReferral(submission, karmaStake);
    playSuccessChime();

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1E3A8A', '#2563EB', '#38BDF8'],
    });

    setStep(2);
  };

  const handleCopyCode = () => {
    playTactileClick();
    navigator.clipboard.writeText(`https://refer.asia/status/${mintedCode}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white border border-[#CBD5E1] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A8A] font-bold">
              REFER.ASIA // VERIFIED INSIDER DISPATCH
            </div>
            <h3 className="font-display text-xl font-bold text-[#0A2540]">
              {step === 2 ? 'Referral Request Dispatched' : 'Request Employee Referral Vouch'}
            </h3>
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

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {validationError && (
                <div className="p-3.5 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenBuyKarma();
                    }}
                    className="px-2.5 py-1 rounded font-bold text-[11px] bg-[#1E3A8A] text-white hover:bg-[#1E40AF] shrink-0 ml-2"
                  >
                    Buy ₹99 Pack
                  </button>
                </div>
              )}

              {/* Self-Referral Toggle */}
              <div className="p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-xs">
                <span className="text-[#334155] font-medium">Application Type:</span>
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#CBD5E1]">
                  <button
                    type="button"
                    onClick={() => {
                      playTactileClick();
                      setIsSelfReferral(true);
                    }}
                    className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                      isSelfReferral ? 'bg-[#1E3A8A] text-white font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    Self-Referral (Myself)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playTactileClick();
                      setIsSelfReferral(false);
                    }}
                    className={`px-3 py-1 rounded-lg transition-colors font-medium ${
                      !isSelfReferral ? 'bg-[#1E3A8A] text-white font-bold' : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    Referring Another Candidate
                  </button>
                </div>
              </div>

              {initialInsider && (
                <div className="p-4 rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] text-white font-bold flex items-center justify-center font-display text-base">
                    {initialInsider.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A]">
                      Requesting Direct Vouch from {initialInsider.name}
                    </div>
                    <div className="text-[11px] text-[#1E3A8A] font-mono font-medium">
                      {initialInsider.role} · {initialInsider.companyName} ({initialInsider.cityHub})
                    </div>
                  </div>
                </div>
              )}

              {/* Candidate Identity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>
              </div>

              {/* Education & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    College / Background
                  </label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    Batch / Graduation Year
                  </label>
                  <input
                    type="text"
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>
              </div>

              {/* Target Company & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    Target Tech Employer *
                  </label>
                  <select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value as CompanyId)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#1E3A8A]"
                  >
                    {TOP_COMPANIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.insiderCount} verified referees)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#334155] mb-1">
                    Role / Position Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#1E3A8A]"
                  />
                </div>
              </div>

              {/* Proof-of-Work Link */}
              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">
                  Resume / GitHub Proof-of-Work URL *
                </label>
                <input
                  type="url"
                  required
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://github.com/... or Google Drive link"
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#1E3A8A] font-mono"
                />
              </div>

              {/* Quantifiable Pitch */}
              <div>
                <label className="block text-xs font-medium text-[#334155] mb-1">
                  Referee Elevator Pitch (Key metrics, throughput, latency, impact)
                </label>
                <textarea
                  rows={3}
                  required
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  placeholder="Mention your key quantifiable accomplishments..."
                  className="w-full p-3 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#1E3A8A] leading-relaxed"
                />
              </div>

              {/* Karma Stake Selector */}
              <div className="p-4 rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-[#0F172A]">Stake Karma Points</span>
                  <span className="text-xs font-mono font-bold text-[#1E3A8A]">
                    Balance: {userKarmaBalance} Karma
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[50, 100, 250, 500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      disabled={amt > userKarmaBalance}
                      onClick={() => {
                        playTactileClick();
                        setKarmaStake(amt);
                      }}
                      className={`py-2 text-xs font-mono rounded-xl border transition-all ${
                        karmaStake === amt
                          ? 'bg-[#1E3A8A] text-white font-bold border-[#1E3A8A]'
                          : amt > userKarmaBalance
                          ? 'opacity-40 cursor-not-allowed border-[#CBD5E1] text-[#94A3B8]'
                          : 'bg-white text-[#475569] border-[#CBD5E1] hover:border-[#1E3A8A]'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>

                {userKarmaBalance < karmaStake && (
                  <div className="mt-2 p-2.5 rounded-xl border border-rose-200 bg-rose-50 flex items-center justify-between text-xs text-rose-800">
                    <span>Insufficient Karma for self-referral.</span>
                    <button
                      type="button"
                      onClick={() => {
                        playTactileClick();
                        onOpenBuyKarma();
                      }}
                      className="px-2.5 py-1 rounded font-bold text-[11px] bg-[#1E3A8A] text-white hover:bg-[#1E40AF]"
                    >
                      Buy 500 Karma for ₹99
                    </button>
                  </div>
                )}
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
                  <Send className="w-3.5 h-3.5 text-white" />
                  <span>Submit to Verified Referees</span>
                </button>
              </div>
            </form>
          ) : (
            /* Success Ticket Screen */
            <div className="py-4 space-y-6 animate-fadeIn">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#1E3A8A] flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-[#2563EB]" />
                </div>
                <h4 className="font-display text-2xl font-bold text-[#0A2540] mb-1">
                  Referral Request Dispatched!
                </h4>
                <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                  Your profile has been queued for review by verified referees at {TOP_COMPANIES.find((c) => c.id === companyId)?.name || 'target company'}.
                </p>
              </div>

              {/* Pass Card */}
              <div className="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#64748B] border-b border-[#E2E8F0] pb-3">
                  <span>REFERRAL TICKET CODE</span>
                  <span className="text-[#1E3A8A] font-bold">{mintedCode}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[#64748B] block text-[10px]">CANDIDATE</span>
                    <span className="text-[#0F172A] font-semibold">{candidateName}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px]">TARGET ROLE</span>
                    <span className="text-[#0F172A] font-semibold">{role}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between">
                  <div className="text-[11px] font-mono text-[#64748B]">
                    Priority SLA: <strong className="text-[#1E3A8A]">&lt; 24h Queue</strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-lg bg-white border border-[#CBD5E1] text-xs font-mono text-[#334155] hover:text-[#1E3A8A] flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-[#2563EB]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied Link' : 'Copy Ticket Link'}</span>
                  </button>
                </div>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    playTactileClick();
                    onClose();
                  }}
                  className="px-8 py-2.5 rounded-xl font-bold text-xs bg-[#1E3A8A] hover:bg-[#1E40AF] text-white transition-all shadow-sm"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
