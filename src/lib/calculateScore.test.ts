import { describe, expect, it } from 'vitest';
import { calculateScore, normalizeWeights } from './calculateScore';
import { makeProfile } from '@/test/factories';
import { ExtractedOpportunityJSON } from './types';

describe('calculateScore', () => {
  it('normalizes weights to 1.0 total', () => {
    const normalized = normalizeWeights({ urgency: 50, fit: 30, status: 10, completeness: 10 });
    const sum = normalized.urgency + normalized.fit + normalized.status + normalized.completeness;
    expect(sum).toBeCloseTo(1, 10);
  });

  it('returns ineligible with eligibility gap when cgpa is below minimum', () => {
    const profile = makeProfile({ cgpa: 6.5, skills: ['React'] });
    const extracted: ExtractedOpportunityJSON = {
      title: 'Strict Internship',
      organization: 'Org',
      type: 'internship',
      deadline: new Date(Date.now() + 86400000).toISOString(),
      stipend: '1000',
      min_cgpa: 8,
      keywords: ['Python'],
      requires_financial_need: false,
      location: 'Remote',
      description: 'desc',
      source_text: 'source',
      apply_link: 'https://example.com',
      required_documents: ['Resume'],
      is_spam: false,
    };

    const result = calculateScore(extracted, profile);
    expect(result.is_eligible).toBe(false);
    expect(result.score).toBe(0);
    expect(result.eligibility_gap).toContain('Need');
  });

  it('returns completeness reason including missing fields', () => {
    const profile = makeProfile();
    const extracted: ExtractedOpportunityJSON = {
      title: 'Incomplete Opp',
      organization: 'Org',
      type: 'fellowship',
      keywords: [],
      description: 'desc',
      source_text: 'source',
      is_spam: false,
    };

    const result = calculateScore(extracted, profile);
    expect(result.breakdown.completeness).toBeLessThan(100);
    expect(result.breakdown.completeness_reason).toContain('Missing');
  });
});
