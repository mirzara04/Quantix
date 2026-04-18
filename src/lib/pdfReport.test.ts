import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { downloadRankedReportPdf } from './pdfReport';
import { makeOpportunity, makeProfile } from '@/test/factories';

describe('downloadRankedReportPdf', () => {
  const createObjectURL = vi.fn(() => 'blob:mock');
  const revokeObjectURL = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('URL', {
      createObjectURL,
      revokeObjectURL,
    } as unknown as URL);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('creates a blob URL, triggers click, and revokes asynchronously', () => {
    const profile = makeProfile();
    const opportunities = [
      makeOpportunity(),
      makeOpportunity({ id: '2', is_spam: true, score_breakdown: undefined as unknown as never }),
    ];

    const clickSpy = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation(((tagName: string) => {
      if (tagName === 'a') {
        return { click: clickSpy } as unknown as HTMLAnchorElement;
      }
      return originalCreateElement(tagName);
    }) as typeof document.createElement);

    downloadRankedReportPdf(profile, opportunities);

    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1600);
    expect(revokeObjectURL).toHaveBeenCalledTimes(1);

    createElementSpy.mockRestore();
  });
});
