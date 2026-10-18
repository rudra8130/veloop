import phone from '../assets/giveaway/phone.png'
import giveawayCard from '../assets/giveaway/amazoncard.png'

const MIN = 60 * 1000
const at = (d, h = 0, m = 0) => Date.now() + ((d * 24 + h) * 60 + m) * MIN

export const giveaways = [
    {
        id: 'g1',
        position: '1st Prize',
        accent: 'gold',
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone 15 Pro 128GB',
        art: 'phone',
        image: phone,
        participants: 2300,
        startsAt: at(-2),
        endsAt: at(12, 8, 45),
        status: 'live',
        entry: '50 VEs',
    },
    {
        id: 'g2',
        position: '2nd Prize',
        accent: 'blue',
        name: 'Apple Watch Series 9',
        description: 'Latest Apple Watch Series 9',
        art: 'watch',
        image: 'https://png.pngtree.com/png-vector/20241025/ourmid/pngtree-smart-watch-png-image_14171827.png',
        participants: 1800,
        startsAt: at(-3),
        endsAt: at(9, 6, 30),
        status: 'live',
        entry: '30 VEs',
    },
    {
        id: 'g3',
        position: '3rd Prize',
        accent: 'emerald',
        name: 'AirPods Pro 2',
        description: 'Active Noise Cancellation',
        art: 'earbuds',
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2-hero-select-202409?wid=400&hei=400&fmt=png-alpha',
        participants: 3100,
        startsAt: at(-6),
        endsAt: at(0, 20, 20),
        status: 'live',
        entry: 'Complete 3 tasks',
    },
    {
        id: 'g4',
        position: 'Lucky Draw',
        accent: 'orange',
        name: 'Amazon Gift Card',
        description: '₹2,000 Amazon Gift Card',
        art: 'giftcard',
        image: giveawayCard,
        participants: 1300,
        startsAt: at(-1),
        endsAt: at(5, 0, 15),
        status: 'live',
        entry: 'Free entry',
    },
]
