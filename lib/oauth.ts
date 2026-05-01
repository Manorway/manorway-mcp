/**
 * Helpers for the OAuth 2.1 + PKCE flow.
 */

const CONSENT_PAGE = 'https://manorwaygroup.com/mcp-authorize';

export const SUPPORTED_SCOPES = ['profile', 'community:read', 'community:write'] as const;
export type Scope = (typeof SUPPORTED_SCOPES)[number];

export function consentPageUrl(consentState: string): string {
  const u = new URL(CONSENT_PAGE);
  u.searchParams.set('consent_state', consentState);
  return u.toString();
}

/**
 * Verify a PKCE code_verifier against the code_challenge that was stored at
 * /authorize. Only the S256 method is supported (per OAuth 2.1).
 */
export async function verifyPkce(
  codeVerifier: string,
  codeChallenge: string,
): Promise<boolean> {
  // SHA-256(code_verifier), base64url-encoded
  const data = new TextEncoder().encode(codeVerifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const b64 = base64url(new Uint8Array(hash));
  return b64 === codeChallenge;
}

function base64url(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function isAllowedScope(s: string): s is Scope {
  return (SUPPORTED_SCOPES as readonly string[]).includes(s);
}

export function normalizeScope(raw: string | null | undefined): string {
  if (!raw) return 'profile community:read';
  const parts = raw
    .split(/\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((s): s is Scope => isAllowedScope(s));
  return parts.length ? parts.join(' ') : 'profile community:read';
}
