import React, { useState } from 'react';
import { ASIAN_CURRENCIES } from '../data/seed';
import { CurrencyOption } from '../types';
import { X, Sparkles, CheckCircle2, ShieldCheck, Zap, CreditCard, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTactileClick, playSuccessChime } from '../utils/audio';

interface BuyKarmaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessBuy: (pointsAwarded: number, currency: CurrencyOption) => void;
}

export const BuyKarmaModal: React.FC<BuyKarmaModalProps> = ({
  isOpen,
  onClose,
  onSuccessBuy,
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(ASIAN_CURRENCIES[0]); // Default INR ₹99
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    playTactileClick();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
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
      onSuccessBuy(selectedCurrency.karmaPoints, selectedCurrency);
    }, 1200);
  };

  const resetAndClose = () => {
    setIsCompleted(false);
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white border border-[#CBD5E1] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#1E3A8A] flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 text-[#2563EB]" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#1E3A8A] font-bold">
                REFER.ASIA // CANDIDATE STARTER PACK
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#0A2540]">
                {isCompleted ? 'Karma Pack Credited!' : 'Unlock Karma Points for Self-Referral'}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              playTactileClick();
              resetAndClose();
            }}
            className="p-1 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {!isCompleted ? (
            <div className="space-y-6">
              {/* Value Proposition */}
              <div className="p-4 rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] text-xs text-[#334155] leading-relaxed space-y-2">
                <div className="font-semibold text-[#1E3A8A] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#2563EB]" />
                  <span>Why do candidates need Karma to refer themselves?</span>
                </div>
                <p>
                  To eliminate bot spam and protect the time of verified insiders at Google, Grab, and Flipkart, self-referrals require a small initial skin-in-the-game token. Get <strong className="text-[#0F172A]">500 Karma points</strong> for just <strong className="text-[#1E3A8A]">₹99 INR</strong> (or your local Asian currency).
                </p>
              </div>

              {/* Currency Selector Grid */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#64748B] mb-2 font-medium">
                  Select Your Asian Currency & Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ASIAN_CURRENCIES.map((curr) => {
                    const isSelected = curr.code === selectedCurrency.code;
                    return (
                      <button
                        key={curr.code}
                        type="button"
                        onClick={() => {
                          playTactileClick();
                          setSelectedCurrency(curr);
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-[#1E3A8A] bg-[#EFF6FF] text-[#0F172A] shadow-sm'
                            : 'border-[#CBD5E1] bg-white text-[#475569] hover:text-[#0F172A] hover:border-[#94A3B8]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-[#0F172A] font-mono">{curr.displayPrice}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-[#1E3A8A] border border-[#CBD5E1]">
                            {curr.code}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#64748B] truncate">
                          {curr.region.split('(')[0]}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pack Breakdown */}
              <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#334155]">
                  <span>Starter Karma Allocation</span>
                  <span className="font-mono font-bold text-[#1E3A8A] text-sm">+{selectedCurrency.karmaPoints} Karma</span>
                </div>
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>Self-Referral Pass Capacity</span>
                  <span className="font-mono text-[#0F172A] font-medium">Up to 5 company applications</span>
                </div>
                <div className="flex items-center justify-between text-[#64748B]">
                  <span>Insider Matching SLA</span>
                  <span className="font-mono text-[#1E3A8A] font-medium">&lt; 24h Response</span>
                </div>
                <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between font-semibold">
                  <span className="text-[#0F172A]">Total Amount Due</span>
                  <span className="font-mono text-[#1E3A8A] text-base font-bold">{selectedCurrency.displayPrice}</span>
                </div>
              </div>

              {/* Instant Simulated Checkout Action */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleSimulatePayment}
                className="w-full py-3.5 text-xs sm:text-sm font-bold bg-[#1E3A8A] hover:bg-[#1E40AF] text-white rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Processing {selectedCurrency.displayPrice} via {selectedCurrency.code}...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay {selectedCurrency.displayPrice} & Receive 500 Karma</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Completed Screen */
            <div className="py-6 text-center space-y-5 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-[#EFF6FF] text-[#1E3A8A] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-[#2563EB]" />
              </div>
              <div>
                <h4 className="font-display text-2xl font-bold text-[#0A2540] mb-1">
                  Payment Successful!
                </h4>
                <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                  {selectedCurrency.displayPrice} received. Your account has been credited with <strong className="text-[#1E3A8A]">+{selectedCurrency.karmaPoints} Karma Points</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] font-mono text-xs text-[#1E3A8A] font-semibold">
                <span>NEW KARMA BALANCE ACTIVATED FOR SELF-REFERRAL</span>
              </div>

              <button
                type="button"
                onClick={resetAndClose}
                className="px-6 py-2.5 text-xs font-bold bg-[#1E3A8A] hover:bg-[#1E40AF] text-white rounded-xl transition-all shadow-sm"
              >
                Continue to Self-Referral Form
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
