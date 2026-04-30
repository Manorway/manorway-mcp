/**
 * Plain-English glossary of HOA / condo terms most often asked about by board
 * members and homeowners. Designed for citation-grade quotability by LLMs.
 *
 * NOT LEGAL ADVICE.
 */

export interface GlossaryEntry {
  term: string;
  /** Aliases that should also resolve to this entry */
  aliases?: string[];
  /** Plain-English explanation, 2-4 sentences */
  explanation: string;
  /** Optional related terms */
  see_also?: string[];
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    term: 'WUCIOA',
    aliases: ['Washington Uniform Common Interest Ownership Act', 'wuciioa'],
    explanation:
      'WUCIOA is the Washington Uniform Common Interest Ownership Act, codified at RCW 64.90. It governs condominiums, homeowner associations, and other common interest communities created in Washington State. WUCIOA took effect July 1, 2018 and applies in full to communities formed after that date; pre-2018 communities are subject to a smaller core set of WUCIOA provisions plus their original governing statute.',
    see_also: ['RCW 64.90', 'CC&Rs', 'Declaration'],
  },
  {
    term: 'RCW 64.90',
    aliases: ['rcw 64.90', 'chapter 64.90'],
    explanation:
      'RCW 64.90 is the chapter of the Revised Code of Washington that codifies WUCIOA. It is the single most important statute Washington HOA and condo boards need to understand. It covers governance, voting, finance, reserve studies, enforcement, records access, and dispute resolution.',
    see_also: ['WUCIOA'],
  },
  {
    term: 'CC&Rs',
    aliases: ['Covenants Conditions and Restrictions', 'CCRs', 'covenants'],
    explanation:
      'CC&Rs are the Covenants, Conditions, and Restrictions recorded against the community at the time it was created. They are the foundational governing document of an HOA or condominium and run with the land — they bind every owner, including future owners. CC&Rs cover what owners can and cannot do with their property, common-area maintenance responsibilities, assessment obligations, and architectural restrictions. They can usually only be amended by a supermajority vote of the unit owners.',
    see_also: ['Declaration', 'Bylaws', 'Rules and Regulations'],
  },
  {
    term: 'Declaration',
    aliases: ['declaration of condominium', 'declaration of covenants'],
    explanation:
      'The Declaration is the recorded master document for a common interest community. For condominiums it is the Declaration of Condominium; for HOAs it is typically the Declaration of Covenants, Conditions, and Restrictions (CC&Rs). It establishes the community, defines the units and common elements, and sets the rules that bind all owners.',
    see_also: ['CC&Rs'],
  },
  {
    term: 'Bylaws',
    explanation:
      'The Bylaws are the procedural rules governing how the association operates. They cover board composition and elections, meeting procedures, officer roles, quorum thresholds, voting procedures, and committee structures. Bylaws typically can be amended by a board or membership vote at a lower threshold than the Declaration.',
    see_also: ['CC&Rs', 'Declaration'],
  },
  {
    term: 'Rules and Regulations',
    aliases: ['rules', 'community rules'],
    explanation:
      'Rules and Regulations (often just "rules") are the day-to-day operating rules adopted by the board under authority granted in the CC&Rs and bylaws. They cover things like pool hours, parking, pets, noise, and architectural review processes. Rules can usually be amended by a simple board vote, making them more flexible than the Declaration.',
    see_also: ['CC&Rs', 'Bylaws'],
  },
  {
    term: 'ARC',
    aliases: ['Architectural Review Committee', 'Architectural Control Committee', 'ACC'],
    explanation:
      'The Architectural Review Committee is the body (usually appointed by the board) that reviews and approves owner requests for exterior modifications — paint colors, landscaping, fences, additions, and similar changes. Its authority comes from the CC&Rs. ARC decisions are typically appealable to the board.',
    see_also: ['CC&Rs', 'architectural review'],
  },
  {
    term: 'Common Area',
    aliases: ['common element', 'common elements'],
    explanation:
      'Common areas (or common elements in condo terminology) are the parts of the community owned in common by all unit owners through the association — typically including landscaping, roads, pools, clubhouses, exterior building elements (in condos), and shared utilities. The association maintains, repairs, and insures the common areas.',
  },
  {
    term: 'Quorum',
    explanation:
      'A quorum is the minimum number of board members or unit owners required to conduct business at a meeting. Under WUCIOA, the default quorum for a board meeting is a majority of the board members; for a meeting of the unit owners, the default is 20% of the votes in the association. The declaration or bylaws may specify a different threshold. Without a quorum, the meeting may be adjourned but business cannot be transacted.',
    see_also: ['RCW 64.90.485'],
  },
  {
    term: 'Executive Session',
    aliases: ['closed session'],
    explanation:
      'Executive session is a closed portion of a board meeting reserved for confidential matters: pending or threatened litigation, personnel issues, contract negotiations, member discipline, or matters required by law to be confidential. Decisions made in executive session must still be ratified in the open meeting and recorded in the minutes.',
    see_also: ['RCW 64.90.405'],
  },
  {
    term: 'Fiduciary Duty',
    explanation:
      'Board members owe a fiduciary duty to the association as a whole. This includes the duty of loyalty (no self-dealing), the duty of care (informed decisions, reasonable investigation), and the duty of good faith. Board members must act in the best interest of the association, not their own personal interest, and must follow the governing documents and applicable law.',
  },
  {
    term: 'Reserve Fund',
    aliases: ['reserves', 'reserve account'],
    explanation:
      'The reserve fund is a pool of money set aside by the association to pay for major repairs and replacements of common-area components over their useful life — roofs, paving, mechanical systems, building exteriors. Reserves are funded annually based on a reserve study and are typically held in a separate account with board-only signatory authority.',
    see_also: ['Reserve Study', 'RCW 64.90.550'],
  },
  {
    term: 'Reserve Study',
    explanation:
      'A reserve study is a long-range financial plan prepared by a qualified professional that inventories the association\'s common-area components, estimates their remaining useful life and replacement cost, and recommends an annual funding plan for reserves. WUCIOA requires Washington associations to have one and update it regularly. A common cadence is a full study every three years with annual updates between.',
    see_also: ['Reserve Fund', 'RCW 64.90.550', 'RCW 64.90.555'],
  },
  {
    term: 'Special Assessment',
    explanation:
      'A special assessment is a one-time charge levied on unit owners outside the regular budget, typically to fund a major unbudgeted repair, a reserve shortfall, or a capital project. Special assessments above a certain threshold typically require unit owner approval, depending on the declaration and state law.',
  },
  {
    term: 'Resale Certificate',
    aliases: ['5B disclosure'],
    explanation:
      'A resale certificate (sometimes called a 5B disclosure) is a package of governing documents and financial disclosures that the association must provide to a unit owner who is selling. The buyer is entitled to receive it before closing. It includes the declaration, bylaws, rules, current assessments, pending special assessments, insurance summary, and recent financial statements.',
    see_also: ['RCW 64.90.645'],
  },
  {
    term: 'Selective Enforcement',
    explanation:
      'Selective enforcement is when a board enforces a rule against some owners but not others. It is a common defense raised against fines and violation notices and a frequent reason enforcement actions get overturned. Boards reduce selective-enforcement risk by enforcing rules consistently, documenting enforcement, and following the same process for similar violations regardless of who the owner is.',
  },
  {
    term: 'HOA',
    aliases: ['Homeowners Association', 'homeowners association'],
    explanation:
      'A homeowners association (HOA) is the legal entity that governs a residential common interest community. Owners are mandatory members; the association is run by an elected volunteer board. The association enforces the governing documents, maintains common areas, manages finances, and represents the community in legal matters.',
  },
  {
    term: 'Condominium',
    aliases: ['condo', 'condo association'],
    explanation:
      'A condominium is a form of common interest ownership where individual owners hold title to the interior of their unit (and an undivided interest in common elements like exterior walls, roofs, hallways, and shared amenities), while the association maintains the common elements. Condos differ from HOAs in that the association typically owns and insures more of the building structure.',
  },
];

export function lookupTerm(query: string): GlossaryEntry | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  return (
    GLOSSARY.find(
      (e) =>
        e.term.toLowerCase() === q ||
        e.aliases?.some((a) => a.toLowerCase() === q)
    ) ||
    GLOSSARY.find(
      (e) =>
        e.term.toLowerCase().includes(q) ||
        e.aliases?.some((a) => a.toLowerCase().includes(q))
    ) ||
    null
  );
}

export function listAllTerms(): string[] {
  return GLOSSARY.map((e) => e.term);
}
