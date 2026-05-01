import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * CORS middleware for the MCP endpoint. Claude.ai, ChatGPT, and other
 * browser-based MCP clients send a CORS preflight OPTIONS request before
 * making the actual POST. We intercept OPTIONS here and add CORS headers to
 * every other response so the browser allows them.
 *
 * Public tier is fully open — any origin is allowed. When tier 2 (auth) ships
 * we'll narrow Allow-Origin appropriately.
 */

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Accept, Authorization, Mcp-Session-Id, MCP-Protocol-Version, Last-Event-ID',
  'Access-Control-Expose-Headers': 'Mcp-Session-Id, MCP-Protocol-Version',
  'Access-Control-Max-Age': '86400',
};

export function middleware(request: NextRequest) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  // Continue to the route handler, then attach CORS headers on the way back
  const response = NextResponse.next();
  for (const [k, v] of Object.entries(CORS_HEADERS)) {
    response.headers.set(k, v);
  }
  return response;
}

export const config = {
  matcher: '/mcp/:path*',
};
