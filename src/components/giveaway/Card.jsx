import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Clock, Lock, ShieldCheck, Ticket, Trophy, Users } from 'lucide-react'
import useCountdown from '../../hooks/useCountdown.js'
import PrizeArt from '../../art/PrizeArt'

const ACCENT = {
    gold: { badge: 'bg-amber-400/15 text-amber-300 border-amber-300/30', glow: 'bg-amber-400/15' },
    blue: { badge: 'bg-sky-400/15 text-sky-300 border-sky-300/30', glow: 'bg-sky-500/15' },
    emerald: { badge: 'bg-emerald-400/15 text-emerald-300 border-emerald-300/30', glow: 'bg-emerald-500/15' },
    orange: { badge: 'bg-orange-400/15 text-orange-300 border-orange-300/30', glow: 'bg-orange-500/15' },
}

const STATUS = {
    live: { chip: 'Live Now', dot: 'bg-emerald-400', time: 'text-white', cta: 'Join Giveaway', arrow: true },
    ending_soon: { chip: 'Ending Soon', dot: 'bg-amber-400', time: 'text-amber-300', cta: 'Secure Spot', arrow: true },
    upcoming: { chip: 'Upcoming', dot: 'bg-sky-400', time: 'text-white', cta: 'Get Notified' },
    entered: { chip: 'Entered', dot: 'bg-emerald-400', time: 'text-white', cta: "You're In", icon: Check, disabled: true },
    closed: { chip: 'Closed', dot: 'bg-slate-500', time: 'text-slate-400', cta: 'Draw in Progress', disabled: true },
    winners_announced: { chip: 'Results Out', dot: 'bg-amber-300', time: 'text-slate-400', cta: 'View Winners', arrow: true },
}

const pad = (n) => String(n).padStart(2, '0')
const compact = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K+` : String(n))

function formatLeft({ d, h, m, s, isOver }) {
    if (isOver) return 'Ended'
    if (d > 0) return `${d}d ${pad(h)}h`
    if (h > 0) return `${h}h ${pad(m)}m`
    return `${m}m ${pad(s)}s`
}

export default function GiveawayCard({ prize, entered = false, onJoin, index = 0 }) {
    const reduce = useReducedMotion()
    const upcoming = prize.status === 'upcoming'
    const time = useCountdown(upcoming ? prize.startsAt : prize.endsAt)

    let status = prize.status
    if (status === 'live') {
        if (time.isOver) status = 'closed'
        else if (time.d === 0 && time.h < 24) status = 'ending_soon'
        if (entered && status !== 'closed') status = 'entered'
    }

    const s = STATUS[status]
    const a = ACCENT[prize.accent] ?? ACCENT.gold
    const Icon = s.icon
    const timeLabel = upcoming ? 'Starts in' : status === 'closed' ? 'Closed' : 'Remaining'
    // Same rule as winnersFor(): 1st Prize is always one winner, others read winnersCount.
    const winners = prize.position === '1st Prize' ? 1 : Math.max(1, Number(prize.winnersCount) || 1)

    return (
        <motion.article
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: index * 0.06, ease: 'easeOut' }}
            whileHover={reduce ? undefined : { y: -4 }}
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#130f2c] to-[#0a071b] shadow-[0_16px_40px_rgb(0_0_0/0.4)] transition-all duration-300 hover:border-violet-500/40 hover:shadow-[0_20px_50px_rgb(139_92_246/0.15)]"
        >
            {/* Prize image display container */}
            <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent p-5">

                {/* Position Badge */}
                <div className="absolute left-3.5 top-3.5 z-10">
                    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-md shadow-sm ${a.badge}`}>
                        {prize.position}
                    </span>
                </div>

                {/* Status Chip */}
                <div className="absolute right-3.5 top-3.5 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-0.5 text-[11px] font-medium text-slate-200 backdrop-blur-md border border-white/10 shadow-sm">
                        <span className="relative flex size-1.5">
                            {status === 'live' && (
                                <span className={`absolute inline-flex size-full animate-ping rounded-full opacity-75 motion-reduce:hidden ${s.dot}`} />
                            )}
                            <span className={`relative inline-flex size-1.5 rounded-full ${s.dot}`} />
                        </span>
                        {s.chip}
                    </span>
                </div>

                {/* Ambient glow behind prize art */}
                <div
                    aria-hidden="true"
                    className={`absolute left-1/2 top-1/2 size-3/5 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-opacity duration-700 group-hover:opacity-100 opacity-60 ${a.glow}`}
                />

                {/* Prize Artwork or Image */}
                <div className="relative flex h-full items-center justify-center transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
                    {prize.image ? (
                        <img
                            src={prize.image}
                            alt={prize.name}
                            loading="lazy"
                            className="max-h-full max-w-full object-contain drop-shadow-[0_16px_24px_rgb(0_0_0/0.7)]"
                        />
                    ) : (
                        <PrizeArt
                            kind={prize.art}
                            className="h-full max-h-[160px] [&>svg]:h-full [&>svg]:w-auto drop-shadow-[0_16px_24px_rgb(0_0_0/0.6)]"
                        />
                    )}
                </div>
            </div>

            {/* Card Content Details */}
            <div className="flex flex-1 flex-col p-4 sm:p-5">
                {/* Full prize name: wraps to a second line, never cut off with "..." */}
                <h3 className="min-h-[2.75rem] break-words text-base font-bold leading-snug tracking-tight text-white transition-colors group-hover:text-violet-200 sm:min-h-[3.25rem] sm:text-lg">
                    {prize.name}
                </h3>

                <div className="mt-1.5 inline-flex w-fit items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                    <ShieldCheck className="size-3" aria-hidden="true" />
                    Verified prize
                </div>

                <p className="mt-2.5 line-clamp-2 min-h-[2.25rem] text-xs leading-relaxed text-slate-400">
                    {prize.description}
                </p>

                {/* Stats Grid - Fixed alignment with flex-row properly balanced */}
                <div className="mt-3.5 grid grid-cols-2 gap-2 rounded-xl bg-white/[0.02] border border-white/[0.06] p-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                            <Users className="size-3.5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold leading-tight text-white truncate">{compact(prize.participants)}</p>
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 truncate">Entries</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                            <Clock className="size-3.5" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                            <p className={`text-xs font-bold leading-tight tabular-nums truncate ${s.time}`}>{formatLeft(time)}</p>
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 truncate">{timeLabel}</p>
                        </div>
                    </div>
                </div>

                {/* Requirement and winners */}
                <ul className="mt-2.5 space-y-1.5 text-xs text-slate-300">
                    {prize.entry && (
                        <li className="flex items-start gap-1.5">
                            <Ticket className="mt-0.5 size-3.5 shrink-0 text-amber-400" aria-hidden="true" />
                            <span className="shrink-0 font-medium text-slate-400">Requirement:</span>
                            <span className="text-slate-200">{prize.entry}</span>
                        </li>
                    )}
                    <li className="flex items-start gap-1.5">
                        <Trophy className="mt-0.5 size-3.5 shrink-0 text-amber-400" aria-hidden="true" />
                        <span className="shrink-0 font-medium text-slate-400">Winners:</span>
                        <span className="text-slate-200">{winners} {winners === 1 ? 'winner' : 'winners'}</span>
                    </li>
                </ul>

                {/* Action Button Section - Improved clean padding and text layout */}
                <div className="mt-auto pt-4">
                    <motion.button
                        type="button"
                        onClick={() => onJoin?.(prize)}
                        disabled={s.disabled}
                        whileTap={s.disabled ? undefined : { scale: 0.98 }}
                        className="group/cta relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-[length:200%_auto] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-violet-900/30 transition-all duration-300 hover:bg-[position:right_center] hover:shadow-violet-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0a22] disabled:cursor-not-allowed disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-400 disabled:shadow-none disabled:hover:bg-[position:0%_center]"
                    >
                        {Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}
                        <span className="truncate">{s.cta}</span>
                        {s.arrow && (
                            <ArrowRight
                                className="size-4 shrink-0 transition-transform duration-300 group-hover/cta:translate-x-1 motion-reduce:transition-none"
                                aria-hidden="true"
                            />
                        )}
                    </motion.button>

                    <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                        <Lock className="size-3" aria-hidden="true" />
                        Random draw. Winners announced publicly.
                    </p>
                </div>
            </div>
        </motion.article>
    )
}