import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import OpportunityDetailModal from './OpportunityDetailModal';
import { makeOpportunity } from '@/test/factories';

describe('OpportunityDetailModal', () => {
  it('has dialog accessibility attributes and closes on Escape', () => {
    const onClose = vi.fn();
    render(
      <OpportunityDetailModal
        opportunity={makeOpportunity()}
        onClose={onClose}
        onPreparePackage={() => {}}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'opportunity-modal-title');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
