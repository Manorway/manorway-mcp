# Manorway MCP Server

Public Model Context Protocol (MCP) server exposing Manorway's HOA expertise to ChatGPT, Claude, Cursor, Cline, and other MCP-aware AI clients.

**Live URL:** `https://mcp.manorwaygroup.com/mcp`

## What's here

This is the **public tier** — no authentication, no customer data. Five read-only tools any AI client can call:

- `search_wuciioa` — search Washington WUCIOA / RCW 64.90 statute summaries
- `get_wuciioa_section` — fetch a specific RCW 64.90.XXX section
- `lookup_quorum_requirement` — return WUCIOA quorum rules by meeting type
- `draft_violation_notice_template` — return a generic, board-safe notice template
- `explain_hoa_concept` — plain-English explainer of HOA terminology

## Connecting from ChatGPT

Settings → Connectors → Add → URL: `https://mcp.manorwaygroup.com/mcp`

## Connecting from Claude (web or desktop)

Settings → Connectors → Add Custom Connector → URL: `https://mcp.manorwaygroup.com/mcp`

## Stack

- Next.js 16 (App Router)
- `@vercel/mcp-adapter` 0.11+ for Streamable HTTP transport
- `@modelcontextprotocol/sdk` 1.29+ for the MCP server primitives
- Deployed on Vercel at `mcp.manorwaygroup.com`
- Source of truth: this GitHub repo. All writes via GitHub API.

## Roadmap

- **Tier 2 (authenticated, in progress):** OAuth via Supabase, per-community tools (`query_my_governing_documents`, `book_amenity`, `file_request`, etc.) scoped to the user's actual HOA. Free trial provisioning wedge for new communities.

## Local dev

```
npm install
npm run dev
# server at http://localhost:3000/mcp
```

Built and maintained by [Manorway](https://manorwaygroup.com).
