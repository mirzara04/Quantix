import { StudentProfile, Opportunity, ScoreBreakdown, ExtractedOpportunityJSON } from './types';

export function calculateScore(
  extracted: ExtractedOpportunityJSON,
  profile: StudentProfile
): { score: number; breakdown: ScoreBreakdown; is_eligible: boolean } {
  const minCgpa = extracted.min_cgpa ?? 0;
  const is_eligible = profile.cgpa >= minCgpa;

  if (!is_eligible) {
    return {
      score: 0,
      breakdown: {
        urgency: 0,
        fit: 0,
        status: 0,
        total: 0,
        urgency_reason: 'Not applicable',
        fit_reason: 'Not applicable',
        status_reason: 'Not applicable',
      },
      is_eligible: false,
    };
  }

  let urgencyScore = 0;
  let urgencyReason = 'No deadline specified';

  if (extracted.deadline) {
    const deadline = new Date(extracted.deadline);
    const now = new Date();
    const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilDeadline < 0) {
      urgencyScore = 0;
      urgencyReason = 'Deadline has passed';
    } else if (hoursUntilDeadline <= 24) {
      urgencyScore = 100;
      urgencyReason = `Deadline in ${Math.floor(hoursUntilDeadline)}h — CRITICAL`;
    } else if (hoursUntilDeadline <= 72) {
      urgencyScore = Math.round(100 * Math.exp(-0.01 * (hoursUntilDeadline - 24)));
      urgencyReason = `Deadline in ${Math.floor(hoursUntilDeadline)}h — URGENT`;
    } else if (hoursUntilDeadline <= 168) {
      urgencyScore = Math.round(60 * Math.exp(-0.005 * (hoursUntilDeadline - 72)));
      urgencyReason = `Deadline in ${Math.floor(hoursUntilDeadline / 24)} days`;
    } else if (hoursUntilDeadline <= 720) {
      urgencyScore = Math.round(35 * Math.exp(-0.002 * (hoursUntilDeadline - 168)));
      urgencyReason = `Deadline in ~${Math.floor(hoursUntilDeadline / 24)} days`;
    } else {
      urgencyScore = 10;
      urgencyReason = `Deadline in ${Math.floor(hoursUntilDeadline / 24)} days — Low urgency`;
    }
  }

  const opportunityKeywords = extracted.keywords.map((k) => k.toLowerCase().trim());
  const studentSkills = profile.skills.map((s) => s.toLowerCase().trim());

  let matchedCount = 0;
  for (const kw of opportunityKeywords) {
    if (studentSkills.some((sk) => sk.includes(kw) || kw.includes(sk))) {
      matchedCount++;
    }
  }

  const fitScore =
    opportunityKeywords.length > 0
      ? Math.min(100, Math.round((matchedCount / opportunityKeywords.length) * 100))
      : 50;

  const fitReason =
    opportunityKeywords.length > 0
      ? `${matchedCount}/${opportunityKeywords.length} skills matched`
      : 'No specific skills required';

  let statusScore = 0;
  let statusReason = 'Standard opportunity';

  if (extracted.requires_financial_need && profile.financial_need) {
    statusScore = 100;
    statusReason = 'Financial need requirement met';
  } else if (extracted.requires_financial_need && !profile.financial_need) {
    statusScore = 20;
    statusReason = 'Financial need required but not flagged';
  } else if (!extracted.requires_financial_need) {
    statusScore = 60;
    statusReason = 'Open to all applicants';
  }

  const total = Math.round(urgencyScore * 0.4 + fitScore * 0.4 + statusScore * 0.2);

  return {
    score: total,
    breakdown: {
      urgency: urgencyScore,
      fit: fitScore,
      status: statusScore,
      total,
      urgency_reason: urgencyReason,
      fit_reason: fitReason,
      status_reason: statusReason,
    },
    is_eligible: true,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 50) return 'text-amber-400';
  return 'text-red-400';
}

export function getScoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-500/20 border-emerald-500/50';
  if (score >= 50) return 'bg-amber-500/20 border-amber-500/50';
  return 'bg-red-500/20 border-red-500/50';
}

export function getScorePulse(score: number): string {
  if (score >= 80) return 'shadow-emerald-500/50';
  if (score >= 50) return 'shadow-amber-500/50';
  return 'shadow-red-500/50';
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent Match';
  if (score >= 65) return 'Good Match';
  if (score >= 50) return 'Moderate Match';
  if (score >= 30) return 'Weak Match';
  return 'Poor Match';
}
