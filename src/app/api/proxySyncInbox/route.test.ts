import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { POST } from './route';

describe('proxySyncInbox route', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('rejects non-https endpoints', async () => {
    const req = new Request('http://localhost/api/proxySyncInbox', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        mailboxId: 'user@example.com',
        endpoint: 'http://insecure.example.com/sync',
        token: 'x',
        limit: 5,
      }),
    });

    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  it('forwards to validated endpoint and returns upstream payload', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ emails: [{ from: 'a', subject: 'b', body: 'c' }] }), { status: 200 }));

    const req = new Request('http://localhost/api/proxySyncInbox', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        mailboxId: 'user@example.com',
        endpoint: 'https://mail.example.com/sync',
        token: 'secret',
        limit: 3,
      }),
    });

    const res = await POST(req as never);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.emails).toHaveLength(1);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
