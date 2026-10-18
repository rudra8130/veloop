/* Inline SVG reward illustrations. Replace any of them with <img> if you
   have transparent PNG/SVG exports from your designer. */

const GOLD_STOPS = (
    <>
        <stop offset="0" stopColor="#F7C95C" />
        <stop offset="1" stopColor="#D8932A" />
    </>
)

export function GiftBoxArt({ className }) {
    return (
        <svg viewBox="0 0 200 210" className={className} aria-hidden="true">
            <defs>
                <linearGradient id="hr-top" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#8B5CF6" />
                    <stop offset="1" stopColor="#6D3FE0" />
                </linearGradient>
                <linearGradient id="hr-left" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#4C2BB3" />
                    <stop offset="1" stopColor="#32197F" />
                </linearGradient>
                <linearGradient id="hr-right" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#5E37CC" />
                    <stop offset="1" stopColor="#3E2095" />
                </linearGradient>
                <linearGradient id="hr-gold" x1="0" y1="0" x2="1" y2="1">{GOLD_STOPS}</linearGradient>
                <clipPath id="hr-topclip">
                    <polygon points="100,60 170,90 100,120 30,90" />
                </clipPath>
                <radialGradient id="hr-floor" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0" stopColor="#8B5CF6" stopOpacity="0.55" />
                    <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
                </radialGradient>
            </defs>

            <ellipse cx="100" cy="192" rx="92" ry="15" fill="url(#hr-floor)" />
            <ellipse cx="100" cy="192" rx="70" ry="9" fill="none" stroke="#8B5CF6" strokeOpacity="0.4" />

            <polygon points="30,90 100,120 100,190 30,160" fill="url(#hr-left)" />
            <polygon points="100,120 170,90 170,160 100,190" fill="url(#hr-right)" />
            <polygon points="100,60 170,90 100,120 30,90" fill="url(#hr-top)" />

            <polygon points="55,100.7 75,109.3 75,179.3 55,170.7" fill="url(#hr-gold)" />
            <polygon points="125,109.3 145,100.7 145,170.7 125,179.3" fill="url(#hr-gold)" opacity="0.92" />

            <g clipPath="url(#hr-topclip)">
                <line x1="65" y1="75" x2="135" y2="105" stroke="url(#hr-gold)" strokeWidth="15" />
                <line x1="135" y1="75" x2="65" y2="105" stroke="url(#hr-gold)" strokeWidth="15" />
            </g>

            <ellipse cx="76" cy="52" rx="24" ry="13" transform="rotate(-24 76 52)" fill="url(#hr-gold)" />
            <ellipse cx="76" cy="52" rx="13" ry="6" transform="rotate(-24 76 52)" fill="#B9751C" opacity="0.55" />
            <ellipse cx="124" cy="52" rx="24" ry="13" transform="rotate(24 124 52)" fill="url(#hr-gold)" />
            <ellipse cx="124" cy="52" rx="13" ry="6" transform="rotate(24 124 52)" fill="#B9751C" opacity="0.55" />
            <rect x="90" y="52" width="20" height="17" rx="6" fill="url(#hr-gold)" />

            {[[48, 128], [62, 148], [82, 138], [118, 152], [138, 138], [152, 122], [126, 168]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="1.8" fill="#F7C95C" opacity="0.85" />
            ))}
        </svg>
    )
}

export function PhoneArt({ className }) {
    return (
        <svg viewBox="0 0 120 240" className={className} aria-hidden="true">
            <defs>
                <linearGradient id="hr-ph-screen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#2A1766" />
                    <stop offset="1" stopColor="#120A33" />
                </linearGradient>
                <linearGradient id="hr-ph-gold" x1="0" y1="0" x2="1" y2="1">{GOLD_STOPS}</linearGradient>
            </defs>
            <rect x="2" y="2" width="116" height="236" rx="22" fill="#0F0B22" stroke="#5B3FD0" strokeOpacity="0.7" strokeWidth="2" />
            <rect x="8" y="8" width="104" height="224" rx="17" fill="url(#hr-ph-screen)" />
            <rect x="42" y="14" width="36" height="9" rx="4.5" fill="#07051A" />

            <circle cx="60" cy="88" r="28" fill="#8B5CF6" opacity="0.18" />
            <rect x="47" y="86" width="26" height="19" rx="3" fill="url(#hr-ph-gold)" />
            <rect x="45" y="78" width="30" height="9" rx="2.5" fill="#F7C95C" />
            <rect x="58" y="78" width="4" height="27" fill="#B9751C" opacity="0.5" />

            <text x="60" y="136" textAnchor="middle" fill="#fff" fontFamily="Inter, system-ui, sans-serif" fontWeight="600" fontSize="9">
                Reward unlocked
            </text>
            <text x="60" y="156" textAnchor="middle" fill="#F7C95C" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="15">
                +500 VEs
            </text>
            <rect x="24" y="192" width="72" height="22" rx="11" fill="#7C5CF0" />
            <text x="60" y="206.5" textAnchor="middle" fill="#fff" fontFamily="Inter, system-ui, sans-serif" fontWeight="600" fontSize="9.5">
                Claim
            </text>
        </svg>
    )
}

export function TicketArt({ className }) {
    return (
        <svg viewBox="0 0 270 140" className={className} aria-hidden="true">
            <defs>
                <linearGradient id="hr-tk-gold" x1="0" y1="0" x2="1" y2="1">{GOLD_STOPS}</linearGradient>
                <mask id="hr-tk-mask">
                    <rect width="270" height="140" fill="#fff" />
                    <circle cx="196" cy="6" r="8" fill="#000" />
                    <circle cx="196" cy="134" r="8" fill="#000" />
                </mask>
            </defs>
            <g mask="url(#hr-tk-mask)">
                <path
                    d="M14 6h242a8 8 0 0 1 8 8v112a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8V14a8 8 0 0 1 8-8Z"
                    fill="#15101F" stroke="url(#hr-tk-gold)" strokeWidth="2.5"
                />
                <rect x="16" y="16" width="170" height="108" rx="5" fill="none" stroke="#D8932A" strokeOpacity="0.45" strokeDasharray="3 3" />
                <path d="M196 6h60a8 8 0 0 1 8 8v112a8 8 0 0 1-8 8h-60Z" fill="url(#hr-tk-gold)" />
                <polygon points="230,48 237,63 253,64 241,75 245,91 230,83 215,91 219,75 207,64 223,63" fill="#15101F" />
            </g>
            <g fill="#F7C95C">
                <circle cx="34" cy="38" r="2.2" /><circle cx="44" cy="38" r="2.2" /><circle cx="54" cy="38" r="2.2" />
            </g>
            <text x="32" y="86" fill="url(#hr-tk-gold)" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="25" letterSpacing="1.5">
                GIVEAWAY
            </text>
            <text x="33" y="108" fill="#8E97AD" fontFamily="Inter, system-ui, sans-serif" fontWeight="500" fontSize="10" letterSpacing="1">
                ADMIT ONE ENTRY
            </text>
        </svg>
    )
}

export function CoinStackArt({ className }) {
    return (
        <svg viewBox="0 0 120 100" className={className} aria-hidden="true">
            <defs>
                <linearGradient id="hr-coin-gold" x1="0" y1="0" x2="1" y2="1">{GOLD_STOPS}</linearGradient>
            </defs>
            {[66, 54, 42].map((cy, i) => (
                <g key={cy}>
                    <rect x="20" y={cy} width="80" height="11" fill="#B9751C" />
                    <ellipse cx="60" cy={cy + 11} rx="40" ry="13" fill="#B9751C" />
                    <ellipse cx="60" cy={cy} rx="40" ry="13" fill="url(#hr-coin-gold)" />
                    <ellipse cx="60" cy={cy} rx="31" ry="9.5" fill="none" stroke="#B9751C" strokeOpacity="0.55" />
                    {i === 2 && (
                        <text x="60" y={cy + 4.5} textAnchor="middle" fill="#8A5A12" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="12">
                            VE
                        </text>
                    )}
                </g>
            ))}
        </svg>
    )
}