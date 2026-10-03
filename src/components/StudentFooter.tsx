import React from 'react';
import { playTactileClick } from '../utils/audio';

export const StudentFooter: React.FC = () => {
  return (
    <footer className="bg-[#FFFFFF] border-t border-[#E2E8F0] py-16 text-xs text-[#64748B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#E2E8F0]">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="font-display text-xl font-extrabold tracking-tight text-[#0A2540] flex items-center gap-2">
              <span className="gradient-text-blue">REFER.ASIA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A]"></span>
            </div>
            <p className="text-[#475569] text-sm max-w-sm leading-relaxed font-normal">
              Democratizing employee referrals for students and builders across Asia. Inspired by the Why Zero University manifesto: proof-of-work over pedigree.
            </p>
            <div className="text-[11px] font-mono text-[#64748B]">
              Active Tech Hubs: Bengaluru · Singapore · Tokyo · Seoul · Gurugram · Jakarta · Hyderabad
            </div>
          </div>

          {/* Core Modules */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-[#0F172A] font-bold font-mono text-[11px] uppercase tracking-wider">
              Refer.asia Platform
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#why" onClick={playTactileClick} className="hover:text-[#1E3A8A] transition-colors">
                  The Why
                </a>
              </li>
              <li>
                <a href="#scanner" onClick={playTactileClick} className="hover:text-[#1E3A8A] transition-colors">
                  ATS Scanner
                </a>
              </li>
              <li>
                <a href="#insiders" onClick={playTactileClick} className="hover:text-[#1E3A8A] transition-colors">
                  Verified Referees
                </a>
              </li>
              <li>
                <a href="#stories" onClick={playTactileClick} className="hover:text-[#1E3A8A] transition-colors font-medium">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#leaderboard" onClick={playTactileClick} className="hover:text-[#1E3A8A] transition-colors font-semibold text-[#1E3A8A]">
                  Karma Leaderboard (Top 10)
                </a>
              </li>
              <li>
                <a href="#jobs" onClick={playTactileClick} className="hover:text-[#1E3A8A] transition-colors">
                  2027 Roles
                </a>
              </li>
            </ul>
          </div>

          {/* Story Chapters */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-[#0F172A] font-bold font-mono text-[11px] uppercase tracking-wider">
              Manifesto
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#why" onClick={playTactileClick} className="hover:text-[#1E3A8A] transition-colors">
                  01. The Meat Grinder
                </a>
              </li>
              <li>
                <a href="#why" onClick={playTactileClick} className="hover:text-[#1E3A8A] transition-colors">
                  02. 85% Secret Track
                </a>
              </li>
              <li>
                <a href="#why" onClick={playTactileClick} className="hover:text-[#1E3A8A] transition-colors">
                  03. Referee Flywheel
                </a>
              </li>
              <li>
                <a href="#why" onClick={playTactileClick} className="hover:text-[#1E3A8A] transition-colors">
                  04. Beyond Tier-1 Colleges
                </a>
              </li>
            </ul>
          </div>

          {/* Guarantees */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[#0F172A] font-bold font-mono text-[11px] uppercase tracking-wider">
              Referee & Candidate Invariants
            </div>
            <p className="text-[11px] text-[#475569] leading-relaxed">
              Self-referrals are protected by ₹99 INR skin-in-the-game tokens. Referees who post roles and reach 1,000 Karma receive lifetime priority job vouches from our executive network.
            </p>
            <div className="text-[10px] font-mono text-[#1E3A8A] font-semibold">
              PAN-ASIAN EMPLOYEE REFERRAL PROTOCOL // VERIFIED VOUCH
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[#64748B]">
            &copy; {new Date().getFullYear()} Refer.asia. All rights reserved. Built for sovereign Asian tech builders.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-[#64748B]">
            <span>₹99 / S$1.60 Self-Referral Guarantee</span>
            <span>·</span>
            <span>1,000 Karma Job Insurance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
