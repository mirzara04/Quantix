import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ProxySyncSchema = z.object({
  mailboxId: z.string().trim().min(1).max(320),
  endpoint: z.string().trim().url(),
  token: z.string().trim().optional().default(''),
  limit: z.number().int().min(1).max(50).optional().default(8),
});

const BLOCKED_HOSTS = new Set([
  'localhost',
  'metadata.google.internal',
  '169.254.169.254',
  '0.0.0.0',
]);

function isIpv4(host: string): boolean {
  return /^\d+\.\d+\.\d+\.\d+$/.test(host);
}

function isPrivateIpv4(host: string): boolean {
  const parts = host.split('.').map((p) => Number(p));
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) {
    return true;
  }

  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a >= 224) return true;
  return false;
}

function isBlockedIpv6(host: string): boolean {
  const normalized = host.toLowerCase();
  if (normalized === '::1') return true;
  if (normalized.startsWith('fe80:')) return true;
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
  return false;
}

function isAllowedByWhitelist(hostname: string): boolean {
  const configured = process.env.ALLOWED_SYNC_HOSTS?.split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  if (!configured || configured.length === 0) {
    return true;
  }

  return configured.some((allowed) => hostname === allowed || hostname.endsWith(`.${allowed}`));
}

function validateSyncEndpoint(endpoint: string): URL {
  const url = new URL(endpoint);

  if (url.protocol !== 'https:') {
    throw new Error('Only https endpoints are allowed');
  }

  const hostname = url.hostname.toLowerCase();

  if (BLOCKED_HOSTS.has(hostname) || hostname.endsWith('.local')) {
    throw new Error('Blocked sync host');
  }

  const hasDot = hostname.includes('.');
  if (!hasDot && !isIpv4(hostname) && !hostname.includes(':')) {
    throw new Error('Host must be a fully qualified domain name');
  }

  if (isIpv4(hostname) && isPrivateIpv4(hostname)) {
    throw new Error('Private or reserved IPs are not allowed');
  }

  if (hostname.includes(':') && isBlockedIpv6(hostname)) {
    throw new Error('Local IPv6 ranges are not allowed');
  }

  if (!isAllowedByWhitelist(hostname)) {
    throw new Error('Host is not in allowlist');
  }

  return url;
}

export async function POST(req: NextRequest) {
  try {
    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json({ error: 'Malformed JSON' }, { status: 400 });
    }

    const parsed = ProxySyncSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid sync request payload' }, { status: 400 });
    }

    const { mailboxId, endpoint, token, limit } = parsed.data;

    let targetUrl: URL;
    try {
      targetUrl = validateSyncEndpoint(endpoint);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid endpoint';
      console.warn('Blocked sync endpoint:', { mailboxId, endpoint, reason: message });
      return NextResponse.json({ error: 'Sync endpoint validation failed' }, { status: 400 });
    }

    const upstream = await fetch(targetUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ mailboxId, limit }),
      cache: 'no-store',
    });

    const text = await upstream.text();
    let body: unknown = text;
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      body = { raw: text };
    }

    if (!upstream.ok) {
      return NextResponse.json({ error: 'Inbox sync failed', details: body }, { status: upstream.status });
    }

    return NextResponse.json(body);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync proxy failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
