import { Opportunity, StudentProfile } from '@/lib/types';

export const makeProfile = (overrides: Partial<StudentProfile> = {}): StudentProfile => ({
  name: 'Test User',
  degree: 'B.Tech Computer Science',
  semester: 6,
  cgpa: 8.2,
  skills: ['Python', 'React', 'Machine Learning'],
  financial_need: false,
  location_preference: 'Remote',
  ...overrides,
});

export const makeOpportunity = (overrides: Partial<Opportunity> = {}): Opportunity => ({
  id: 'opp-1',
  title: 'AI Fellowship',
  organization: 'Test Org',
  type: 'fellowship',
  deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  stipend: '5000',
  min_cgpa: 7.0,
  keywords: ['Python', 'Machine Learning'],
  requires_financial_need: false,
  location: 'Remote',
  description: 'Great opportunity',
  apply_link: 'https://example.com/apply',
  required_documents: ['Resume'],
  source_text: 'Deadline: soon\nSkills: Python',
  evidence_markers: [{ field: 'keywords', text: 'Skills: Python', start: 0, end: 14 }],
  score: 80,
  score_breakdown: { urgency: 70, fit: 90, status: 60, completeness: 80, total: 80 },
  rank_reason: 'Strong fit',
  eligibility_gap: null,
  is_eligible: true,
  is_spam: false,
  spam_signals: [],
  status: 'complete',
  ...overrides,
});
