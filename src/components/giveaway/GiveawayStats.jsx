import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { Clock, Gift, Trophy, Users, Zap } from 'lucide-react'
import useCountdown from '../../hooks/useCountdown'

/* Dummy data. Replace with API values later. */
const STATS = [
    { key: 'giveaways', label: 'Total giveaways', to: 24, decimals: 0, suffix: '', unit: 'Active', icon: Gift, chip: 'bg-violet-500/20 text-violet-300 border border-violet-500/30', unitTone: 'text-violet-300' },
    { key: 'participants', label: 'Total participants', to: 8.5, decimals: 1, suffix: 'K+', unit: 'Users', icon: Users, chip: 'bg-sky-500/20 text-sky-300 border border-sky-500/30', unitTone: 'text-sky-300' },
    { key: 'won', label: 'Prizes won', to: 1.2, decimals: 1, suffix: 'K+', unit: 'Rewards', icon: Trophy, chip: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30', unitTone: 'text-emerald-300' },
]

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

function Cell({ icon: Icon, chip, label, children }) {
    return (
        <motion.div
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex items-center gap-4 px-5 py-6 sm:px-6 transition-colors duration-300 hover:bg-white/[0.03]"
        >
            <div className={`flex size-13 shrink-0 items-center justify-center rounded-2xl shadow-lg backdrop-blur-md ${chip}`}>
                <Icon className="size-6 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
            </div>
            <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 sm:text-sm">{label}</p>
                <div className="mt-1 flex flex-wrap items-baseline gap-x-2 text-2xl font-black text-white sm:text-3xl">
                    {children}
                </div>
            </div>
        </motion.div>
    )
}

export default function GiveawayStats({ endsAt }) {
    /* Dummy end time: 12d 08h 45m from first render. Pass `endsAt` to override. */
    const [fallback] = useState(() => Date.now() + (12 * 86400 + 8 * 3600 + 45 * 60) * 1000)
    const { d, h, m, s, isOver } = useCountdown(endsAt ?? fallback)
    const reduce = useReducedMotion()

    return (
        <motion.section
            aria-label="Giveaway statistics"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 lg:-mt-24"
        >
            {/* Outer soft ambient backlight glow */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-indigo-600/25 blur-2xl filter"
            />

            <div
                className="grid grid-cols-1 divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/15
                bg-[#070414]/90 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl
                sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x lg:divide-white/10"
            >
                {STATS.map((st, i) => (
                    <div
                        key={st.key}
                        className={i % 2 === 1 ? 'sm:border-l sm:border-white/10 lg:border-l-0' : ''}
                    >
                        <Cell icon={st.icon} chip={st.chip} label={st.label}>
                            <CountUp to={st.to} decimals={st.decimals} suffix={st.suffix} />
                            <span className={`text-sm font-semibold ${st.unitTone}`}>{st.unit}</span>
                        </Cell>
                    </div>
                ))}

                <div className="sm:col-span-2 sm:border-t sm:border-white/10 lg:col-span-1 lg:border-t-0">
                    <motion.div
                        whileHover={{ y: -3 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="flex items-center gap-4 px-5 py-6 sm:px-6 transition-colors duration-300 hover:bg-white/[0.03]"
                    >
                        <div className="relative flex size-13 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 shadow-lg backdrop-blur-md">
                            <Clock className="size-6" aria-hidden="true" />
                            {/* Live pulsing indicator dot */}
                            {!isOver && !reduce && (
                                <span className="absolute -top-1 -right-1 flex size-3">
                                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-400 opacity-75" />
                                    <span className="relative inline-flex size-3 rounded-full bg-amber-500" />
                                </span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 sm:text-sm">Giveaway ends in</p>
                            </div>
                            <p className="mt-1 flex flex-wrap items-baseline text-2xl font-black text-white sm:text-3xl">
                                {isOver ? (
                                    <span className="text-xl text-rose-400">Giveaway Ended</span>
                                ) : (
                                    <span
                                        className="tabular-nums tracking-tight"
                                        role="timer"
                                        aria-label={`${d} days, ${h} hours, ${m} minutes remaining`}
                                    >
                                        {d}d <span className="text-slate-600 font-light">:</span> {pad(h)}h{' '}
                                        <span className="text-slate-600 font-light">:</span> {pad(m)}m
                                        <span className="ml-1.5 text-sm font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">{pad(s)}s</span>
                                    </span>
                                )}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    )
}