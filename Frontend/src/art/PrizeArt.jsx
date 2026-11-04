/* Placeholder prize illustrations. When you have real product images,
   set `image` on the giveaway in data/giveaways.js and these are skipped. */

const FONT = 'Inter, system-ui, sans-serif'

function Phone() {
    return (
        <svg viewBox="0 0 120 160" aria-hidden="true">
            <defs>
                <linearGradient id="pa-ph" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#4B3A86" />
                    <stop offset="1" stopColor="#1B1340" />
                </linearGradient>
            </defs>
            <rect x="22" y="4" width="76" height="152" rx="16" fill="url(#pa-ph)" stroke="#8B7BD8" strokeOpacity="0.5" strokeWidth="1.5" />
            <rect x="29" y="11" width="38" height="38" rx="10" fill="#120C2B" stroke="#8B7BD8" strokeOpacity="0.35" />
            <circle cx="40" cy="22" r="7" fill="#05030F" stroke="#6A5AB8" />
            <circle cx="57" cy="22" r="7" fill="#05030F" stroke="#6A5AB8" />
            <circle cx="48.5" cy="38" r="7" fill="#05030F" stroke="#6A5AB8" />
            <circle cx="75" cy="18" r="3" fill="#F7C95C" opacity="0.8" />
            <polygon points="22,40 98,10 98,50 22,90" fill="#fff" opacity="0.05" />
        </svg>
    )
}

function Watch() {
    return (
        <svg viewBox="0 0 120 160" aria-hidden="true">
            <rect x="40" y="2" width="40" height="44" rx="8" fill="#1A2A55" />
            <rect x="40" y="114" width="40" height="44" rx="8" fill="#1A2A55" />
            <rect x="20" y="34" width="80" height="92" rx="24" fill="#0F1830" stroke="#6C8CE0" strokeOpacity="0.6" strokeWidth="1.5" />
            <rect x="100" y="64" width="5" height="18" rx="2.5" fill="#6C8CE0" opacity="0.7" />
            <rect x="27" y="41" width="66" height="78" rx="18" fill="#050B1C" />
            <text x="60" y="88" textAnchor="middle" fill="#fff" fontFamily={FONT} fontWeight="700" fontSize="20">10:09</text>
            <path d="M40 104a24 24 0 0 0 40 0" fill="none" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
            <path d="M44 56a22 22 0 0 1 32 0" fill="none" stroke="#34D399" strokeWidth="3" strokeLinecap="round" />
        </svg>
    )
}

function Earbuds() {
    return (
        <svg viewBox="0 0 120 140" aria-hidden="true">
            <defs>
                <linearGradient id="pa-case" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#F5F6FA" />
                    <stop offset="1" stopColor="#C9CCD8" />
                </linearGradient>
            </defs>
            {/* buds */}
            <circle cx="42" cy="32" r="14" fill="#fff" />
            <rect x="38.5" y="38" width="7" height="30" rx="3.5" fill="#E6E8EF" />
            <circle cx="78" cy="32" r="14" fill="#fff" />
            <rect x="74.5" y="38" width="7" height="30" rx="3.5" fill="#E6E8EF" />
            {/* case */}
            <rect x="18" y="62" width="84" height="66" rx="28" fill="url(#pa-case)" />
            <line x1="22" y1="90" x2="98" y2="90" stroke="#AEB2C2" />
            <circle cx="60" cy="104" r="2.6" fill="#34D399" />
        </svg>
    )
}

function GiftCard() {
    return (
        <svg viewBox="0 0 140 110" aria-hidden="true">
            <defs>
                <linearGradient id="pa-gc" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#F7C95C" />
                    <stop offset="1" stopColor="#D8932A" />
                </linearGradient>
            </defs>
            <g transform="rotate(-8 70 55)">
                <rect x="8" y="14" width="124" height="82" rx="10" fill="#15101F" stroke="url(#pa-gc)" strokeWidth="2" />
                <rect x="20" y="26" width="22" height="16" rx="3" fill="url(#pa-gc)" opacity="0.9" />
                <text x="20" y="66" fill="#8E97AD" fontFamily={FONT} fontWeight="600" fontSize="8" letterSpacing="1.2">GIFT CARD</text>
                <text x="20" y="86" fill="url(#pa-gc)" fontFamily={FONT} fontWeight="800" fontSize="20">₹2,000</text>
                <circle cx="112" cy="34" r="8" fill="none" stroke="url(#pa-gc)" strokeWidth="1.5" />
                <circle cx="106" cy="34" r="8" fill="none" stroke="url(#pa-gc)" strokeWidth="1.5" />
            </g>
        </svg>
    )
}

const ART = { phone: Phone, watch: Watch, earbuds: Earbuds, giftcard: GiftCard }

export default function PrizeArt({ kind = 'phone', className }) {
    const Art = ART[kind] ?? Phone
    return (
        <div className={className}>
            <Art />
        </div>
    )
}