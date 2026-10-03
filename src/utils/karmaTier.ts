export type KarmaTierName = 'Novice' | 'Scout' | 'Insider' | 'Archon' | 'Grandmaster' | 'Legend';

export interface KarmaTier {
  name: KarmaTierName;
  minPoints: number;
  nextTierPoints: number | null;
  badgeClass: string;
  dotClass: string;
  glowClass: string;
  iconType: 'novice' | 'scout' | 'insider' | 'archon' | 'grandmaster' | 'legend';
  description: string;
  perks: string[];
}

export const KARMA_TIERS: Record<KarmaTierName, KarmaTier> = {
  Novice: {
    name: 'Novice',
    minPoints: 0,
    nextTierPoints: 250,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300 shadow-2xs',
    dotClass: 'bg-slate-400',
    glowClass: 'from-slate-200/50 to-transparent',
    iconType: 'novice',
    description: 'Entry-level candidate or new builder exploring the Asian referral network.',
    perks: ['Claim +50 daily telemetry Karma', 'Browse verified Asian tech directories'],
  },
  Scout: {
    name: 'Scout',
    minPoints: 250,
    nextTierPoints: 500,
    badgeClass: 'bg-sky-50 text-sky-800 border-sky-200 shadow-2xs font-medium',
    dotClass: 'bg-sky-500',
    glowClass: 'from-sky-200/50 to-transparent',
    iconType: 'scout',
    description: 'Active talent scout reviewing peers and spotting non-target college prodigies.',
    perks: ['Vouch for peer candidate portfolios', 'Earn +150 Karma per matched invite'],
  },
  Insider: {
    name: 'Insider',
    minPoints: 500,
    nextTierPoints: 1000,
    badgeClass: 'bg-blue-50 text-[#1E3A8A] border-blue-200 shadow-2xs font-semibold',
    dotClass: 'bg-[#2563EB]',
    glowClass: 'from-blue-200/50 to-transparent',
    iconType: 'insider',
    description: 'Verified candidate or tech worker with proven skin-in-the-game stakes.',
    perks: ['Submit direct referrals to Google, Grab, Flipkart', 'Guaranteed 24h insider triage queue'],
  },
  Archon: {
    name: 'Archon',
    minPoints: 1000,
    nextTierPoints: 2500,
    badgeClass: 'bg-indigo-50 text-indigo-900 border-indigo-200 shadow-xs font-bold',
    dotClass: 'bg-indigo-600 animate-pulse',
    glowClass: 'from-indigo-200/50 to-transparent',
    iconType: 'archon',
    description: 'Unlocked the Lifetime Reciprocal Vouch Shield. Network guarantees priority career support.',
    perks: ['Lifetime Career Vouch Shield active', 'Executive referee endorsements across Asia'],
  },
  Grandmaster: {
    name: 'Grandmaster',
    minPoints: 2500,
    nextTierPoints: 4500,
    badgeClass: 'bg-purple-50 text-purple-900 border-purple-200 shadow-xs font-bold',
    dotClass: 'bg-purple-600',
    glowClass: 'from-purple-200/50 to-transparent',
    iconType: 'grandmaster',
    description: 'Prolific ecosystem mentor with dozens of confirmed high-scale placements.',
    perks: ['Priority campus hiring direct line', 'Custom referral bounty allocation'],
  },
  Legend: {
    name: 'Legend',
    minPoints: 4500,
    nextTierPoints: null,
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-300 font-extrabold ring-1 ring-amber-300/50 shadow-sm',
    dotClass: 'bg-amber-500 animate-ping',
    glowClass: 'from-amber-200/50 to-transparent',
    iconType: 'legend',
    description: 'The pinnacle of community reputation. Top 10 pan-Asian referral powerhouse.',
    perks: ['Permanent Hall of Fame placement', 'Global executive talent circle access'],
  },
};

export function getKarmaTier(karmaPoints: number): KarmaTier {
  if (karmaPoints >= 4500) return KARMA_TIERS.Legend;
  if (karmaPoints >= 2500) return KARMA_TIERS.Grandmaster;
  if (karmaPoints >= 1000) return KARMA_TIERS.Archon;
  if (karmaPoints >= 500) return KARMA_TIERS.Insider;
  if (karmaPoints >= 250) return KARMA_TIERS.Scout;
  return KARMA_TIERS.Novice;
}

export function getKarmaProgressToNextTier(karmaPoints: number): {
  currentTier: KarmaTier;
  nextTier: KarmaTier | null;
  progressPercent: number;
  pointsRemaining: number;
} {
  const current = getKarmaTier(karmaPoints);
  
  if (!current.nextTierPoints) {
    return {
      currentTier: current,
      nextTier: null,
      progressPercent: 100,
      pointsRemaining: 0,
    };
  }

  const rangeTotal = current.nextTierPoints - current.minPoints;
  const progressIntoTier = Math.max(0, karmaPoints - current.minPoints);
  const progressPercent = Math.min(100, Math.round((progressIntoTier / rangeTotal) * 100));
  const pointsRemaining = Math.max(0, current.nextTierPoints - karmaPoints);

  // find next tier object
  let nextTier: KarmaTier | null = null;
  if (current.name === 'Novice') nextTier = KARMA_TIERS.Scout;
  else if (current.name === 'Scout') nextTier = KARMA_TIERS.Insider;
  else if (current.name === 'Insider') nextTier = KARMA_TIERS.Archon;
  else if (current.name === 'Archon') nextTier = KARMA_TIERS.Grandmaster;
  else if (current.name === 'Grandmaster') nextTier = KARMA_TIERS.Legend;

  return {
    currentTier: current,
    nextTier,
    progressPercent,
    pointsRemaining,
  };
}
