/**
 * OAuth 2.0 Protected Resource Metadata (RFC 9728).
 *
 * The MCP authorization spec requires servers to either accept Bearer tokens
 * with this metadata advertising authorization servers, OR explicitly indicate
 * the resource accepts unauthenticated access. Several MCP clients (Claude.ai
 * among them) probe this endpoint before the handshake and refuse to connect
 * if the document is missing or malformed.
 *
 * Tier 1 of the Manorway MCP server is fully public — no authentication
 * required. We advertise that with an empty `authorization_servers` array.
 * When tier 2 (auth) ships we'll move authenticated tools to a separate path
 * and serve the appropriate metadata for that resource.
 */

const PUBLIC_METADATA = {
  resource: 'https://mcp.manorwaygroup.com/mcp',
  // No authorization servers — this resource accepts unauthenticated requests.
  authorization_servers: [] as string[],
  // No bearer token methods supported.
  bearer_methods_supported: [] as string[],
  // Documentation pointer.
  resource_documentation: 'https://mcp.manorwaygroup.com/',
};

export async function GET(): Promise<Response> {
  return new Response(JSON.stringify(PUBLIC_METADATA), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
