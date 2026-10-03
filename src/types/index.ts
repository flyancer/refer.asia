export type CompanyId = 
  | 'google' 
  | 'meta' 
  | 'apple' 
  | 'amazon' 
  | 'microsoft' 
  | 'grab' 
  | 'flipkart' 
  | 'bytedance' 
  | 'stripe' 
  | 'zomato';

export interface Company {
  id: CompanyId;
  name: string;
  brandHex: string;
  cityHub: string;
  openReferralsCount: number;
  avgResponseTime: string;
  topRoles: string[];
  insiderCount: number;
  bonusPayout: string;
}

export interface Insider {
  id: string;
  name: string;
  handle: string;
  role: string;
  companyId: CompanyId;
  companyName: string;
  department: string;
  cityHub: string;
  referralsCompleted: number;
  karmaScore: number;
  acceptanceRate: string;
  universityAlum: string;
  bio: string;
  verified: boolean;
  tags: string[];
  availableSlots: number;
}

export interface JobPosition {
  id: string;
  title: string;
  company: string;
  companyId: CompanyId;
  location: string;
  type: 'Internship' | 'New Grad' | 'Entry-Level' | 'Early Career';
  department: string;
  salaryRange: string;
  urgent: boolean;
  referralBonus: string;
  refereeKarmaReward: number; // e.g. 250 Karma
  tags: string[];
  postedBy?: string;
}

export interface StoryChapter {
  id: string;
  number: string;
  title: string;
  lead: string;
  statKicker: string;
  statValue: string;
  statLabel: string;
  thesis: string[];
  critique: string;
  remedy: string;
  quote: {
    text: string;
    attribution: string;
  };
}

export interface ReferralSubmission {
  id: string;
  candidateName: string;
  candidateEmail: string;
  university: string;
  gradYear: string;
  targetCompanyId: CompanyId;
  targetCompanyName: string;
  targetRole: string;
  resumeUrl: string;
  pitch: string;
  karmaStake: number;
  status: 'In Review' | 'Matched with Insider' | 'Submitted to Internal ATS' | 'Interview Scheduled' | 'Offer Extended';
  referralCode: string;
  timestamp: string;
  isSelfReferral: boolean;
  assignedInsiderName?: string;
  timelineNotes?: { date: string; note: string }[];
}

export interface CurrencyOption {
  code: string;
  symbol: string;
  price: number;
  displayPrice: string;
  region: string;
  karmaPoints: number;
}

export type KarmaTierName = 'Novice' | 'Scout' | 'Insider' | 'Archon' | 'Grandmaster' | 'Legend';

export interface UserStudentProfile {
  name: string;
  handle: string;
  university: string;
  gradYear: string;
  city: string;
  karmaPoints: number;
  karmaTier?: KarmaTierName;
  skills: string[]; // Candidate technical skills (e.g. ['React', 'Go', 'Python', 'TypeScript'])
  isReferee: boolean;
  totalRolesPosted: number;
  unlockedPriorityShield: boolean; // Unlocks at 1000 Karma points!
  activeRequests: ReferralSubmission[];
  referralHistory: ReferralSubmission[];
}

export type LeaderboardCategory = 'all-time' | 'month-sprint' | 'referees' | 'rising';

export interface LeaderboardMember {
  rank: number;
  id: string;
  name: string;
  handle: string;
  role: string;
  companyName: string;
  companyId: CompanyId;
  cityHub: string;
  country: string;
  flag: string;
  karmaPoints: number;
  referralsCompleted: number;
  rolesPosted: number;
  hiresConfirmed: number;
  badgeTier: 'Grandmaster' | 'Archon Referee' | 'Oracle Scout' | 'Elite Insider' | 'Rising Prodigy';
  hasPriorityShield: boolean;
  weeklyKarmaGain: number;
  recentHighlight: string;
  bio: string;
  verified: boolean;
  topSkill: string;
  acceptanceRate: string;
}
