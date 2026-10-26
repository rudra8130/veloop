

const MIN = 60 * 1000
const at = (d, h = 0, m = 0) => Date.now() + ((d * 24 + h) * 60 + m) * MIN

export const giveaways = [
    {
        id: 'g1',
        position: '1st Prize',
        accent: 'gold',
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone 15 Pro, 128GB in Natural Titanium.',
        art: 'phone',
        image: null,
        participants: 2300,
        startsAt: at(-2),
        endsAt: at(12, 8, 45),
        status: 'live',
        entry: '50 VEs',
        winnersCount: 1,
    },
    {
        id: 'g2',
        position: '2nd Prize',
        accent: 'blue',
        name: 'Apple Watch Series 9',
        description: 'Series 9 GPS, 45mm with an always-on display.',
        art: 'watch',
        image: null,
        participants: 1800,
        startsAt: at(-3),
        endsAt: at(9, 6, 30),
        status: 'live',
        entry: '30 VEs',
        winnersCount: 3,
    },
    {
        id: 'g3',
        position: '3rd Prize',
        accent: 'emerald',
        name: 'AirPods Pro 2',
        description: 'Active noise cancellation with a USB-C charging case.',
        art: 'earbuds',
        image: null,
        participants: 3100,
        startsAt: at(-6),
        endsAt: at(0, 20, 20), // under 24h, so it shows as ending soon
        status: 'live',
        entry: 'Complete 3 tasks',
        winnersCount: 5,
    },
    {
        id: 'g4',
        position: 'Lucky Draw',
        accent: 'orange',
        name: 'Amazon Gift Card',
        description: '₹2,000 gift card, delivered as a digital code.',
        art: 'giftcard',
        image: null,
        participants: 1300,
        startsAt: at(-1),
        endsAt: at(5, 0, 15),
        status: 'live',
        entry: 'Free entry',
        winnersCount: 10,
    },
]

export const winnersFor = (g) =>
    g.position === '1st Prize' ? 1 : Math.max(1, Number(g.winnersCount) || 1)