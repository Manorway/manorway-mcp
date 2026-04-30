export default function Home() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px' }}>
      <header style={{ marginBottom: 48 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#2A7F7A',
            marginBottom: 12,
          }}
        >
          MCP Server
        </p>
        <h1 style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.1, marginBottom: 16 }}>
          Manorway HOA tools for AI
        </h1>
        <p style={{ fontSize: 19, color: '#374151', lineHeight: 1.6 }}>
          A public Model Context Protocol server that gives ChatGPT, Claude, Cursor, and any
          MCP-aware AI client direct access to Manorway&rsquo;s HOA expertise — Washington
          WUCIOA / RCW 64.90 lookups, glossary explanations, and board-safe templates. AI
          assists. Boards decide. Documented every step.
        </p>
      </header>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Connect from ChatGPT</h2>
        <ol style={{ fontSize: 16, lineHeight: 1.7, color: '#374151', paddingLeft: 20 }}>
          <li>Open ChatGPT &rarr; Settings &rarr; Connectors</li>
          <li>Add a new MCP connector</li>
          <li>
            Paste this URL:{' '}
            <code style={codeStyle}>https://mcp.manorwaygroup.com/mcp</code>
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Connect from Claude</h2>
        <ol style={{ fontSize: 16, lineHeight: 1.7, color: '#374151', paddingLeft: 20 }}>
          <li>Open Claude &rarr; Settings &rarr; Connectors &rarr; Add Custom Connector</li>
          <li>
            Paste this URL:{' '}
            <code style={codeStyle}>https://mcp.manorwaygroup.com/mcp</code>
          </li>
        </ol>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>What you can ask</h2>
        <ul style={{ fontSize: 16, lineHeight: 1.7, color: '#374151', paddingLeft: 20 }}>
          <li>&ldquo;What does WUCIOA require for HOA board meeting notice?&rdquo;</li>
          <li>&ldquo;Look up RCW 64.90.485.&rdquo;</li>
          <li>&ldquo;Draft a violation notice template for unauthorized exterior paint.&rdquo;</li>
          <li>&ldquo;What is selective enforcement and why does it matter?&rdquo;</li>
          <li>&ldquo;What&rsquo;s the quorum for a Washington HOA board meeting?&rdquo;</li>
        </ul>
      </section>

      <section style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Tools exposed</h2>
        <ul style={{ fontSize: 16, lineHeight: 1.7, color: '#374151', paddingLeft: 20 }}>
          <li>
            <code style={codeStyle}>search_wuciioa</code> — search WA WUCIOA / RCW 64.90 statute
            summaries
          </li>
          <li>
            <code style={codeStyle}>get_wuciioa_section</code> — fetch a specific RCW 64.90.XXX
          </li>
          <li>
            <code style={codeStyle}>lookup_quorum_requirement</code> — quorum rules by meeting
            type
          </li>
          <li>
            <code style={codeStyle}>draft_violation_notice_template</code> — board-safe template
            generator
          </li>
          <li>
            <code style={codeStyle}>explain_hoa_concept</code> — plain-English HOA term explainer
          </li>
        </ul>
      </section>

      <footer
        style={{
          borderTop: '1px solid #E3E8EF',
          paddingTop: 24,
          fontSize: 13,
          color: '#6B7280',
        }}
      >
        <p>
          Built and maintained by{' '}
          <a
            href="https://manorwaygroup.com"
            style={{ color: '#2A7F7A', textDecoration: 'none' }}
          >
            Manorway
          </a>
          . Manorway is an AI-assisted governance platform for HOA and condo boards in Washington
          State. The information returned by this MCP server is general and does not constitute
          legal advice.
        </p>
        <p style={{ marginTop: 8 }}>
          Source:{' '}
          <a
            href="https://github.com/Manorway/manorway-mcp"
            style={{ color: '#2A7F7A', textDecoration: 'none' }}
          >
            github.com/Manorway/manorway-mcp
          </a>
        </p>
      </footer>
    </main>
  );
}

const codeStyle: React.CSSProperties = {
  background: '#0B1F3B',
  color: '#FFFFFF',
  padding: '2px 8px',
  borderRadius: 4,
  fontSize: 14,
  fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
};
