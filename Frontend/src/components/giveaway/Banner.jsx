import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Gift, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import giveawayCard from '../../assets/giveaway/giveawayCard.png'
import gift from '../../assets/giveaway/gift.png'
const CTA = {
    live: { label: 'Enter Giveaway', arrow: true },
    ending_soon: { label: 'Join Before It Ends', arrow: true },
    upcoming: { label: 'Notify Me', arrow: false },
    entered: { label: "You're In", icon: Check, disabled: true },
    closed: { label: 'Draw in Progress', disabled: true },
    winners_announced: { label: 'View Winners', arrow: true },
}

const TRUST = [
    { icon: ShieldCheck, title: '100% Safe', sub: 'Secure & trusted', tone: 'text-violet-400' },
    { icon: Zap, title: 'Instant Rewards', sub: 'Get rewards fast', tone: 'text-amber-400' },
    { icon: Gift, title: 'Exclusive VEs', sub: 'Special for you', tone: 'text-amber-400' },
]

export default function Banner({
    status = 'live',
    onAction,
    label = 'Exclusive Giveaway',
    heading = 'Giveaway',
    headingAccent = 'Rewards',
    description = 'Complete eligible activities, collect entries and get a chance to win exciting rewards.',
}) {
    const reduce = useReducedMotion()
    const cta = CTA[status] ?? CTA.live
    const Icon = cta.icon

    return (
        <section
            aria-labelledby="giveaway-banner-title"
            className="relative isolate overflow-hidden rounded-3xl border border-violet-500/40
                 bg-[#0c0820] p-5 shadow-[0_20px_60px_rgb(0_0_0/0.45)] sm:p-8 lg:p-10"
        >
            {/* one soft background wash + faint inner highlight */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10
                   bg-[radial-gradient(60%_80%_at_20%_100%,rgb(124_58_237/0.22),transparent_70%),radial-gradient(40%_60%_at_90%_10%,rgb(124_58_237/0.14),transparent_70%)]"
            />

            <div className="grid items-center gap-6 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr_290px] lg:gap-8">
                {/* LEFT: gift */}
                <div className="relative mx-auto w-40 md:mx-0 md:w-full">
                    <span
                        className="absolute -top-2 left-0 z-10 inline-flex items-center gap-2 rounded-full border
                       border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-violet-300
                       backdrop-blur md:-top-4 md:-left-2"
                    >
                        <Gift className="size-3.5" aria-hidden="true" />
                        {label}
                    </span>
                    <motion.div
                        initial={reduce ? false : { opacity: 0, y: 16, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="pt-8"
                    >
                        <img src={gift} alt="" className="w-full" />
                    </motion.div>
                </div>

                {/* CENTER: copy */}
                <div className="text-center md:text-left">
                    <p className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-violet-400">
                        <Sparkles className="size-4" aria-hidden="true" />
                        Unlock amazing rewards
                    </p>

                    <h2
                        id="giveaway-banner-title"
                        className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
                    >
                        {heading}
                        <span className="block text-violet-400">{headingAccent}</span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-300 md:mx-0">
                        {description}
                    </p>

                    {/* trust chips */}
                    <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                        {TRUST.map(({ icon: TIcon, title, sub, tone }) => (
                            <li
                                key={title}
                                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left"
                            >
                                <TIcon className={`size-6 shrink-0 ${tone}`} aria-hidden="true" />
                                <span className="leading-tight">
                                    <span className="block text-sm font-semibold text-white">{title}</span>
                                    <span className="block text-xs text-slate-400">{sub}</span>
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <motion.button
                        type="button"
                        onClick={onAction}
                        disabled={cta.disabled}
                        whileTap={cta.disabled ? undefined : { scale: 0.98 }}
                        className="group mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl
                       bg-gradient-to-r from-violet-500 to-indigo-500 px-8 py-3.5 text-base font-semibold
                       text-white shadow-[0_8px_28px_rgb(99_102_241/0.35)] transition
                       hover:brightness-110 focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c0820]
                       disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700
                       disabled:text-slate-300 disabled:shadow-none sm:w-auto md:w-full lg:w-auto"
                    >
                        {Icon && <Icon className="size-5" aria-hidden="true" />}
                        {cta.label}
                        {cta.arrow && (
                            <ArrowRight
                                className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                                aria-hidden="true"
                            />
                        )}
                    </motion.button>
                </div>

                {/* RIGHT: ticket (large screens only) */}
                <div className="relative hidden lg:block">
                    <motion.div
                        initial={reduce ? false : { opacity: 0, x: 24, rotate: -4 }}
                        animate={
                            reduce
                                ? { opacity: 1 }
                                : { opacity: 1, x: 0, rotate: -16, y: [0, -6, 0] }
                        }
                        transition={{
                            duration: 0.8,
                            ease: 'easeOut',
                            y: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
                        }}
                    >
                        <img src={giveawayCard} alt="" className="w-full" />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}