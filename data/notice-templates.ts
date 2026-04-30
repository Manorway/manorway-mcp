/**
 * Generic, board-safe violation notice templates and quorum lookup.
 * Templates intentionally use placeholders the board fills in. Designed to be
 * a starting point, not a substitute for the board's own enforcement policies
 * or legal review.
 *
 * NOT LEGAL ADVICE.
 */

export type ViolationCategory =
  | 'architectural'
  | 'maintenance'
  | 'parking'
  | 'pet'
  | 'noise'
  | 'rental'
  | 'trash'
  | 'landscaping';

export interface NoticeTemplate {
  category: ViolationCategory;
  title: string;
  template: string;
  notes: string[];
}

export const NOTICE_TEMPLATES: NoticeTemplate[] = [
  {
    category: 'architectural',
    title: 'Architectural Violation Notice',
    template: `[Date]

[Owner Name]
[Property Address]

Dear [Owner Name],

This is a formal notice of a violation of the [Community Name] Covenants, Conditions, and Restrictions (CC&Rs) and/or Architectural Guidelines.

VIOLATION: An exterior modification was observed at your property that does not appear to have received approval from the Architectural Review Committee (ARC) as required under [Section X.X] of the CC&Rs and the Architectural Guidelines.

Specifically: [describe the modification — e.g., paint color change, fence installation, exterior addition, landscaping alteration].

REQUIRED ACTION: Please submit an after-the-fact ARC application within [14 / 30] days of this notice for review. Alternatively, restore the property to its prior approved condition within [30] days.

If the modification was previously approved, please provide a copy of the approval letter or ARC reference number.

Continued non-compliance after [date] may result in fines as authorized by [Section X.X] of the CC&Rs and the Board's adopted Fining Policy. The Board reserves all remedies available under the governing documents and Washington law.

You have the right to a hearing before the Board to contest this notice. To request a hearing, contact [contact info] within [X] days.

Sincerely,
[Board Member Name]
[Title]
[Community Name] Board of Directors`,
    notes: [
      'Confirm the specific CC&R section and Architectural Guideline cited match your community.',
      'Use board-adopted timelines for response and cure (typical: 14–30 days).',
      'Document the violation with dated photos and keep them in the enforcement file.',
      'Apply the same process and timeline to all similar violations to avoid selective-enforcement claims.',
      'For Washington communities, verify the Fining Policy was adopted and noticed to owners per WUCIOA before assessing fines.',
    ],
  },
  {
    category: 'maintenance',
    title: 'Property Maintenance Violation Notice',
    template: `[Date]

[Owner Name]
[Property Address]

Dear [Owner Name],

This is a formal notice of a violation of the [Community Name] Covenants, Conditions, and Restrictions (CC&Rs) regarding property maintenance.

VIOLATION: Your property at [address] is not currently in compliance with the maintenance standards set forth in [Section X.X] of the CC&Rs.

Specifically: [describe — e.g., overgrown landscaping, peeling exterior paint, broken fence, accumulated debris, mildew on siding].

REQUIRED ACTION: Please bring your property into compliance within [30] days of this notice. Photographs documenting the resolved condition are appreciated.

Continued non-compliance after [date] may result in fines as authorized by [Section X.X] and the Board's adopted Fining Policy. In some circumstances, the Association may be authorized under the CC&Rs to remedy the violation and bill the owner.

You have the right to a hearing before the Board to contest this notice. To request a hearing, contact [contact info] within [X] days.

Sincerely,
[Board Member Name]
[Title]
[Community Name] Board of Directors`,
    notes: [
      'Be specific about what is out of compliance — vague maintenance notices are routinely overturned.',
      'Include dated photos in the enforcement file.',
      'If the CC&Rs authorize self-help (the association doing the work and billing the owner), confirm the procedural prerequisites — usually formal notice and an opportunity to cure.',
    ],
  },
  {
    category: 'parking',
    title: 'Parking Violation Notice',
    template: `[Date]

[Owner Name]
[Property Address]

Dear [Owner Name],

This is a formal notice of a parking violation in the [Community Name].

VIOLATION: A vehicle [license plate / description] was observed at [location, e.g., guest parking, fire lane, driveway entrance] in violation of [Section X.X] of the Rules and Regulations adopted by the Board.

Specifically: [describe — e.g., parked in guest parking for more than the X-day limit, blocking a fire lane, parked on common area not designated for parking].

REQUIRED ACTION: Move the vehicle within [24 / 48] hours of this notice to a compliant location.

Continued non-compliance may result in fines, and (where applicable and consistent with Washington law and the community's signage) the vehicle may be towed at the owner's expense.

Sincerely,
[Board Member Name]
[Title]
[Community Name] Board of Directors`,
    notes: [
      'Towing has separate procedural requirements under Washington law; verify with counsel before relying on it as a remedy.',
      'Confirm parking rules were properly adopted by the Board and noticed to owners.',
      'Documented signage is critical for fire-lane and tow enforcement.',
    ],
  },
  {
    category: 'pet',
    title: 'Pet Violation Notice',
    template: `[Date]

[Owner Name]
[Property Address]

Dear [Owner Name],

This is a formal notice of a pet-related violation of the [Community Name] Rules and Regulations.

VIOLATION: A pet associated with your unit was observed in violation of [Section X.X] of the Rules.

Specifically: [describe — e.g., off-leash in a common area where leashes are required, unattended pet waste in a common area, exceeding the per-unit pet limit, prohibited animal type].

REQUIRED ACTION: Please bring the pet into compliance immediately. If this is a service or assistance animal, please contact [contact info] to provide documentation under the Fair Housing Act.

Continued non-compliance after [date] may result in fines.

Sincerely,
[Board Member Name]
[Title]
[Community Name] Board of Directors`,
    notes: [
      'Always include the assistance / service animal accommodation pathway. Failure to do so creates Fair Housing Act risk.',
      'Pet restrictions adopted as Rules (rather than in the Declaration) generally apply only to pets acquired after the rule was adopted, depending on state law and your governing documents.',
    ],
  },
  {
    category: 'noise',
    title: 'Noise Violation Notice',
    template: `[Date]

[Owner Name]
[Property Address]

Dear [Owner Name],

This is a formal notice of a noise-related violation of the [Community Name] Rules and Regulations.

VIOLATION: On [date and time], a noise disturbance was reported at your unit that exceeds the limits set forth in [Section X.X] of the Rules. Specifically: [describe].

REQUIRED ACTION: Please ensure noise from your unit does not exceed the limits set in the Rules during quiet hours of [hours].

Continued violations may result in fines as authorized by [Section X.X] and the Board's adopted Fining Policy.

Sincerely,
[Board Member Name]
[Title]
[Community Name] Board of Directors`,
    notes: [
      'Noise complaints are subjective; documentation from multiple owners or a noise log strengthens the case.',
      'For repeat issues, consider mediation before fines.',
    ],
  },
  {
    category: 'rental',
    title: 'Rental Restriction Violation Notice',
    template: `[Date]

[Owner Name]
[Property Address]

Dear [Owner Name],

This is a formal notice of a possible violation of the [Community Name] Declaration regarding rentals.

VIOLATION: Information available to the Association suggests your unit at [address] is being rented in a manner inconsistent with [Section X.X] of the Declaration. Specifically: [describe — e.g., short-term rental in a community that prohibits rentals under 30 days, exceeding the rental cap, unregistered tenant].

REQUIRED ACTION: Please contact [contact info] within [14] days to confirm the rental status of your unit and provide tenant information / lease documentation as required by [Section X.X].

Sincerely,
[Board Member Name]
[Title]
[Community Name] Board of Directors`,
    notes: [
      'Rental restrictions adopted by Declaration amendment may be subject to grandfathering for owners who acquired before the restriction.',
      'Short-term rental enforcement frequently involves Washington tenant law and platform-specific dynamics — consult counsel.',
    ],
  },
];

/**
 * Quorum lookup for common Washington HOA / condo meeting types under WUCIOA defaults.
 * Always confirm the community's declaration and bylaws — they may set different thresholds.
 */
export type QuorumMeetingType =
  | 'board_meeting'
  | 'unit_owners_meeting'
  | 'annual_meeting'
  | 'special_meeting';

export interface QuorumResult {
  meeting_type: QuorumMeetingType;
  default_quorum: string;
  source: string;
  notes: string;
}

export function lookupQuorum(meetingType: QuorumMeetingType): QuorumResult {
  switch (meetingType) {
    case 'board_meeting':
      return {
        meeting_type: 'board_meeting',
        default_quorum: 'A majority of the board members',
        source: 'WUCIOA / RCW 64.90.485 default',
        notes:
          'The bylaws may specify a different threshold. Without a quorum, the board meeting may be adjourned but business cannot be transacted.',
      };
    case 'unit_owners_meeting':
    case 'annual_meeting':
    case 'special_meeting':
      return {
        meeting_type: meetingType,
        default_quorum: '20% of the votes in the association',
        source: 'WUCIOA / RCW 64.90.485 default',
        notes:
          'The declaration may specify a different threshold. Many communities reduce or modify this in the declaration. Proxies and absentee ballots count toward quorum where authorized.',
      };
  }
}

export function getNoticeTemplate(category: ViolationCategory): NoticeTemplate | null {
  return NOTICE_TEMPLATES.find((t) => t.category === category) || null;
}

export function listViolationCategories(): ViolationCategory[] {
  return NOTICE_TEMPLATES.map((t) => t.category);
}
