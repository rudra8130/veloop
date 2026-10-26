import { winnersFor } from './giveaways'


export const recentWinners = [
    { id: 'w1', lead: 'User VE****72 just won', prize: 'an iPhone 15 Pro', kind: 'phone', ago: '2 min ago' },
    { id: 'w2', lead: 'Another lucky participant won', prize: 'an Apple Watch Series 9', kind: 'watch', ago: '14 min ago' },
    { id: 'w3', lead: 'User VE****18 won', prize: 'AirPods Pro 2', kind: 'earbuds', ago: '1 hour ago' },
    { id: 'w4', lead: 'Someone just won', prize: 'an Amazon Gift Card', kind: 'giftcard', ago: '3 hours ago' },
    { id: 'w5', lead: 'User VE****45 won', prize: 'an iPhone 15 Pro', kind: 'phone', ago: 'Yesterday' },
    { id: 'w6', lead: 'User VE****09 won', prize: 'an Apple Watch Series 9', kind: 'watch', ago: 'Yesterday' },
]

/* Build winner IDs for the *current* giveaway (shown after winners_announced). */
export function buildWinnersByPrize(list) {
    let n = 0
    const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    return list.map((g) => ({
        prizeId: g.id,
        prizeName: g.name,
        position: g.position,
        winners: Array.from({ length: winnersFor(g) }, () => ({
            id: `VE****${String((n++ * 17 + 23) % 100).padStart(2, '0')}`,
            date,
        })),
    }))
}

/*
 * Simulated logged-in user. In production this comes from auth context.
 * We deliberately pick an ID that appears in the current-giveaway winners
 * so the claim banner is visible for demo purposes.
 */
export const CURRENT_USER_ID = 'VE****23'

/* ---------- Previous giveaway history ---------- */
export const previousGiveaways = [
    {
        id: 'pg1',
        name: 'August Reward Rush',
        endedAt: '05 Aug 2026',
        prizes: [
            {
                position: '1st Prize',
                prizeName: 'iPhone 15 Pro',
                winners: [
                    { id: 'VE****82', date: '05 Aug 2026', status: 'claimed' },
                ],
            },
            {
                position: '2nd Prize',
                prizeName: 'Apple Watch Series 9',
                winners: [
                    { id: 'VE****37', date: '05 Aug 2026', status: 'claimed' },
                    { id: 'VE****91', date: '05 Aug 2026', status: 'claimed' },
                    { id: 'VE****14', date: '05 Aug 2026', status: 'claimed' },
                ],
            },
            {
                position: '3rd Prize',
                prizeName: 'AirPods Pro 2',
                winners: [
                    { id: 'VE****65', date: '05 Aug 2026', status: 'claimed' },
                    { id: 'VE****28', date: '05 Aug 2026', status: 'claimed' },
                    { id: 'VE****73', date: '05 Aug 2026', status: 'claimed' },
                    { id: 'VE****50', date: '05 Aug 2026', status: 'claimed' },
                    { id: 'VE****04', date: '05 Aug 2026', status: 'claimed' },
                ],
            },
            {
                position: 'Lucky Draw',
                prizeName: 'Amazon Gift Card',
                winners: [
                    { id: 'VE****19', date: '05 Aug 2026', status: 'claimed' },
                    { id: 'VE****42', date: '05 Aug 2026', status: 'claimed' },
                    { id: 'VE****88', date: '05 Aug 2026', status: 'claimed' },
                    { id: 'VE****56', date: '05 Aug 2026', status: 'claimed' },
                    { id: 'VE****31', date: '05 Aug 2026', status: 'claimed' },
                ],
            },
        ],
    },
    {
        id: 'pg2',
        name: 'Summer Rewards',
        endedAt: '10 Jul 2026',
        prizes: [
            {
                position: '1st Prize',
                prizeName: 'MacBook Air M3',
                winners: [
                    { id: 'VE****42', date: '10 Jul 2026', status: 'claimed' },
                ],
            },
            {
                position: '2nd Prize',
                prizeName: 'Apple Watch Series 9',
                winners: [
                    { id: 'VE****77', date: '10 Jul 2026', status: 'claimed' },
                    { id: 'VE****09', date: '10 Jul 2026', status: 'claimed' },
                ],
            },
            {
                position: '3rd Prize',
                prizeName: 'Galaxy Buds2 Pro',
                winners: [
                    { id: 'VE****53', date: '10 Jul 2026', status: 'claimed' },
                    { id: 'VE****61', date: '10 Jul 2026', status: 'claimed' },
                    { id: 'VE****30', date: '10 Jul 2026', status: 'claimed' },
                ],
            },
        ],
    },
    {
        id: 'pg3',
        name: 'Monsoon Bonanza',
        endedAt: '15 Jun 2026',
        prizes: [
            {
                position: '1st Prize',
                prizeName: 'iPad Pro 12.9"',
                winners: [
                    { id: 'VE****18', date: '15 Jun 2026', status: 'claimed' },
                ],
            },
            {
                position: '2nd Prize',
                prizeName: 'Sony WH-1000XM5',
                winners: [
                    { id: 'VE****94', date: '15 Jun 2026', status: 'claimed' },
                    { id: 'VE****67', date: '15 Jun 2026', status: 'claimed' },
                ],
            },
        ],
    },
]