/**
 * OAuth consent page (Phase 2A).
 *
 * GET renders an HTML page where the user clicks "Authorize" to allow the
 * AI client to connect to Manorway. POST handles the form submission and
 * issues an auth code redirected to the client's redirect_uri.
 *
 * Phase 2A grants every authorized session a "demo" identity so we can prove
 * the OAuth + bearer-token plumbing end-to-end. Phase 2B replaces the demo
 * identity with the real authenticated Supabase user (existing AuthContext on
 * manorwaygroup.com handles login; this page will iframe / redirect through it).
 */

import { verifyConsentState, signAuthCode } from '../../../lib/jwt';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DEMO_USER_ID = '00000000-0000-0000-0000-000000000001';
const DEMO_COMMUNITY_ID = 'cedar-ridge-demo';
const DEMO_USER_NAME = 'Demo Board Member';
const DEMO_COMMUNITY_NAME = 'Cedar Ridge HOA (demo)';

export async function GET(req: Request): Promise<Response> {
  const u = new URL(req.url);
  const consentState = u.searchParams.get('consent_state');
  if (!consentState) {
    return errorPage('Missing consent_state', 'No OAuth consent request was provided.');
  }
  let payload;
  try {
    payload = await verifyConsentState(consentState);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'invalid';
    return errorPage('Invalid or expired consent request', msg);
  }
  return consentPage(consentState, payload);
}

export async function POST(req: Request): Promise<Response> {
  const ct = req.headers.get('content-type') || '';
  let consentState = '';
  let action = '';
  if (ct.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(await req.text());
    consentState = params.get('consent_state') || '';
    action = params.get('action') || '';
  } else if (ct.includes('application/json')) {
    const json = (await req.json()) as Record<string, string>;
    consentState = json.consent_state || '';
    action = json.action || '';
  }
  if (!consentState) {
    return errorPage('Missing consent_state', 'Form submission was malformed.');
  }
  let payload;
  try {
    payload = await verifyConsentState(consentState);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'invalid';
    return errorPage('Invalid or expired consent request', msg);
  }

  if (action !== 'allow') {
    // User clicked Deny — redirect back with error
    const u = new URL(payload.redirect_uri);
    u.searchParams.set('error', 'access_denied');
    u.searchParams.set('error_description', 'User declined to authorize the MCP client');
    if (payload.state) u.searchParams.set('state', payload.state);
    return Response.redirect(u.toString(), 302);
  }

  // Allow — sign auth code and redirect to client
  const code = await signAuthCode({
    sub: DEMO_USER_ID,
    community_id: DEMO_COMMUNITY_ID,
    client_id: payload.client_id,
    redirect_uri: payload.redirect_uri,
    code_challenge: payload.code_challenge,
    code_challenge_method: 'S256',
    scope: payload.scope,
  });

  const redirect = new URL(payload.redirect_uri);
  redirect.searchParams.set('code', code);
  if (payload.state) redirect.searchParams.set('state', payload.state);
  return Response.redirect(redirect.toString(), 302);
}

function consentPage(
  consentState: string,
  payload: { client_id: string; redirect_uri: string; scope: string },
): Response {
  const safeClient = escapeHtml(payload.client_id);
  const safeRedirect = escapeHtml(payload.redirect_uri);
  const scopes = payload.scope.split(/\s+/).filter(Boolean);
  const scopeList = scopes
    .map((s) => `<li><code>${escapeHtml(s)}</code> — ${scopeDescription(s)}</li>`)
    .join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Authorize Manorway MCP</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0B1F3B; background: #F6F8FB; }
    main { max-width: 600px; margin: 64px auto; padding: 0 24px; }
    .card { background: #fff; border: 1px solid #E3E8EF; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(11,31,59,0.06); }
    h1 { font-size: 28px; font-weight: 700; margin: 0 0 8px; }
    .eyebrow { font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #2A7F7A; margin-bottom: 16px; }
    .lede { color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px; }
    h2 { font-size: 16px; font-weight: 700; margin: 24px 0 8px; color: #0B1F3B; }
    ul { padding-left: 20px; color: #374151; line-height: 1.7; }
    code { background: #0B1F3B; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 13px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    .meta { background: #F6F8FB; border: 1px solid #E3E8EF; border-radius: 8px; padding: 16px; font-size: 13px; color: #6B7280; margin: 24px 0; }
    .meta div + div { margin-top: 6px; }
    .actions { display: flex; gap: 12px; margin-top: 32px; }
    button { flex: 1; padding: 14px 20px; border-radius: 10px; font-size: 16px; font-weight: 600; cursor: pointer; border: none; transition: opacity 0.15s; }
    button:hover { opacity: 0.9; }
    .allow { background: #2A7F7A; color: #fff; }
    .deny { background: #fff; color: #0B1F3B; border: 1px solid #E3E8EF; }
    .demo-banner { background: #FFF7ED; border: 1px solid #FDBA74; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #9A3412; margin: 16px 0 24px; }
    footer { text-align: center; margin-top: 24px; font-size: 12px; color: #6B7280; }
    footer a { color: #2A7F7A; text-decoration: none; }
  </style>
</head>
<body>
  <main>
    <div class="card">
      <div class="eyebrow">OAuth authorization</div>
      <h1>Authorize Manorway MCP</h1>
      <p class="lede">An AI client is requesting access to Manorway data on your behalf.</p>

      <div class="demo-banner">
        <strong>Phase 2A demo:</strong> this session will authorize as <em>Demo Board Member</em> at <em>Cedar Ridge HOA (demo)</em>. Phase 2B will plug in real Supabase login and your actual community.
      </div>

      <h2>Requested permissions</h2>
      <ul>${scopeList}</ul>

      <div class="meta">
        <div><strong>Client ID:</strong> ${safeClient}</div>
        <div><strong>Will redirect to:</strong> ${safeRedirect}</div>
      </div>

      <form method="POST" action="/oauth/consent">
        <input type="hidden" name="consent_state" value="${escapeHtml(consentState)}" />
        <div class="actions">
          <button type="submit" name="action" value="deny" class="deny">Deny</button>
          <button type="submit" name="action" value="allow" class="allow">Allow</button>
        </div>
      </form>
    </div>
    <footer>
      <p>Powered by <a href="https://manorwaygroup.com">Manorway</a> · NOT LEGAL ADVICE</p>
    </footer>
  </main>
</body>
</html>`;
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function errorPage(title: string, detail: string): Response {
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${escapeHtml(title)}</title><style>body{font-family:system-ui;margin:64px auto;max-width:560px;padding:0 24px;color:#0B1F3B}h1{color:#9A3412}p{color:#6B7280;line-height:1.6}</style></head><body><h1>${escapeHtml(title)}</h1><p>${escapeHtml(detail)}</p><p>Please try connecting from your AI client again.</p></body></html>`;
  return new Response(html, {
    status: 400,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

function scopeDescription(scope: string): string {
  switch (scope) {
    case 'profile': return 'Read your basic profile (name, email, community).';
    case 'community:read': return 'Read your community\'s governing documents, meetings, and notices.';
    case 'community:write': return 'Submit requests, book amenities, and propose document edits on your behalf.';
    default: return 'Unknown scope.';
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
