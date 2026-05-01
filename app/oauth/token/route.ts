/**
 * OAuth 2.1 Token Endpoint.
 *
 * MCP client POSTs the auth code (which is a JWT signed by the consent page on
 * manorwaygroup.com) along with the PKCE code_verifier. We verify both and
 * issue an access_token JWT bound to the user's Supabase identity + community.
 */

import { verifyAuthCode, signAccessToken } from '../../../lib/jwt';
import { verifyPkce } from '../../../lib/oauth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
};

export async function POST(req: Request): Promise<Response> {
  // Spec: token endpoint accepts application/x-www-form-urlencoded
  let params: URLSearchParams;
  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const body = await req.text();
    params = new URLSearchParams(body);
  } else if (contentType.includes('application/json')) {
    const json = await req.json();
    params = new URLSearchParams(
      Object.entries(json).map(([k, v]) => [k, String(v)]),
    );
  } else {
    return errorResponse(400, 'invalid_request', 'Content-Type must be application/x-www-form-urlencoded or application/json');
  }

  const grantType = params.get('grant_type');
  const code = params.get('code');
  const redirectUri = params.get('redirect_uri');
  const clientId = params.get('client_id');
  const codeVerifier = params.get('code_verifier');

  if (grantType !== 'authorization_code') {
    return errorResponse(400, 'unsupported_grant_type', 'Only authorization_code is supported');
  }
  if (!code) return errorResponse(400, 'invalid_request', 'code is required');
  if (!redirectUri) return errorResponse(400, 'invalid_request', 'redirect_uri is required');
  if (!codeVerifier) return errorResponse(400, 'invalid_request', 'code_verifier is required');

  let payload;
  try {
    payload = await verifyAuthCode(code);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'invalid_code';
    return errorResponse(400, 'invalid_grant', `Code rejected: ${msg}`);
  }

  if (payload.redirect_uri !== redirectUri) {
    return errorResponse(400, 'invalid_grant', 'redirect_uri does not match authorization request');
  }
  if (clientId && payload.client_id !== clientId) {
    return errorResponse(400, 'invalid_grant', 'client_id does not match authorization request');
  }

  const pkceOk = await verifyPkce(codeVerifier, payload.code_challenge);
  if (!pkceOk) {
    return errorResponse(400, 'invalid_grant', 'PKCE verification failed (code_verifier does not match code_challenge)');
  }

  const accessToken = await signAccessToken({
    sub: payload.sub,
    community_id: payload.community_id,
    client_id: payload.client_id,
    scope: payload.scope,
  });

  return new Response(
    JSON.stringify({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 3600,
      scope: payload.scope,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        ...CORS,
      },
    },
  );
}

export async function OPTIONS(): Promise<Response> {
  return new Response(null, { status: 204, headers: CORS });
}

function errorResponse(
  status: number,
  error: string,
  description: string,
): Response {
  return new Response(JSON.stringify({ error, error_description: description }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      ...CORS,
    },
  });
}
