import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EmailPane from './EmailPane';
import { makeOpportunity } from '@/test/factories';

describe('EmailPane', () => {
  it('does not render invalid sync date label', () => {
    render(
      <EmailPane
        emailText="sample"
        onEmailChange={() => {}}
        onExtract={() => {}}
        onSyncInbox={() => {}}
        onOpenConnector={() => {}}
        isExtracting={false}
        isSyncingInbox={false}
        lastSyncAt="not-a-date"
        gmailConnected={false}
        activeField={null}
        opportunities={[]}
      />
    );

    expect(screen.queryByText(/Synced/i)).not.toBeInTheDocument();
  });

  it('highlights marker text containing html specials safely', () => {
    const opp = makeOpportunity({
      id: '1',
      evidence_markers: [{ field: 'keywords', text: '<AI & ML>', start: 0, end: 9 }],
    });

    const { container } = render(
      <EmailPane
        emailText={'Skills include <AI & ML> and Python'}
        onEmailChange={() => {}}
        onExtract={() => {}}
        onSyncInbox={() => {}}
        onOpenConnector={() => {}}
        isExtracting={false}
        isSyncingInbox={false}
        lastSyncAt={null}
        gmailConnected={true}
        activeField={{ opportunityId: '1', field: 'keywords' }}
        opportunities={[opp]}
      />
    );

    expect(container.querySelector('mark.highlight-evidence')).toBeInTheDocument();
  });
});
