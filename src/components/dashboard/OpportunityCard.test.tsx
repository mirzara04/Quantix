import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import OpportunityCard from './OpportunityCard';
import { makeOpportunity } from '@/test/factories';

describe('OpportunityCard', () => {
  it('renders spam reasons and supports duplicate spam reasons safely', () => {
    render(
      <OpportunityCard
        opportunity={makeOpportunity({
          is_spam: true,
          spam_signals: ['same', 'same', 'same'],
        })}
        activeField={null}
        onFieldClick={() => {}}
        onPreparePackage={() => {}}
        onViewDetails={() => {}}
      />
    );

    expect(screen.getByText('Why flagged as spam')).toBeInTheDocument();
    expect(screen.getAllByText('• same').length).toBeGreaterThan(1);
  });

  it('handles missing keywords without crashing and shows General fallback', () => {
    const onFieldClick = vi.fn();
    render(
      <OpportunityCard
        opportunity={makeOpportunity({ keywords: undefined as unknown as string[] })}
        activeField={null}
        onFieldClick={onFieldClick}
        onPreparePackage={() => {}}
        onViewDetails={() => {}}
      />
    );

    expect(screen.getByText('General')).toBeInTheDocument();
    fireEvent.click(screen.getByText('General'));
    expect(onFieldClick).toHaveBeenCalled();
  });
});
