/**
 * Curated summaries of key WUCIOA (Washington Uniform Common Interest Ownership Act,
 * RCW 64.90) sections most relevant to HOA and condo boards.
 *
 * Source: Revised Code of Washington (RCW). Summaries are paraphrased for plain-language
 * understanding and do not substitute the statute text. Section numbers and titles match
 * the official RCW.
 *
 * NOT LEGAL ADVICE. For board decisions, consult a Washington-licensed attorney.
 */

export interface WuciioaSection {
  /** Section number, e.g. "64.90.445" */
  section: string;
  /** Official section title */
  title: string;
  /** Plain-English summary, 1-3 paragraphs */
  summary: string;
  /** Tags for search */
  tags: string[];
}

export const WUCIOA_SECTIONS: WuciioaSection[] = [
  {
    section: '64.90.405',
    title: 'Meetings of the board',
    summary:
      'Governs how an HOA or condo board must conduct its meetings under WUCIOA. Board meetings must be open to unit owners except when the board enters executive session for limited topics (pending or threatened litigation, personnel matters, contract negotiations, member discipline, or matters required by law to be confidential). Boards must give reasonable notice of meetings to unit owners. Decisions made in executive session must still be ratified in the open meeting and recorded in the minutes.',
    tags: ['board meeting', 'executive session', 'open meeting', 'notice', 'unit owners'],
  },
  {
    section: '64.90.445',
    title: 'Meetings of the unit owners',
    summary:
      'Sets notice requirements for meetings of the unit owners (the membership-wide body, distinct from the board). Notice must be given at least 14 days but not more than 60 days before the meeting. Notice must include the date, time, place, items on the agenda, and (for the annual meeting) the names of any board candidates. SB 5129 (2026) modernized this section to authorize electronic notice and explicit virtual / hybrid meeting authority.',
    tags: ['unit owners meeting', 'annual meeting', 'notice', 'agenda', 'electronic notice', 'virtual meeting', 'SB 5129'],
  },
  {
    section: '64.90.455',
    title: 'Association records',
    summary:
      'Requires the association to maintain specified records and make them available to unit owners on request. Required records include minutes of all meetings of the association and the board, financial records, governing documents, contracts, insurance policies, and current owner lists. Most records must be made available for examination within a reasonable time and at a reasonable cost. Some records (e.g. those relating to litigation, personnel files, or member discipline) are exempt from disclosure.',
    tags: ['records', 'minutes', 'records access', 'records request', 'transparency', 'financial records'],
  },
  {
    section: '64.90.485',
    title: 'Quorum',
    summary:
      'Default quorum at a meeting of the unit owners is 20% of the votes in the association unless the declaration specifies a different threshold. Default quorum at a board meeting is a majority of the board members unless the bylaws specify otherwise. Without a quorum, the meeting may be adjourned but business cannot be transacted.',
    tags: ['quorum', 'voting', 'board meeting', 'unit owners meeting', 'declaration', 'bylaws'],
  },
  {
    section: '64.90.495',
    title: 'Voting — Proxies — Ballots',
    summary:
      'Establishes voting rules for the association: proxies are permitted unless the declaration prohibits them, written or electronic ballots may be used in lieu of an in-person vote, and certain matters (such as amending the declaration) may require a supermajority. Proxies must be in writing, dated, signed, and revocable.',
    tags: ['voting', 'proxy', 'ballot', 'electronic ballot', 'declaration amendment'],
  },
  {
    section: '64.90.525',
    title: 'Budgets — Assessments — Special assessments',
    summary:
      'Requires the board to adopt an annual budget and disclose it to the unit owners. The budget allocates the year\'s expected expenses among the units according to the declaration. The membership has a limited right to ratify or reject the budget at a special meeting; if the membership does not act, the budget is deemed ratified. Special assessments above a threshold typically require unit owner approval.',
    tags: ['budget', 'assessment', 'dues', 'special assessment', 'budget ratification'],
  },
  {
    section: '64.90.545',
    title: 'Lien for sums due association',
    summary:
      'Establishes the association\'s automatic statutory lien on each unit for unpaid assessments, fines, late fees, costs, and certain attorneys\' fees. The lien arises by operation of statute and the recorded declaration; no separate filing is required to perfect it. The lien has priority over most other liens except a first mortgage and certain government liens. The association may foreclose judicially or, where authorized, nonjudicially.',
    tags: ['lien', 'foreclosure', 'unpaid assessments', 'collections', 'priority'],
  },
  {
    section: '64.90.550',
    title: 'Reserve study — Required',
    summary:
      'Requires the association to have a reserve study prepared by a qualified professional. The study inventories common-element components, estimates remaining useful life and replacement cost, and recommends a funding plan. The board must consider the study\'s recommendations when adopting the annual budget. Reserve study requirements apply to communities formed after July 1, 2018, and to pre-existing communities under the WUCIOA core carve-in.',
    tags: ['reserve study', 'reserves', 'qualified professional', 'common elements', 'funding plan'],
  },
  {
    section: '64.90.555',
    title: 'Reserve study — Update',
    summary:
      'The reserve study must be updated regularly. A common practice is a full reserve study every three years with annual updates between, but exact cadence is set by the qualified professional based on the community\'s circumstances. Boards should retain reserve studies as part of association records.',
    tags: ['reserve study update', 'reserves cadence', 'qualified professional'],
  },
  {
    section: '64.90.565',
    title: 'Insurance',
    summary:
      'Requires the association to maintain property insurance on the common elements (and units, in condo communities) and commercial general liability insurance covering the common elements. Coverage thresholds and deductible rules are specified. The association must provide insurance disclosures to unit owners on request.',
    tags: ['insurance', 'property insurance', 'liability insurance', 'common elements'],
  },
  {
    section: '64.90.640',
    title: 'Public offering statement — General provisions',
    summary:
      'Requires a declarant (typically the developer of a new community) to provide a public offering statement to a buyer of a unit. The statement must include specified disclosures about the community, the governing documents, financial information, and the buyer\'s rights. Failure to deliver gives the buyer cancellation rights.',
    tags: ['public offering statement', 'developer disclosure', 'new community', 'buyer rights'],
  },
  {
    section: '64.90.645',
    title: 'Resale certificate (5B disclosure)',
    summary:
      'Requires the association to provide a resale certificate (sometimes called a "5B disclosure") to a unit owner who is selling. The certificate must contain specified governing documents, financial information, pending assessments, current insurance, and other disclosures. The buyer is entitled to receive this package before closing. Failure to deliver a complete certificate can give the buyer cancellation rights.',
    tags: ['resale certificate', '5B disclosure', 'sale', 'buyer disclosure', 'closing'],
  },
];

/**
 * Naive case-insensitive search across section title, summary, and tags.
 * Returns up to `limit` matches ranked by simple match count.
 */
export function searchWuciioa(query: string, limit = 5): WuciioaSection[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = WUCIOA_SECTIONS.map((s) => {
    const haystack = `${s.section} ${s.title} ${s.summary} ${s.tags.join(' ')}`.toLowerCase();
    let score = 0;
    for (const t of tokens) {
      const m = haystack.match(new RegExp(escapeRegExp(t), 'g'));
      if (m) score += m.length;
    }
    return { section: s, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((x) => x.section);
}

export function getWuciioaSection(section: string): WuciioaSection | null {
  const normalized = section.replace(/^RCW\s*/i, '').replace(/\s/g, '').trim();
  return WUCIOA_SECTIONS.find((s) => s.section === normalized) || null;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
