import { winnersFor } from '../data/giveaways'

/* Terms & Conditions content, built per giveaway.

   status: 'confirmed'   the text comes from the giveaway's own data or from the
                          current product behaviour.
           'placeholder' VELOOP has not finalised this yet. The UI shows a
                          "Placeholder" badge. Replace the text, then set
                          status to 'confirmed'.

   IMPORTANT: no refund or entry policy is invented here. */

// Working value, not an official policy. Confirm with VELOOP, then change here only.
export const CLAIM_DEADLINE_DAYS = 7

const fmt = (ms) => {
    if (!ms) return 'To be announced'
    try {
        return new Date(ms).toLocaleString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
        })
    } catch {
        return 'To be announced'
    }
}

export function buildTerms(g = {}) {
    const giveaway = g || {}
    const n = giveaway?.position ? winnersFor(giveaway) : 1
    const winnerWord = n === 1 ? 'winner' : 'winners'
    const giveawayName = giveaway?.name || 'VELOOP Rewards'
    const entryText = giveaway?.entry || 'Free entry'

    return [
        {
            id: 'eligibility',
            title: 'Eligibility',
            status: 'placeholder',
            note: 'Placeholder: age, region and other eligibility rules are to be confirmed by VELOOP.',
            body: [
                'This giveaway is open to registered VELOOP Rewards users with an account in good standing.',
                'Any further criteria, such as minimum age or supported regions, are to be confirmed.',
            ],
        },
        {
            id: 'entry',
            title: 'Entry Requirement',
            status: 'confirmed',
            body: [
                !entryText
                    ? `No entry requirement is stated for the ${giveawayName} giveaway.`
                    : /free/i.test(entryText)
                        ? `Joining the ${giveawayName} giveaway is free. No VEs, SVEs or Tokens are required.`
                        : `The entry requirement for the ${giveawayName} giveaway is: ${entryText}.`,
                'The requirement is shown on the giveaway card and again in the join confirmation, before you confirm your entry.',
            ],
        },
        {
            id: 'participation',
            title: 'Participation',
            status: 'confirmed',
            list: [
                'Log in or create a VELOOP Rewards account.',
                'Choose the giveaway, select Join, and confirm after accepting the rules.',
                'You receive your first entry when you join.',
                'Complete eligible activities to earn extra entries until the giveaway closes. Each activity counts once per giveaway.',
                'More entries means more chances to win. A win is never guaranteed.',
            ],
        },
        {
            id: 'duration',
            title: 'Giveaway Duration',
            status: 'confirmed',
            facts: [
                ['Starts', fmt(giveaway?.startsAt)],
                ['Ends', fmt(giveaway?.endsAt)],
            ],
            body: ['Entries close when the giveaway ends. Times are shown in your local time zone.'],
        },
        {
            id: 'selection',
            title: 'Winner Selection',
            status: 'confirmed',
            body: [
                `Winners are selected by a random draw after the giveaway ends. This giveaway has ${n} ${winnerWord}${giveaway?.position === '1st Prize' ? ' (the 1st Prize always has exactly one winner)' : ''
                }.`,
                'Earning more entries increases your chances but never guarantees a win.',
            ],
        },
        {
            id: 'announcement',
            title: 'Winner Announcement',
            status: 'placeholder',
            note: 'Placeholder: the exact announcement time is to be confirmed by VELOOP.',
            body: [
                'Winners are announced publicly on the Winners tab after the draw. Only masked user IDs are shown, never names or contact details.',
                'The exact announcement time is to be confirmed.',
            ],
        },
        {
            id: 'claim',
            title: 'Prize Claim',
            status: 'placeholder',
            note: 'Placeholder: delivery and identity verification details are to be confirmed by VELOOP.',
            body: [
                'If you win, a claim form appears on the Winners tab. It is visible only to the winning account.',
                'You will be asked for your full name, mobile number, email, delivery address, city and PIN code.',
                'VELOOP may ask you to verify your identity before the prize is released. Delivery and verification details are to be confirmed.',
            ],
        },
        {
            id: 'deadline',
            title: 'Claim Deadline',
            status: 'placeholder',
            note: `Placeholder: ${CLAIM_DEADLINE_DAYS} days is a working value and needs confirmation from VELOOP.`,
            body: [
                `Winners must submit their claim details within ${CLAIM_DEADLINE_DAYS} days of the announcement.`,
                'What happens to a prize that is not claimed in time is to be confirmed.',
            ],
        },
        {
            id: 'disqualification',
            title: 'Disqualification',
            status: 'confirmed',
            body: [
                'Suspicious, fraudulent, abusive or rule-breaking activity may result in disqualification, according to platform rules.',
                'A disqualified entry is not eligible to win.',
            ],
        },
        {
            id: 'refund',
            title: 'Refund / Entry Policy',
            status: 'placeholder',
            note: 'Placeholder: the refund / entry policy is not finalised. Do not publish refund terms until VELOOP confirms them.',
            body: [
                'What happens to the VEs, SVEs or Tokens used to join this giveaway, after you participate, is covered by the official VELOOP policy.',
                'That policy has not been finalised yet. This section will be updated once it is confirmed.',
            ],
        },
    ]
}
