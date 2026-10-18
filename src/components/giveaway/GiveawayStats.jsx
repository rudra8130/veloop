import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { Clock, Gift, Trophy, Users } from 'lucide-react'
import useCountdown from '../../hooks/UseCountDown'

/* Dummy data. Replace with API values later. */
const STATS = [
    { key: 'giveaways', label: 'Total giveaways', to: 24, decimals: 0, suffix: '', unit: 'Active', icon: Gift, chip: 'bg-violet-500/15 text-violet-300', unitTone: 'text-violet-300' },
    { key: 'participants', label: 'Total participants', to: 8.5, decimals: 1, suffix: 'K+', unit: 'Users', icon: Users, chip: 'bg-sky-500/15 text-sky-300', unitTone: 'text-sky-300' },
    { key: 'won', label: 'Prizes won', to: 1.2, decimals: 1, suffix: 'K+', unit: 'Rewards', icon: Trophy, chip: 'bg-emerald-500/15 text-emerald-300', unitTone: 'text-emerald-300' },
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
            ease: 'easeOut',
            onUpdate: setVal,
        })
        return () => controls.stop()
    }, [inView, reduce, to])

    return (
        <span ref={ref} className="tabular-nums">
            {val.toFixed(decimals)}
            {suffix}
        </span>
    )
}

const pad = (n) => String(n).padStart(2, '0')

function Cell({ icon: Icon, chip, label, children }) {
    return (
        <div className="flex items-center gap-3.5 px-4 py-5 sm:px-6">
            <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${chip}`}>
                <Icon className="size-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
                <p className="text-xs text-slate-400 sm:text-sm">{label}</p>
                <p className="mt-0.5 flex flex-wrap items-baseline gap-x-1.5 text-2xl font-bold text-white sm:text-3xl">
                    {children}
                </p>
            </div>
        </div>
    )
}

export default function GiveawayStats({ endsAt }) {
    /* Dummy end time: 12d 08h 45m from first render. Pass `endsAt` to override. */
    const [fallback] = useState(() => Date.now() + (12 * 86400 + 8 * 3600 + 45 * 60) * 1000)
    const { d, h, m, s, isOver } = useCountdown(endsAt ?? fallback)

    return (
        <motion.section
            aria-label="Giveaway statistics"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative z-10 -mt-14 sm:-mt-16 lg:-mt-20"
        >
            <div
                className="grid grid-cols-1 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10
                   bg-[#0d0a22]/90 shadow-[0_20px_50px_rgb(0_0_0/0.45)] backdrop-blur
                   sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x"
            >
                {STATS.map((st, i) => (
                    <div
                        key={st.key}
                        className={i % 2 === 1 ? 'sm:border-l sm:border-white/10 lg:border-l-0' : ''}
                    >
                        <Cell icon={st.icon} chip={st.chip} label={st.label}>
                            <CountUp to={st.to} decimals={st.decimals} suffix={st.suffix} />
                            <span className={`text-sm font-medium ${st.unitTone}`}>{st.unit}</span>
                        </Cell>
                    </div>
                ))}

                <div className="sm:col-span-2 sm:border-t sm:border-white/10 lg:col-span-1 lg:border-t-0">
                    <Cell icon={Clock} chip="bg-amber-500/15 text-amber-300" label="Giveaway ends in">
                        {isOver ? (
                            <span className="text-xl">Ended</span>
                        ) : (
                            <span
                                className="tabular-nums"
                                role="timer"
                                aria-label={`${d} days, ${h} hours, ${m} minutes remaining`}
                            >
                                {d}d <span className="text-slate-500">:</span> {pad(h)}h{' '}
                                <span className="text-slate-500">:</span> {pad(m)}m
                                <span className="ml-1.5 text-sm font-medium text-amber-300">{pad(s)}s</span>
                            </span>
                        )}
                    </Cell>
                </div>
            </div>
        </motion.section>
    )
}