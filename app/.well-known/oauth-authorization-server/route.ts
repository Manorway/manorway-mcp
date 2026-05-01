/**
 * OAuth 2.1 Authorization Server Metadata (RFC 8414).
 *
 * Tells MCP clients (Claude.ai, ChatGPT, Cursor, Cline, etc.) where to find
 * our OAuth endpoints and what we support.
 */

const METADATA = {
  issuer: 'https://mcp.manorwaygroup.com',
  authorization_endpoint: 'https://mcp.manorwaygroup.com/oauth/authorize',
  token_endpoint: 'https://mcp.manorwaygroup.com/oauth/token',
  registration_endpoint: 'https://mcp.manorwaygroup.com/oauth/register',
  response_types_supported: ['code'],
  grant_types_supported: ['authorization_code'],
  code_challenge_methods_supported: ['S256'],
  token_endpoint_auth_methods_supported: ['none'],
  scopes_supported: ['profile', 'community:read', 'community:write'],
  service_documentation: 'https://mcp.manorwaygroup.com/',
};

export async function GET(): Promise<Response> {
  return new Response(JSON.stringify(METADATA), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
