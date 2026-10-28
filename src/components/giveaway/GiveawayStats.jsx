import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { Clock, Gift, Trophy, Users, TrendingUp } from 'lucide-react'
import useCountdown from '../../hooks/useCountdown'

/* Counts up once when scrolled into view. */
function CountUp({ to, decimals = 0, suffix = '' }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-40px' })
    const reduce = useReducedMotion()
    const [val, setVal] = useState(0)

    useEffect(() => {
        if (reduce) {
            setVal(to)
            return
        }
        if (!inView) return
        const controls = animate(0, to, {
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: setVal,
        })
        return () => controls.stop()
    }, [inView, reduce, to])

    return (
        <span ref={ref} className="tabular-nums tracking-tight">
            {val.toFixed(decimals)}
            {suffix}
        </span>
    )
}

const pad = (n) => String(n).padStart(2, '0')

export default function GiveawayStats({ endsAt }) {
    const [fallback] = useState(() => Date.now() + (12 * 86400 + 8 * 3600 + 45 * 60) * 1000)
    const { d, h, m, s, isOver } = useCountdown(endsAt ?? fallback)
    const reduce = useReducedMotion()

    return (
        <motion.section
            aria-label="Giveaway statistics"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-25 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 lg:-mt-28"
        >
            {/* Outer ambient backlight glow */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-violet-600/15 via-purple-600/15 to-indigo-600/20 blur-3xl filter"
            />

            {/* 4-Card Dashboard Grid matching the style reference */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {/* Card 1: Total Giveaways */}
                <motion.div
                    whileHover={{ y: -4, borderColor: 'rgba(139, 92, 246, 0.4)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0c091d]/90 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
                >
                    <div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Giveaways</span>
                            <span className="flex size-9 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
                                <Gift className="size-4" />
                            </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <h3 className="text-3xl font-black text-white tracking-tight">
                                <CountUp to={24} decimals={0} suffix="" />
                            </h3>
                            <span className="text-xs font-semibold text-violet-400">Active</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">Live pool rewards</p>
                    </div>

                    {/* Mini SVG Trend Line */}
                    <div className="mt-6 h-10 w-full">
                        <svg className="h-full w-full overflow-visible" viewBox="0 0 100 30" fill="none">
                            <path d="M0 25 Q 25 15, 50 18 T 100 5" stroke="url(#violetGrad)" strokeWidth="2.5" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="violetGrad" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#8b5cf6" stopOpacity="0.3" />
                                    <stop offset="1" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 border-t border-white/5 pt-3 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-0.5 font-bold text-emerald-400">
                            <TrendingUp className="size-3.5" /> +14.2%
                        </span>
                        <span>vs last 24h</span>
                    </div>
                </motion.div>

                {/* Card 2: Total Participants */}
                <motion.div
                    whileHover={{ y: -4, borderColor: 'rgba(56, 189, 248, 0.4)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0c091d]/90 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
                >
                    <div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Participants</span>
                            <span className="flex size-9 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300">
                                <Users className="size-4" />
                            </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <h3 className="text-3xl font-black text-white tracking-tight">
                                <CountUp to={8.5} decimals={1} suffix="K+" />
                            </h3>
                            <span className="text-xs font-semibold text-sky-400">Users</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">Verified entries</p>
                    </div>

                    {/* Circular Percentage Progress Style */}
                    <div className="mt-6 flex items-center justify-center py-1">
                        <div className="relative flex size-12 items-center justify-center rounded-full bg-sky-500/10 border-2 border-sky-500/30 text-xs font-bold text-sky-300">
                            85%
                        </div>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 border-t border-white/5 pt-3 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-0.5 font-bold text-emerald-400">
                            <TrendingUp className="size-3.5" /> +8.9%
                        </span>
                        <span>vs last 24h</span>
                    </div>
                </motion.div>

                {/* Card 3: Prizes Won */}
                <motion.div
                    whileHover={{ y: -4, borderColor: 'rgba(16, 185, 129, 0.4)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0c091d]/90 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
                >
                    <div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Prizes Won</span>
                            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                                <Trophy className="size-4" />
                            </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <h3 className="text-3xl font-black text-white tracking-tight">
                                <CountUp to={1.2} decimals={1} suffix="K+" />
                            </h3>
                            <span className="text-xs font-semibold text-emerald-400">Rewards</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">Successfully claimed</p>
                    </div>

                    {/* Mini SVG Trend Line */}
                    <div className="mt-6 h-10 w-full">
                        <svg className="h-full w-full overflow-visible" viewBox="0 0 100 30" fill="none">
                            <path d="M0 20 Q 30 22, 60 10 T 100 2" stroke="url(#emeraldGrad)" strokeWidth="2.5" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="emeraldGrad" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#10b981" stopOpacity="0.3" />
                                    <stop offset="1" stopColor="#10b981" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 border-t border-white/5 pt-3 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-0.5 font-bold text-emerald-400">
                            <TrendingUp className="size-3.5" /> +5.4%
                        </span>
                        <span>vs last 7d</span>
                    </div>
                </motion.div>

                {/* Card 4: Countdown Timer */}
                <motion.div
                    whileHover={{ y: -4, borderColor: 'rgba(245, 158, 11, 0.4)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0c091d]/90 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
                >
                    <div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Giveaway Ends In</span>
                            <div className="relative flex size-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300">
                                <Clock className="size-4" />
                                {!isOver && !reduce && (
                                    <span className="absolute -top-1 -right-1 flex size-2.5">
                                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
                                        <span className="relative inline-flex size-2.5 rounded-full bg-amber-500" />
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-3">
                            {isOver ? (
                                <h3 className="text-2xl font-black text-rose-400">Giveaway Ended</h3>
                            ) : (
                                <div className="flex items-baseline gap-1 text-2xl font-black text-white tracking-tight" role="timer">
                                    <span>{d}d</span>
                                    <span className="text-slate-600">:</span>
                                    <span>{pad(h)}h</span>
                                    <span className="text-slate-600">:</span>
                                    <span>{pad(m)}m</span>
                                    <span className="ml-1 text-xs font-bold text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/30">
                                        {pad(s)}s
                                    </span>
                                </div>
                            )}
                        </div>
                        <p className="mt-1 text-xs text-slate-400">Time remaining for entries</p>
                    </div>

                    {/* Bar chart indicator simulation */}
                    <div className="mt-6 flex h-10 items-end gap-1.5 px-1">
                        {[40, 65, 30, 80, 50, 90, 70, 85, 60, 95].map((val, idx) => (
                            <div
                                key={idx}
                                style={{ height: `${val}%` }}
                                className="w-full rounded-t bg-amber-500/40 transition-all hover:bg-amber-400"
                            />
                        ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-slate-400">
                        <span className="text-amber-300 font-semibold">Live Countdown</span>
                        <span className="text-slate-500">Public Draw</span>
                    </div>
                </motion.div>

            </div>
        </motion.section>
    )
}