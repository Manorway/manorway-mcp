/**
 * OAuth Protected Resource Metadata for the AUTHENTICATED MCP endpoint
 * (https://mcp.manorwaygroup.com/community/mcp).
 *
 * Advertises the authorization server and required bearer auth, so MCP
 * clients know to start an OAuth flow before calling the resource.
 */

const METADATA = {
  resource: 'https://mcp.manorwaygroup.com/community/mcp',
  authorization_servers: ['https://mcp.manorwaygroup.com'],
  bearer_methods_supported: ['header'],
  scopes_supported: ['profile', 'community:read', 'community:write'],
  resource_documentation: 'https://mcp.manorwaygroup.com/',
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
