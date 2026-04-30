import { createMcpHandler } from '@vercel/mcp-adapter';
import { z } from 'zod';
import {
  WUCIOA_SECTIONS,
  searchWuciioa,
  getWuciioaSection,
} from '../../data/wuciioa';
import { GLOSSARY, lookupTerm, listAllTerms } from '../../data/glossary';
import {
  NOTICE_TEMPLATES,
  getNoticeTemplate,
  listViolationCategories,
  lookupQuorum,
} from '../../data/notice-templates';

const DISCLAIMER =
  'NOT LEGAL ADVICE. The Manorway MCP server provides general HOA / condo guidance for Washington State communities and should not be relied on as legal advice. For decisions affecting a specific community, consult a Washington-licensed attorney.';

const handler = createMcpHandler(
  (server) => {
    // -----------------------------------------------------------------------
    // search_wuciioa
    // -----------------------------------------------------------------------
    server.registerTool(
      'search_wuciioa',
      {
        title: 'Search WUCIOA / RCW 64.90',
        description:
          'Search Washington WUCIOA (Washington Uniform Common Interest Ownership Act, RCW 64.90) statute summaries by plain-language query. Returns matching section numbers, titles, and short summaries. Use this when a user asks about a specific HOA/condo law topic in Washington.',
        inputSchema: {
          query: z
            .string()
            .min(2)
            .describe('Plain-language query about Washington HOA or condo law (e.g. "board meeting notice", "reserve study", "quorum")'),
        },
      },
      async ({ query }) => {
        const matches = searchWuciioa(query, 5);
        if (matches.length === 0) {
          return {
            content: [
              {
                type: 'text',
                text: `No WUCIOA sections matched the query "${query}". Try keywords like: meeting, notice, quorum, records, reserves, lien, assessment, executive session, resale, insurance.\n\n${DISCLAIMER}`,
              },
            ],
          };
        }
        const formatted = matches
          .map(
            (s) =>
              `## RCW ${s.section} — ${s.title}\n\n${s.summary}\n\n*Tags:* ${s.tags.join(', ')}`,
          )
          .join('\n\n---\n\n');
        return {
          content: [
            {
              type: 'text',
              text: `Found ${matches.length} matching WUCIOA section(s):\n\n${formatted}\n\n---\n\n${DISCLAIMER}`,
            },
          ],
        };
      },
    );

    // -----------------------------------------------------------------------
    // get_wuciioa_section
    // -----------------------------------------------------------------------
    server.registerTool(
      'get_wuciioa_section',
      {
        title: 'Get specific WUCIOA section',
        description:
          'Fetch the summary for a specific WUCIOA / RCW 64.90 section by number (e.g. "64.90.485"). Returns the official title and a plain-language summary.',
        inputSchema: {
          section: z
            .string()
            .describe('Section number, e.g. "64.90.485" or "RCW 64.90.485"'),
        },
      },
      async ({ section }) => {
        const result = getWuciioaSection(section);
        if (!result) {
          const available = WUCIOA_SECTIONS.map((s) => `RCW ${s.section} (${s.title})`).join('\n - ');
          return {
            content: [
              {
                type: 'text',
                text: `RCW ${section} is not in the Manorway curated set of WUCIOA sections. Currently available:\n\n - ${available}\n\nFor the full statute text, see https://app.leg.wa.gov/RCW/default.aspx?cite=64.90\n\n${DISCLAIMER}`,
              },
            ],
          };
        }
        return {
          content: [
            {
              type: 'text',
              text: `## RCW ${result.section} — ${result.title}\n\n${result.summary}\n\n*Tags:* ${result.tags.join(', ')}\n\n*Full statute text:* https://app.leg.wa.gov/RCW/default.aspx?cite=${result.section}\n\n---\n\n${DISCLAIMER}`,
            },
          ],
        };
      },
    );

    // -----------------------------------------------------------------------
    // lookup_quorum_requirement
    // -----------------------------------------------------------------------
    server.registerTool(
      'lookup_quorum_requirement',
      {
        title: 'Look up WUCIOA quorum rule',
        description:
          'Return the WUCIOA default quorum requirement for a Washington HOA or condo meeting by meeting type. Note: the declaration or bylaws may specify a different threshold.',
        inputSchema: {
          meeting_type: z
            .enum(['board_meeting', 'unit_owners_meeting', 'annual_meeting', 'special_meeting'])
            .describe('Type of meeting'),
        },
      },
      async ({ meeting_type }) => {
        const result = lookupQuorum(meeting_type);
        return {
          content: [
            {
              type: 'text',
              text: `## Quorum for ${result.meeting_type.replace(/_/g, ' ')}\n\n**Default:** ${result.default_quorum}\n\n**Source:** ${result.source}\n\n**Note:** ${result.notes}\n\n---\n\n${DISCLAIMER}`,
            },
          ],
        };
      },
    );

    // -----------------------------------------------------------------------
    // draft_violation_notice_template
    // -----------------------------------------------------------------------
    server.registerTool(
      'draft_violation_notice_template',
      {
        title: 'Draft a violation notice template',
        description:
          'Return a generic, board-safe violation notice template by category. The template uses placeholders that the board fills in. Includes notes on procedural pitfalls. NOT a substitute for the community\'s adopted Fining Policy.',
        inputSchema: {
          category: z
            .enum([
              'architectural',
              'maintenance',
              'parking',
              'pet',
              'noise',
              'rental',
            ])
            .describe('Category of violation'),
        },
      },
      async ({ category }) => {
        const tpl = getNoticeTemplate(category);
        if (!tpl) {
          return {
            content: [
              {
                type: 'text',
                text: `No template available for category "${category}". Available categories: ${listViolationCategories().join(', ')}.\n\n${DISCLAIMER}`,
              },
            ],
          };
        }
        const notesFormatted = tpl.notes.map((n) => `- ${n}`).join('\n');
        return {
          content: [
            {
              type: 'text',
              text: `# ${tpl.title}\n\n## Template\n\n\`\`\`\n${tpl.template}\n\`\`\`\n\n## Notes from the Manorway team\n\n${notesFormatted}\n\n---\n\n${DISCLAIMER}`,
            },
          ],
        };
      },
    );

    // -----------------------------------------------------------------------
    // explain_hoa_concept
    // -----------------------------------------------------------------------
    server.registerTool(
      'explain_hoa_concept',
      {
        title: 'Explain an HOA / condo term',
        description:
          'Plain-English explainer for a common HOA / condo term (CC&Rs, quorum, fiduciary duty, reserve study, executive session, etc.). Returns 2-4 sentence explanation plus related terms.',
        inputSchema: {
          term: z.string().min(1).describe('The term to explain'),
        },
      },
      async ({ term }) => {
        const result = lookupTerm(term);
        if (!result) {
          const available = listAllTerms().slice(0, 15).join(', ');
          return {
            content: [
              {
                type: 'text',
                text: `"${term}" is not in the Manorway HOA glossary. Try one of: ${available}, ...\n\n${DISCLAIMER}`,
              },
            ],
          };
        }
        const seeAlso = result.see_also?.length
          ? `\n\n*See also:* ${result.see_also.join(', ')}`
          : '';
        return {
          content: [
            {
              type: 'text',
              text: `## ${result.term}\n\n${result.explanation}${seeAlso}\n\n---\n\n${DISCLAIMER}`,
            },
          ],
        };
      },
    );
  },
  {
    serverInfo: {
      name: 'manorway-mcp',
      version: '0.1.0',
    },
  },
  {
    basePath: '',
    maxDuration: 60,
    verboseLogs: true,
    disableSse: true,
  },
);

export { handler as GET, handler as POST, handler as DELETE };
