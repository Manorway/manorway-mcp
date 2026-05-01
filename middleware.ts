import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge middleware that only handles CORS preflight (OPTIONS) requests.
 * For all other methods we let the request fall through to the route handler
 * untouched — the route handler itself attaches CORS headers to the actual
 * response. This avoids the NextResponse.next() header-mutation pattern that
 * appeared to break the underlying handler in Next.js 16.
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
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/mcp', '/mcp/:path*', '/.well-known/:path*'],
};
