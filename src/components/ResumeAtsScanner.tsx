import React, { useState } from 'react';
import { CompanyId } from '../types';
import { TOP_COMPANIES } from '../data/seed';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight, Zap, RefreshCw, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTactileClick, playSuccessChime } from '../utils/audio';

interface ResumeAtsScannerProps {
  onRequestReferralWithData: (companyId: CompanyId, resumeSample: string) => void;
}

const PRESET_CANDIDATES = [
  {
    label: 'Tier-3 College Prodigy (India)',
    role: 'SDE-1 New Grad',
    company: 'flipkart' as CompanyId,
    content: `Built an event-driven supply chain sync engine handling 65,000 req/sec with < 8ms p99 latency in Go and Kafka. Implemented custom zero-copy memory buffers. Won ACM-ICPC regional algorithmic contest. Self-taught distributed systems from documentation.`,
  },
  {
    label: 'Systems & Backend Hacker (Singapore)',
    role: 'Backend Distributed Engineer',
    company: 'grab' as CompanyId,
    content: `Engineered real-time spatial geofencing algorithms in Go and Redis with 99.99% availability. Created open-source Raft consensus simulation with 1,200 GitHub stars. Top 1% competitive programmer on Codeforces.`,
  },
  {
    label: 'AI & Kernel Researcher (Asia-Pac)',
    role: 'AI Infrastructure Intern',
    company: 'google' as CompanyId,
    content: `Reverse-engineered GPU memory access kernels in Triton and C++ to optimize LLM attention layers, cutting latency by 3.2x on open models. Published preprints on transformer batching and KV-cache compression.`,
  },
];

export const ResumeAtsScanner: React.FC<ResumeAtsScannerProps> = ({ onRequestReferralWithData }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<CompanyId>('google');
  const [resumeText, setResumeText] = useState(PRESET_CANDIDATES[0].content);
  const [targetRole, setTargetRole] = useState('SDE-1 Backend Systems');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    coldAtsScore: number;
    referredPassRate: number;
    keywordMatches: string[];
    missingKeywords: string[];
    feedbackNotes: string[];
  } | null>({
    coldAtsScore: 58,
    referredPassRate: 95,
    keywordMatches: ['High-Throughput Go', 'Kafka Event Streaming', 'Quantifiable Metrics (65k req/sec)', 'Zero-Copy Architecture'],
    missingKeywords: ['Target College Tier-1 Accreditation', 'Corporate ATS Keyword Match'],
    feedbackNotes: [
      'Cold enterprise ATS parsers in Asia automatically penalize non-target universities.',
      'Quantifiable engineering metrics (65,000 req/sec, < 8ms latency) make this an instant insider vouch.',
      'A Refer.asia employee vouch bypasses automated rejection and sends this profile to engineering managers.',
    ],
  });

  const handleScan = () => {
    playTactileClick();
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      setIsScanning(false);
      const isStrongProof = resumeText.toLowerCase().includes('latency') ||
        resumeText.toLowerCase().includes('distributed') ||
        resumeText.toLowerCase().includes('gpu') ||
        resumeText.toLowerCase().includes('req/sec') ||
        resumeText.toLowerCase().includes('github');

      const coldScore = isStrongProof ? 58 : 34;
      const referralRate = isStrongProof ? 96 : 82;

      setScanResult({
        coldAtsScore: coldScore,
        referredPassRate: referralRate,
        keywordMatches: isStrongProof
          ? ['Distributed Systems Concurrency', 'Quantifiable Scale Proof', 'Production Stack Match', 'Engineering Rigor']
          : ['General Syntax', 'Foundational Projects'],
        missingKeywords: ['Tier-1 College Brand Stamp', 'Generic Recruiter Filter Buzzwords'],
        feedbackNotes: [
          'Cold career portals rely on algorithmic keyword scrapers that filter out 97% of valid student resumes.',
          'Direct referral through a verified insider guarantees your portfolio reaches the hiring engineering manager.',
          'Your quantified technical metrics demonstrate immediate value on day 1.',
        ],
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#1E3A8A', '#2563EB', '#38BDF8'],
      });
      playSuccessChime();
    }, 900);
  };

  const handleApplyPreset = (preset: typeof PRESET_CANDIDATES[0]) => {
    playTactileClick();
    setSelectedCompanyId(preset.company);
    setTargetRole(preset.role);
    setResumeText(preset.content);
  };

  const selectedCompany = TOP_COMPANIES.find((c) => c.id === selectedCompanyId) || TOP_COMPANIES[0];

  return (
    <section id="scanner" className="py-24 border-b border-[#E2E8F0] relative bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-mono tracking-widest text-[#1E3A8A] uppercase mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
            <span>Interactive Simulator · Asian Tech Hiring Engine</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#0A2540] tracking-tight mb-4">
            Test Your Resume Against Cold ATS Filters vs. Inside Referral.
          </h2>
          <p className="text-[#475569] text-base leading-relaxed">
            See how algorithmic scrapers reject exceptional candidates in Asia based on college pedigree—and how an insider vouch flips the acceptance rate to 95%+.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-xs font-mono text-[#64748B] mr-2">Try Asian Candidate Presets:</span>
          {PRESET_CANDIDATES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#1E3A8A] text-xs text-[#334155] hover:text-[#1E3A8A] transition-colors font-medium"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Panel */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#F8FAFC] flex flex-col justify-between border border-[#E2E8F0] shadow-sm">
            <div>
              <div className="text-xs font-mono text-[#64748B] uppercase mb-4 flex items-center justify-between">
                <span>Resume & Target Role Input</span>
                <span className="text-[#1E3A8A] font-mono font-bold">LIVE EVALUATION</span>
              </div>

              {/* Target Company Selector */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-[#334155] mb-2">
                  Target Company for Referral in Asia
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {TOP_COMPANIES.slice(0, 10).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        playTactileClick();
                        setSelectedCompanyId(c.id);
                      }}
                      className={`p-2 rounded-xl text-xs font-medium border text-center transition-all truncate ${
                        selectedCompanyId === c.id
                          ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white font-bold shadow-sm'
                          : 'border-[#E2E8F0] bg-white text-[#475569] hover:text-[#0F172A] hover:border-[#CBD5E1]'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Role */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-[#334155] mb-1.5">
                  Target Role / Internship
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              {/* Resume Snippet */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-[#334155] mb-1.5 flex items-center justify-between">
                  <span>Resume Highlight Bullet Points / GitHub Proof</span>
                  <span className="text-[10px] text-[#64748B] font-mono">Proof-of-Work</span>
                </label>
                <textarea
                  rows={6}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your key projects, GitHub metrics, or resume bullet points here..."
                  className="w-full p-3.5 rounded-xl bg-white border border-[#CBD5E1] text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1E3A8A] leading-relaxed font-mono"
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              disabled={isScanning || !resumeText.trim()}
              onClick={handleScan}
              className="w-full py-3.5 text-xs sm:text-sm font-bold bg-[#1E3A8A] hover:bg-[#1E40AF] text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Scanning ATS Filters & Referral Multiplier...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Simulate ATS Scan & Referral Boost</span>
                </>
              )}
            </button>
          </div>

          {/* Results Comparison Panel */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
            {scanResult ? (
              <div className="space-y-6">
                <div className="text-xs font-mono text-[#64748B] uppercase flex items-center justify-between">
                  <span>ATS vs Referral Outcome</span>
                  <span className="text-[#1E3A8A] font-mono font-bold">TARGET: {selectedCompany.name.toUpperCase()}</span>
                </div>

                {/* Score Comparison Meters */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Cold ATS Portal */}
                  <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50 text-center">
                    <span className="text-[11px] font-mono text-rose-700 uppercase block mb-1 font-semibold">Cold Portal Score</span>
                    <div className="font-mono text-3xl sm:text-4xl font-extrabold text-rose-600 tabular-nums">
                      {scanResult.coldAtsScore}<span className="text-lg text-rose-400">/100</span>
                    </div>
                    <span className="text-[11px] text-rose-700 mt-1 block">
                      78% risk of automated filter rejection
                    </span>
                  </div>

                  {/* With Verified Insider Referral */}
                  <div className="p-5 rounded-2xl border border-[#93C5FD] bg-[#EFF6FF] text-center relative overflow-hidden">
                    <span className="text-[11px] font-mono text-[#1E3A8A] uppercase block mb-1 font-bold">Insider Vouch Pass</span>
                    <div className="font-mono text-3xl sm:text-4xl font-extrabold text-[#1E3A8A] tabular-nums">
                      {scanResult.referredPassRate}%
                    </div>
                    <span className="text-[11px] text-[#2563EB] mt-1 block font-medium">
                      Guaranteed Recruiter Queue Priority
                    </span>
                  </div>
                </div>

                {/* Detected Signals */}
                <div className="space-y-3">
                  <div>
                    <span className="text-xs font-mono text-[#64748B] block mb-2 uppercase font-medium">
                      Validated Proof-of-Work Signals:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {scanResult.keywordMatches.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-md text-xs font-mono bg-white text-[#1E3A8A] border border-[#CBD5E1] flex items-center gap-1 shadow-2xs font-medium"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#2563EB]" />
                          <span>{kw}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Notes */}
                  <div className="p-4 rounded-xl border border-[#E2E8F0] bg-white space-y-2">
                    {scanResult.feedbackNotes.map((note, i) => (
                      <div key={i} className="text-xs text-[#334155] flex items-start gap-2 leading-relaxed">
                        <span className="text-[#1E3A8A] font-mono">✦</span>
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action */}
                <div className="pt-4 border-t border-[#E2E8F0]">
                  <button
                    type="button"
                    onClick={() => {
                      playSuccessChime();
                      onRequestReferralWithData(selectedCompanyId, resumeText);
                    }}
                    className="w-full py-3.5 text-xs sm:text-sm font-bold bg-[#1E3A8A] hover:bg-[#1E40AF] text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-98"
                  >
                    <span>Request Verified Referral at {selectedCompany.name}</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-[11px] text-[#64748B] text-center block mt-2 font-mono">
                    {selectedCompany.insiderCount} verified referees available · Avg response {selectedCompany.avgResponseTime}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-[#64748B]">
                <FileText className="w-10 h-10 text-slate-400 mb-3" />
                <p className="text-sm">Click "Simulate ATS Scan" to analyze your resume against {selectedCompany.name} requirements.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
