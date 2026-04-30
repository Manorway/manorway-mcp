import type { ReactNode } from 'react';

export const metadata = {
  title: 'Manorway MCP Server — HOA tools for ChatGPT, Claude, and AI clients',
  description:
    'Public Model Context Protocol server for Washington HOA and condo board expertise. WUCIOA / RCW 64.90 lookups, glossary, board-safe templates.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          color: '#0B1F3B',
          background: '#F6F8FB',
        }}
      >
        {children}
      </body>
    </html>
  );
}
