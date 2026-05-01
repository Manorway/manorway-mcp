/**
 * Authenticated MCP endpoint — tier 2.
 *
 * Requires a valid Bearer access_token issued by /oauth/token. The token's
 * `sub` claim is the Supabase user id; `community_id` is the user's
 * community. Both are passed to the tool handlers via closure.
 *
 * For Phase 2A we ship a single demo tool, `whoami`, that returns the
 * authenticated user's identity + community. Phase 2B adds the per-community
 * data tools (governing-doc Q&A, amenity booking, request filing, balance).
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { verifyAccessToken, type AccessTokenPayload } from '../../../lib/jwt';

const CORS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Accept, Authorization, Mcp-Session-Id, MCP-Protocol-Version, Last-Event-ID',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id, MCP-Protocol-Version',
};

const RESOURCE_METADATA_URL =
  'https://mcp.manorwaygroup.com/.well-known/oauth-protected-resource/community/mcp';

const DISCLAIMER =
  'NOT LEGAL ADVICE. The Manorway MCP server provides general HOA / condo guidance and should not be relied on as legal advice.';

function buildServer(auth: AccessTokenPayload): McpServer {
  const server = new McpServer({
    name: 'manorway-mcp-community',
    version: '0.2.0',
  });

  // -------------------------------------------------------------------------
  // whoami — returns the authenticated user's identity + community
  // -------------------------------------------------------------------------
  server.registerTool(
    'whoami',
    {
      title: 'Who am I?',
      description:
        'Return the authenticated Manorway user and community. Use this as the smoke-test for whether the OAuth connection is working.',
      inputSchema: {},
    },
    async () => {
      const text = `## Manorway authenticated session\n\n**User ID:** ${auth.sub}\n**Community ID:** ${auth.community_id}\n**Scopes:** ${auth.scope}\n**Client:** ${auth.client_id}\n**Token expires:** ${auth.exp ? new Date(auth.exp * 1000).toISOString() : 'unknown'}\n\nThis confirms your AI client is connected to Manorway with a valid OAuth token. Per-community data tools (governing-document Q&A, amenity booking, request filing, balance lookup) are coming in the next release.\n\n---\n\n${DISCLAIMER}`;
      return { content: [{ type: 'text', text }] };
    },
  );

  return server;
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function authenticate(req: Request): Promise<
  | { ok: true; auth: AccessTokenPayload }
  | { ok: false; response: Response }
> {
  const authHeader = req.headers.get('authorization') || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({ error: 'invalid_token', error_description: 'Missing Bearer token' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'WWW-Authenticate': `Bearer realm="manorway-mcp", resource_metadata="${RESOURCE_METADATA_URL}"`,
            ...CORS,
          },
        },
      ),
    };
  }
  try {
    const auth = await verifyAccessToken(match[1]);
    return { ok: true, auth };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'invalid_token';
    return {
      ok: false,
      response: new Response(
        JSON.stringify({ error: 'invalid_token', error_description: msg }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'WWW-Authenticate': `Bearer realm="manorway-mcp", error="invalid_token", error_description="${msg}", resource_metadata="${RESOURCE_METADATA_URL}"`,
            ...CORS,
          },
        },
      ),
    };
  }
}

async function handle(req: Request): Promise<Response> {
  try {
    const authResult = await authenticate(req);
    if (!authResult.ok) return authResult.response;

    const server = buildServer(authResult.auth);
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    await server.connect(transport);

    const sdkResponse = await transport.handleRequest(req);
    const headers = new Headers(sdkResponse.headers);
    for (const [k, v] of Object.entries(CORS)) headers.set(k, v);
    return new Response(sdkResponse.body, {
      status: sdkResponse.status,
      statusText: sdkResponse.statusText,
      headers,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const stack =
      err instanceof Error && err.stack
        ? err.stack.split('\n').slice(0, 5).join(' | ')
        : '';
    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        id: null,
        error: {
          code: -32603,
          message: 'Internal error in Manorway authenticated MCP handler',
          data: { message, stack },
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS },
      },
    );
  }
}

export async function POST(req: Request): Promise<Response> {
  return handle(req);
}
export async function GET(req: Request): Promise<Response> {
  return handle(req);
}
export async function DELETE(req: Request): Promise<Response> {
  return handle(req);
}
