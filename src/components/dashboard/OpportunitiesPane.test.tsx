import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import OpportunitiesPane from './OpportunitiesPane';
import { makeOpportunity, makeProfile } from '@/test/factories';
import { DEFAULT_WEIGHTS } from '@/lib/calculateScore';

describe('OpportunitiesPane', () => {
  it('sorts invalid deadlines to the end when sorting by deadline', () => {
    const valid = makeOpportunity({ id: 'valid', title: 'Valid Deadline', deadline: '2026-04-20T00:00:00.000Z', score: 80 });
    const invalid = makeOpportunity({ id: 'invalid', title: 'Invalid Deadline', deadline: 'TBD', score: 80 });

    const { container } = render(
      <OpportunitiesPane
        opportunities={[invalid, valid]}
        isExtracting={false}
        activeField={null}
        profile={makeProfile()}
        weights={DEFAULT_WEIGHTS}
        onWeightsChange={() => {}}
        onFieldClick={() => {}}
        onPreparePackage={() => {}}
        onViewDetails={() => {}}
      />
    );

    fireEvent.change(screen.getByDisplayValue('Sort: Score'), {
      target: { value: 'deadline' },
    });

    const text = container.textContent || '';
    expect(text.indexOf('Valid Deadline')).toBeGreaterThan(-1);
    expect(text.indexOf('Invalid Deadline')).toBeGreaterThan(-1);
    expect(text.indexOf('Valid Deadline')).toBeLessThan(text.indexOf('Invalid Deadline'));
  });
});
