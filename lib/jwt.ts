/**
 * Shared JWT signing/verification for the Manorway MCP OAuth flow.
 *
 * Three token kinds, all HS256-signed with MCP_OAUTH_SECRET:
 *   - "consent_state": short-lived (5 min), carries OAuth params from /authorize
 *     to the consent page on manorwaygroup.com
 *   - "auth_code":    short-lived (10 min), issued by manorwaygroup.com after
 *     user consent, exchanged at /oauth/token for an access token
 *   - "access_token": longer-lived (1 hour), bearer token for /community/mcp
 *
 * Secret is shared between the MCP server (mcp.manorwaygroup.com) and the
 * marketing/app site (manorwaygroup.com) via Vercel env var MCP_OAUTH_SECRET.
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const ISSUER = 'https://mcp.manorwaygroup.com';

function getSecret(): Uint8Array {
  const raw = process.env.MCP_OAUTH_SECRET;
  if (!raw) {
    throw new Error(
      'MCP_OAUTH_SECRET is not set. Configure it in Vercel project settings.',
    );
  }
  return new TextEncoder().encode(raw);
}

export interface ConsentStatePayload extends JWTPayload {
  kind: 'consent_state';
  client_id: string;
  redirect_uri: string;
  code_challenge: string;
  code_challenge_method: 'S256';
  state: string;
  scope: string;
}

export interface AuthCodePayload extends JWTPayload {
  kind: 'auth_code';
  sub: string; // Supabase user id
  community_id: string;
  client_id: string;
  redirect_uri: string;
  code_challenge: string;
  code_challenge_method: 'S256';
  scope: string;
}

export interface AccessTokenPayload extends JWTPayload {
  kind: 'access_token';
  sub: string; // Supabase user id
  community_id: string;
  client_id: string;
  scope: string;
}

export async function signConsentState(payload: {
  client_id: string;
  redirect_uri: string;
  code_challenge: string;
  code_challenge_method: 'S256';
  state: string;
  scope: string;
}): Promise<string> {
  return new SignJWT({ ...payload, kind: 'consent_state' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISSUER)
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(getSecret());
}

export async function verifyConsentState(token: string): Promise<ConsentStatePayload> {
  const { payload } = await jwtVerify(token, getSecret(), { issuer: ISSUER });
  if ((payload as ConsentStatePayload).kind !== 'consent_state') {
    throw new Error('Invalid token kind for consent_state');
  }
  return payload as ConsentStatePayload;
}

export async function signAuthCode(payload: {
  sub: string;
  community_id: string;
  client_id: string;
  redirect_uri: string;
  code_challenge: string;
  code_challenge_method: 'S256';
  scope: string;
}): Promise<string> {
  return new SignJWT({ ...payload, kind: 'auth_code' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISSUER)
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime('10m')
    .sign(getSecret());
}

export async function verifyAuthCode(token: string): Promise<AuthCodePayload> {
  const { payload } = await jwtVerify(token, getSecret(), { issuer: ISSUER });
  if ((payload as AuthCodePayload).kind !== 'auth_code') {
    throw new Error('Invalid token kind for auth_code');
  }
  return payload as AuthCodePayload;
}

export async function signAccessToken(payload: {
  sub: string;
  community_id: string;
  client_id: string;
  scope: string;
}): Promise<string> {
  return new SignJWT({ ...payload, kind: 'access_token' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(ISSUER)
    .setSubject(payload.sub)
    .setAudience('https://mcp.manorwaygroup.com/community/mcp')
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(getSecret());
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(token, getSecret(), {
    issuer: ISSUER,
    audience: 'https://mcp.manorwaygroup.com/community/mcp',
  });
  if ((payload as AccessTokenPayload).kind !== 'access_token') {
    throw new Error('Invalid token kind for access_token');
  }
  return payload as AccessTokenPayload;
}
