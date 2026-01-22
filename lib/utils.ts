export type AccessTier = 'PRIORITY ACCESS' | 'WAITLIST' | 'DENIED';

export interface AccessStatus {
  tier: AccessTier;
  reason: string;
  color: string;
}

export function determineAccess(score: number, vouches: number): AccessStatus {
  if (score >= 1400 && vouches >= 5) {
    return {
      tier: 'PRIORITY ACCESS',
      reason: 'You have a high credibility score (≥1400) and strong community backing (≥5 vouches).',
      color: 'bg-green-500',
    };
  }
  
  if (score >= 1200) {
    return {
      tier: 'WAITLIST',
      reason: 'You have a good credibility score (≥1200) but need more community vouches.',
      color: 'bg-yellow-500',
    };
  }
  
  return {
    tier: 'DENIED',
    reason: 'Your Ethos credibility score is below the minimum threshold of 1200.',
    color: 'bg-red-500',
  };
}