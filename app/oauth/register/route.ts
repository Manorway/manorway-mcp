/**
 * OAuth 2.1 Dynamic Client Registration (RFC 7591).
 *
 * MCP clients (Claude.ai, ChatGPT, Cursor) call this endpoint to register
 * themselves and receive a client_id. We auto-approve every request and
 * derive a stable client_id from the redirect_uris so re-registration is
 * idempotent.
 *
 * No client_secret is issued — public clients use PKCE (S256).
 */

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
};

interface RegistrationRequest {
  redirect_uris?: string[];
  client_name?: string;
  token_endpoint_auth_method?: string;
  grant_types?: string[];
  response_types?: string[];
  scope?: string;
}

export async function POST(req: Request): Promise<Response> {
  let body: RegistrationRequest = {};
  try {
    body = await req.json();
  } catch {
    return errorResponse(400, 'invalid_client_metadata', 'Body must be JSON');
  }

  const redirectUris = Array.isArray(body.redirect_uris)
    ? body.redirect_uris.filter((u) => typeof u === 'string' && u.length > 0)
    : [];

  if (redirectUris.length === 0) {
    return errorResponse(
      400,
      'invalid_client_metadata',
      'redirect_uris is required and must contain at least one URI',
    );
  }

  // Derive a stable client_id by hashing the sorted redirect_uris. Same client,
  // same id on re-registration.
  const sortedUris = [...redirectUris].sort().join('|');
  const hash = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(sortedUris),
  );
  const clientId = `mcp_${base64url(new Uint8Array(hash)).slice(0, 32)}`;

  const response = {
    client_id: clientId,
    client_id_issued_at: Math.floor(Date.now() / 1000),
    redirect_uris: redirectUris,
    token_endpoint_auth_method: 'none',
    grant_types: ['authorization_code'],
    response_types: ['code'],
    client_name: body.client_name || 'MCP Client',
    scope: 'profile community:read community:write',
  };

  return new Response(JSON.stringify(response), {
    status: 201,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
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
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

function base64url(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
