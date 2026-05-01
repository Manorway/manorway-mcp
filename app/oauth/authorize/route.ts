/**
 * OAuth 2.1 Authorization Endpoint.
 *
 * MCP client redirects user's browser here with the standard OAuth params.
 * We sign a "consent_state" JWT carrying the params and redirect the browser
 * to the consent page on manorwaygroup.com, which handles user login + consent
 * and then redirects back to the MCP client with an auth code.
 */

import { signConsentState } from '../../../lib/jwt';
import { consentPageUrl, normalizeScope } from '../../../lib/oauth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request): Promise<Response> {
  const u = new URL(req.url);
  const params = u.searchParams;

  const responseType = params.get('response_type');
  const clientId = params.get('client_id');
  const redirectUri = params.get('redirect_uri');
  const codeChallenge = params.get('code_challenge');
  const codeChallengeMethod = params.get('code_challenge_method');
  const state = params.get('state') || '';
  const scope = normalizeScope(params.get('scope'));

  if (responseType !== 'code') {
    return redirectError(redirectUri, state, 'unsupported_response_type', 'Only response_type=code is supported');
  }
  if (!clientId) {
    return badRequest('invalid_request', 'client_id is required');
  }
  if (!redirectUri) {
    return badRequest('invalid_request', 'redirect_uri is required');
  }
  if (!codeChallenge) {
    return redirectError(redirectUri, state, 'invalid_request', 'code_challenge is required (PKCE)');
  }
  if (codeChallengeMethod !== 'S256') {
    return redirectError(redirectUri, state, 'invalid_request', 'code_challenge_method must be S256');
  }

  // Sign consent_state and bounce to the consent page.
  const consentState = await signConsentState({
    client_id: clientId,
    redirect_uri: redirectUri,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state,
    scope,
  });

  return Response.redirect(consentPageUrl(consentState), 302);
}

function badRequest(error: string, description: string): Response {
  return new Response(JSON.stringify({ error, error_description: description }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}

function redirectError(
  redirectUri: string | null,
  state: string,
  error: string,
  description: string,
): Response {
  if (!redirectUri) return badRequest(error, description);
  const u = new URL(redirectUri);
  u.searchParams.set('error', error);
  u.searchParams.set('error_description', description);
  if (state) u.searchParams.set('state', state);
  return Response.redirect(u.toString(), 302);
}
