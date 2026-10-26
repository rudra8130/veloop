import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
    AlertCircle, ArrowRight, BadgeCheck, Calendar, Check, ChevronDown, ChevronRight, Clock,
    Gift, Hourglass, PartyPopper, ShieldCheck, Sparkles, Trophy, UserCheck, Zap,
} from 'lucide-react'
import useCountdown from '../../hooks/useCountdown'
import { giveaways as demoGiveaways, winnersFor } from '../../data/giveaways'
import {
    buildWinnersByPrize, previousGiveaways, CURRENT_USER_ID,
} from '../../data/winners'
import ClaimPrizeModal, { CLAIM_STATES, getClaimDeadline } from './ClaimForm'

/* ─────────────────────── Constants ─────────────────────── */

const LIFECYCLE_STEPS = ['Giveaway live', 'Giveaway ends', 'Random draw', 'Winners announced']

const COPY = {
    upcoming: {
        chip: 'UPCOMING', tone: 'border-sky-400/30 bg-sky-500/10 text-sky-300', dot: 'bg-sky-400',
        title: "This giveaway hasn't started yet",
        text: 'Winners will be announced after the giveaway ends.',
        announce: 'Coming after the giveaway ends', step: 0, countdown: 'Giveaway starts in',
    },
    live: {
        chip: 'LIVE', tone: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300', dot: 'bg-emerald-400', ping: true,
        title: 'Giveaway is still live',
        text: 'Winners will be announced after the giveaway ends. Nothing is final until the random draw is complete.',
        announce: 'Coming after the giveaway ends', step: 0, countdown: 'Giveaway ends in',
    },
    ending_soon: {
        chip: 'ENDING SOON', tone: 'border-amber-400/30 bg-amber-500/10 text-amber-300', dot: 'bg-amber-400', ping: true,
        title: 'Giveaway is ending soon',
        text: 'Winners will be announced after the giveaway ends. Nothing is final until the random draw is complete.',
        announce: 'Coming after the giveaway ends', step: 0, countdown: 'Giveaway ends in',
    },
    closed: {
        chip: 'CLOSED', tone: 'border-slate-400/30 bg-slate-500/10 text-slate-300', dot: 'bg-slate-400',
        title: 'Draw in progress',
        text: 'Entries are closed and winners are being selected at random. Results will be announced shortly.',
        announce: 'Draw in progress', step: 2,
    },
    next_giveaway: {
        chip: 'NEXT UP', tone: 'border-violet-400/30 bg-violet-500/10 text-violet-300', dot: 'bg-violet-400',
        title: 'Next giveaway starts soon',
        text: 'The current giveaway has ended. A brand new giveaway is on its way!',
        announce: 'New prizes coming soon', step: 3, countdown: 'Next giveaway starts in',
    },
}

const pad = (n) => String(n).padStart(2, '0')
const plural = (n) => `${n} ${n === 1 ? 'winner' : 'winners'}`

/* ─────────────────────── Shared Components ─────────────────────── */

function Countdown({ target, label }) {
    const { d, h, m, s } = useCountdown(target)
    const units = [['Days', d], ['Hours', pad(h)], ['Min', pad(m)], ['Sec', pad(s)]]
    return (
        <div>
            <p className="text-sm text-slate-400">{label}</p>
            <div className="mt-2 flex gap-2" role="timer" aria-label={`${d} days ${h} hours ${m} minutes remaining`}>
                {units.map(([name, val]) => (
                    <div key={name} className="min-w-[64px] rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-center">
                        <p className="text-xl font-bold tabular-nums text-white sm:text-2xl">{val}</p>
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">{name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

function StatusChip({ c }) {
    return (
        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${c.tone}`}>
            <span className="relative flex size-2">
                {c.ping && (
                    <span className={`absolute inline-flex size-full animate-ping rounded-full opacity-60 motion-reduce:hidden ${c.dot}`} />
                )}
                <span className={`relative inline-flex size-2 rounded-full ${c.dot}`} />
            </span>
            {c.chip}
        </span>
    )
}

/* ─────────────────── Winner Claim Banner ─────────────────── */

function WinnerClaimBanner({
    userWins,
    claimState,
    onClaimStateChange,
    onOpenClaimModal,
}) {
    const firstWin = userWins[0]
    const stateConfig = CLAIM_STATES[claimState] ?? CLAIM_STATES.not_submitted
    const deadline = getClaimDeadline()

    return (
        <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl border border-amber-400/40 bg-gradient-to-br from-amber-500/15 via-[#0f0b26] to-violet-500/10 p-6 sm:p-8 shadow-xl"
        >
            {/* Ambient glows */}
            <div aria-hidden="true" className="absolute -right-10 -top-10 size-48 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
            <div aria-hidden="true" className="absolute -bottom-10 -left-10 size-48 rounded-full bg-violet-500/15 blur-3xl pointer-events-none" />

            <div className="relative flex flex-col gap-6">
                <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                    <motion.div
                        animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                        transition={{ duration: 1.5, delay: 0.3 }}
                        className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/25 to-amber-500/35 text-amber-300 shadow-lg shadow-amber-500/15 border border-amber-400/30"
                    >
                        <PartyPopper className="size-8" aria-hidden="true" />
                    </motion.div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-300">
                                <BadgeCheck className="size-3.5" />
                                Winner Verified
                            </span>
                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${stateConfig.chip}`}>
                                {stateConfig.label}
                            </span>
                        </div>

                        <h3 className="mt-1 text-2xl font-black text-white sm:text-3xl">Congratulations, You Won!</h3>

                        {userWins.map((win, i) => (
                            <p key={i} className="mt-1 text-sm text-slate-300 sm:text-base">
                                Prize: <span className="font-bold text-amber-300">{win.prize}</span>
                                <span className="ml-2 font-medium text-slate-400">({win.position})</span>
                            </p>
                        ))}
                    </div>

                    <div className="flex shrink-0 flex-col items-stretch sm:items-end gap-2 w-full sm:w-auto">
                        <motion.button
                            type="button"
                            onClick={() => onOpenClaimModal(firstWin)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold shadow-lg transition focus-visible:outline-none focus-visible:ring-2 ${claimState === 'not_submitted'
                                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-amber-500/25 hover:shadow-amber-500/40 hover:brightness-105 focus-visible:ring-amber-300'
                                : claimState === 'expired'
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                }`}
                        >
                            <Gift className="size-4.5" aria-hidden="true" />
                            {claimState === 'not_submitted'
                                ? 'Claim Your Prize'
                                : claimState === 'expired'
                                    ? 'Claim Expired (Details)'
                                    : 'View Claim Status'}
                        </motion.button>

                        <p className="flex items-center justify-center sm:justify-end gap-1.5 text-xs text-amber-300/80">
                            <Clock className="size-3.5" />
                            Claim deadline: <strong>{deadline}</strong> (within 7 days)
                        </p>
                    </div>
                </div>

                {/* State timeline & Dev state switcher */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs">
                    <div className="flex items-center gap-2 text-slate-400">
                        <span className="font-medium text-slate-300">Status:</span>
                        <span>{stateConfig.description}</span>
                    </div>

                    {/* Quick interactive claim state previewer */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] text-slate-500 mr-1">Simulate State:</span>
                        {Object.keys(CLAIM_STATES).map((st) => (
                            <button
                                key={st}
                                type="button"
                                onClick={() => onClaimStateChange(st)}
                                className={`rounded-md px-2 py-0.5 text-[11px] font-semibold transition ${claimState === st
                                    ? 'bg-amber-400/25 text-amber-200 border border-amber-400/40'
                                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
                                    }`}
                            >
                                {CLAIM_STATES[st].shortLabel}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

/* ─────────────────── Non-Winner Experience ─────────────────── */

function NonWinnerBanner({ onBrowse }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/10 via-[#0d0a22] to-indigo-600/10 p-6 sm:p-8"
        >
            <div aria-hidden="true" className="absolute -right-8 -bottom-8 size-40 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    <Sparkles className="size-7" aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/15 border border-violet-500/30 px-3 py-0.5 text-xs font-semibold text-violet-300 mb-1.5">
                        <Zap className="size-3" />
                        Next Round Soon
                    </div>
                    <h3 className="text-xl font-bold text-white sm:text-2xl">
                        You didn't win this time, but the next giveaway is just around the corner!
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                        Every giveaway entry increases your odds and earns you reward streak points. Don't miss the upcoming reward drops!
                    </p>
                </div>

                {onBrowse && (
                    <motion.button
                        type="button"
                        onClick={onBrowse}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500
                            px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition
                            hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                    >
                        Participate in Next Giveaway
                        <ArrowRight className="size-4" />
                    </motion.button>
                )}
            </div>
        </motion.div>
    )
}

/* ─────────────────── Stage: Pending ─────────────────── */

function PendingView({ status, giveaways, onBrowse }) {
    const c = COPY[status] ?? COPY.live
    const endsAt = Math.max(...giveaways.map((g) => g.endsAt))

    return (
        <div className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-[#0d0a22] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
                        <Hourglass className="size-6" aria-hidden="true" />
                    </span>
                    <div>
                        <h3 className="text-xl font-bold text-white sm:text-2xl">{c.title}</h3>
                        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">{c.text}</p>
                    </div>
                </div>

                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        <dt className="text-xs uppercase tracking-wide text-slate-500">Current giveaway status</dt>
                        <dd className="mt-2"><StatusChip c={c} /></dd>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        <dt className="text-xs uppercase tracking-wide text-slate-500">Winner announcement</dt>
                        <dd className="mt-2 text-base font-semibold text-white">{c.announce}</dd>
                    </div>
                </dl>

                {c.countdown && (
                    <div className="mt-6">
                        <Countdown target={endsAt} label={c.countdown} />
                    </div>
                )}

                {onBrowse && status !== 'closed' && (
                    <button
                        type="button"
                        onClick={onBrowse}
                        className="mt-6 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white
                       transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                    >
                        Browse giveaways
                    </button>
                )}
            </div>

            {/* Lifecycle progress */}
            <ol className="grid grid-cols-2 gap-4 sm:grid-cols-4" aria-label="Draw progress">
                {LIFECYCLE_STEPS.map((label, i) => {
                    const state = i < c.step ? 'done' : i === c.step ? 'current' : 'next'
                    const bar = { done: 'bg-emerald-400', current: 'bg-violet-400', next: 'bg-white/10' }[state]
                    const text = { done: 'text-slate-300', current: 'text-white', next: 'text-slate-500' }[state]
                    return (
                        <li key={label} aria-current={state === 'current' ? 'step' : undefined}>
                            <div className={`h-1 rounded-full ${bar}`} />
                            <p className={`mt-2 text-sm font-medium ${text}`}>{label}</p>
                            <p className="text-xs text-slate-500">{state === 'done' ? 'Completed' : state === 'current' ? 'Now' : 'Upcoming'}</p>
                        </li>
                    )
                })}
            </ol>

            {/* Winners to be selected */}
            <section aria-labelledby="distribution-title">
                <h3 id="distribution-title" className="text-lg font-bold text-white">Winners to be selected</h3>
                <p className="mt-1 text-sm text-slate-400">The number of winners for each prize. Names appear after the draw.</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {giveaways.map((g) => {
                        const n = winnersFor(g)
                        return (
                            <div key={g.id} className="rounded-2xl border border-white/10 bg-[#0d0a22] p-5">
                                <p className="text-xs font-semibold text-amber-300">{g.position}</p>
                                <p className="mt-1 font-semibold text-white">{g.name}</p>
                                <p className="mt-3 text-sm text-slate-400">{plural(n)} will be selected</p>
                                <div className="mt-3 flex flex-wrap gap-1.5" aria-hidden="true">
                                    {Array.from({ length: n }, (_, i) => (
                                        <span key={i} className="size-6 rounded-full border border-dashed border-white/25 bg-white/[0.03]" />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}

/* ─────────────────── Stage: Next Giveaway countdown ─────────────────── */

function NextGiveawayView({ nextStartsAt, onBrowse }) {
    const c = COPY.next_giveaway
    return (
        <div className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-[#0d0a22] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
                        <Clock className="size-6" aria-hidden="true" />
                    </span>
                    <div>
                        <h3 className="text-xl font-bold text-white sm:text-2xl">{c.title}</h3>
                        <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">{c.text}</p>
                    </div>
                </div>

                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        <dt className="text-xs uppercase tracking-wide text-slate-500">Status</dt>
                        <dd className="mt-2"><StatusChip c={c} /></dd>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        <dt className="text-xs uppercase tracking-wide text-slate-500">What's next</dt>
                        <dd className="mt-2 text-base font-semibold text-white">{c.announce}</dd>
                    </div>
                </dl>

                <div className="mt-6">
                    <Countdown target={nextStartsAt} label={c.countdown} />
                </div>

                {onBrowse && (
                    <button
                        type="button"
                        onClick={onBrowse}
                        className="mt-6 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white
                       transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                    >
                        Browse past giveaways
                    </button>
                )}
            </div>

            <ol className="grid grid-cols-2 gap-4 sm:grid-cols-4" aria-label="Draw progress">
                {LIFECYCLE_STEPS.map((label) => (
                    <li key={label}>
                        <div className="h-1 rounded-full bg-emerald-400" />
                        <p className="mt-2 text-sm font-medium text-slate-300">{label}</p>
                        <p className="text-xs text-emerald-400">Completed</p>
                    </li>
                ))}
            </ol>
        </div>
    )
}

/* ─────────────────── Stage: Winners Announced ─────────────────── */

function AnnouncedView({
    giveaways,
    userId,
    claimState,
    onClaimStateChange,
    onOpenClaimModal,
    onBrowse,
}) {
    const reduce = useReducedMotion()
    const byPrize = buildWinnersByPrize(giveaways)

    // Check if the simulated user won any prizes
    const userWins = []
    for (const entry of byPrize) {
        const g = giveaways.find((x) => x.id === entry.prizeId)
        for (const w of entry.winners) {
            if (w.id === userId) {
                userWins.push({
                    prize: entry.prizeName || g?.name,
                    name: entry.prizeName || g?.name,
                    position: entry.position || g?.position,
                    art: g?.art,
                    giveawayName: 'August Reward Rush (Current)',
                })
            }
        }
    }

    const isWinner = userWins.length > 0

    return (
        <div className="space-y-8">
            {/* Show Winner Claim Banner if winner; otherwise show Non-Winner encouraging experience */}
            {isWinner ? (
                <WinnerClaimBanner
                    userWins={userWins}
                    claimState={claimState}
                    onClaimStateChange={onClaimStateChange}
                    onOpenClaimModal={onOpenClaimModal}
                />
            ) : (
                <NonWinnerBanner onBrowse={onBrowse} />
            )}

            <p className="flex items-start gap-3 rounded-xl bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                Winners were chosen by a certified random draw. Only masked user IDs are shown to protect privacy.
            </p>

            {giveaways.map((g, gi) => {
                const winners = byPrize.find((x) => x.prizeId === g.id)?.winners ?? []
                return (
                    <section key={g.id} aria-labelledby={`w-${g.id}`}>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="rounded-full border border-amber-300/30 bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-300">
                                {g.position}
                            </span>
                            <h3 id={`w-${g.id}`} className="text-lg font-bold text-white">{g.name}</h3>
                            <span className="text-sm text-slate-400">{plural(winners.length)}</span>
                        </div>

                        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            {winners.map((w, i) => {
                                const isCurrentUser = w.id === userId
                                return (
                                    <motion.li
                                        key={`${g.id}-${i}`}
                                        initial={reduce ? false : { opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-40px' }}
                                        transition={{ duration: 0.35, delay: Math.min(i, 5) * 0.05 + gi * 0.03 }}
                                        className={`flex items-center gap-3 rounded-xl border p-4 ${isCurrentUser
                                            ? 'border-amber-400/50 bg-amber-500/10 ring-1 ring-amber-400/30 shadow-lg shadow-amber-500/10'
                                            : 'border-white/10 bg-[#0d0a22]'
                                            }`}
                                    >
                                        <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${isCurrentUser ? 'bg-amber-400/25 text-amber-300' : 'bg-amber-400/15 text-amber-300'
                                            }`}>
                                            <Trophy className="size-5" aria-hidden="true" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold tabular-nums text-white">
                                                {w.id}
                                                {isCurrentUser && (
                                                    <span className="ml-1.5 rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-400/30">
                                                        You
                                                    </span>
                                                )}
                                            </p>
                                            <p className="flex items-center gap-1.5 text-xs text-slate-400">
                                                <BadgeCheck className="size-3.5 text-emerald-400" aria-hidden="true" />
                                                Verified · {w.date}
                                            </p>
                                        </div>
                                    </motion.li>
                                )
                            })}
                        </ul>
                    </section>
                )
            })}
        </div>
    )
}

/* ─────────────────── Previous Winners Tab ─────────────────── */

function PreviousWinnersView() {
    const reduce = useReducedMotion()
    const [expanded, setExpanded] = useState(previousGiveaways[0]?.id ?? null)

    if (previousGiveaways.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-white/15 px-6 py-14 text-center">
                <p className="font-semibold text-white">No previous giveaways yet</p>
                <p className="mt-1 text-sm text-slate-400">Once a giveaway ends, its winners will appear here.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/[0.03] border border-white/10 p-4">
                <p className="flex items-start gap-3 text-sm text-slate-300">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                    Archive of completed giveaways and fulfilled prizes. Masked user IDs protect member privacy.
                </p>
                <span className="rounded-full bg-violet-500/15 border border-violet-500/30 px-3 py-1 text-xs font-semibold text-violet-300">
                    {previousGiveaways.length} Completed Draws
                </span>
            </div>

            {previousGiveaways.map((pg) => {
                const isExpanded = expanded === pg.id
                const totalWinners = pg.prizes.reduce((sum, p) => sum + p.winners.length, 0)

                return (
                    <motion.div
                        key={pg.id}
                        initial={reduce ? false : { opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.35 }}
                        className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0a22]"
                    >
                        {/* Header accordion trigger */}
                        <button
                            type="button"
                            onClick={() => setExpanded(isExpanded ? null : pg.id)}
                            className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-white/[0.02] sm:p-6"
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                    <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-0.5 text-xs font-semibold text-violet-300">
                                        Previous Giveaway
                                    </span>
                                    <h4 className="text-base font-bold text-white sm:text-lg">{pg.name}</h4>
                                </div>
                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="size-3.5 text-slate-500" aria-hidden="true" />
                                        Ended: <strong className="text-slate-300">{pg.endedAt}</strong>
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Trophy className="size-3.5 text-amber-400" aria-hidden="true" />
                                        {totalWinners} {totalWinners === 1 ? 'winner' : 'winners'}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Gift className="size-3.5 text-violet-400" aria-hidden="true" />
                                        {pg.prizes.length} {pg.prizes.length === 1 ? 'prize tier' : 'prize tiers'}
                                    </span>
                                </div>
                            </div>
                            <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-400"
                            >
                                <ChevronDown className="size-4.5" />
                            </motion.div>
                        </button>

                        {/* Expandable winner list */}
                        <AnimatePresence initial={false}>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-6 border-t border-white/10 p-5 sm:p-6 bg-white/[0.01]">
                                        {pg.prizes.map((prize) => (
                                            <section key={prize.position} aria-label={`${prize.prizeName} winners`}>
                                                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="rounded-full border border-amber-300/30 bg-amber-400/15 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                                                            {prize.position}
                                                        </span>
                                                        <h5 className="text-sm font-bold text-white">{prize.prizeName}</h5>
                                                    </div>
                                                    <span className="text-xs text-slate-500">{plural(prize.winners.length)}</span>
                                                </div>

                                                {/* Winner card items showing Winner, Prize, Giveaway, Date */}
                                                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                                    {prize.winners.map((w, i) => (
                                                        <motion.li
                                                            key={`${prize.position}-${i}`}
                                                            initial={reduce ? false : { opacity: 0, x: -8 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ duration: 0.25, delay: i * 0.04 }}
                                                            className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0f0b24] p-4 shadow-sm"
                                                        >
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div className="flex items-center gap-2.5">
                                                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/20">
                                                                        <Trophy className="size-4" aria-hidden="true" />
                                                                    </span>
                                                                    <div>
                                                                        <p className="text-[11px] uppercase tracking-wider text-slate-500">Winner</p>
                                                                        <p className="text-sm font-bold tabular-nums text-white">{w.id}</p>
                                                                    </div>
                                                                </div>
                                                                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                                                                    Claimed ✓
                                                                </span>
                                                            </div>

                                                            <div className="mt-3 border-t border-white/[0.06] pt-2.5 space-y-1 text-xs">
                                                                <div className="flex justify-between text-slate-400">
                                                                    <span>Prize:</span>
                                                                    <strong className="text-slate-200 truncate ml-2">{prize.prizeName}</strong>
                                                                </div>
                                                                <div className="flex justify-between text-slate-400">
                                                                    <span>Date:</span>
                                                                    <span className="text-slate-300">{w.date}</span>
                                                                </div>
                                                            </div>
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </section>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )
            })}
        </div>
    )
}

/* ─────────────────── Main Export ─────────────────── */

export default function WinnersTab({
    status = 'live',
    giveaways = demoGiveaways,
    onBrowse,
    userId = CURRENT_USER_ID,
    nextStartsAt,
}) {
    /* Sub-tab: "Current Giveaway" vs "Previous Winners" */
    const [subTab, setSubTab] = useState('current')

    /* Claim Modal & State */
    const [activeUser, setActiveUser] = useState(userId)
    const [selectedPrize, setSelectedPrize] = useState(null)
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false)
    const [claimState, setClaimState] = useState('not_submitted')

    const fallbackNext = Date.now() + 3 * 24 * 60 * 60 * 1000

    const handleOpenClaimModal = (prizeInfo) => {
        setSelectedPrize(prizeInfo)
        setIsClaimModalOpen(true)
    }

    const subTabs = [
        { value: 'current', label: 'Current Giveaway' },
        { value: 'previous', label: 'Previous Winners' },
    ]

    return (
        <div className="space-y-6">
            {/* Sub-tab switcher + Persona Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
                    {subTabs.map(({ value, label }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setSubTab(value)}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${subTab === value
                                ? 'bg-violet-500/20 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                                }`}
                        >
                            {label}
                            {value === 'previous' && previousGiveaways.length > 0 && (
                                <span className="ml-2 rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] tabular-nums text-slate-300">
                                    {previousGiveaways.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Persona switcher (Winner vs Non-Winner view) for demo */}
                {status === 'winners_announced' && subTab === 'current' && (
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs">
                        <span className="text-slate-400 flex items-center gap-1">
                            <UserCheck className="size-3.5 text-violet-400" />
                            View as:
                        </span>
                        <button
                            type="button"
                            onClick={() => setActiveUser(CURRENT_USER_ID)}
                            className={`rounded-md px-2 py-1 font-semibold transition ${activeUser === CURRENT_USER_ID
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Winner (You Won)
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveUser('VE****99')}
                            className={`rounded-md px-2 py-1 font-semibold transition ${activeUser !== CURRENT_USER_ID
                                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                                : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            Non-Winner
                        </button>
                    </div>
                )}
            </div>

            {/* Content Tabs */}
            <AnimatePresence mode="wait">
                {subTab === 'current' ? (
                    <motion.div
                        key="current"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.25 }}
                    >
                        {status === 'winners_announced' ? (
                            <AnnouncedView
                                giveaways={giveaways}
                                userId={activeUser}
                                claimState={claimState}
                                onClaimStateChange={setClaimState}
                                onOpenClaimModal={handleOpenClaimModal}
                                onBrowse={onBrowse}
                            />
                        ) : status === 'next_giveaway' ? (
                            <NextGiveawayView nextStartsAt={nextStartsAt ?? fallbackNext} onBrowse={onBrowse} />
                        ) : (
                            <PendingView status={status} giveaways={giveaways} onBrowse={onBrowse} />
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="previous"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.25 }}
                    >
                        <PreviousWinnersView />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Prize Claim Modal */}
            <ClaimPrizeModal
                open={isClaimModalOpen}
                onOpenChange={setIsClaimModalOpen}
                prize={selectedPrize}
                giveaway={giveaways.find((g) => g.name === selectedPrize?.name)}
                claimState={claimState}
                onClaimStateChange={setClaimState}
            />
        </div>
    )
}
