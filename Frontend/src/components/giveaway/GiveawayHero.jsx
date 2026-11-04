import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
} from 'framer-motion'
import { ArrowRight, Check, Gift, Sparkles, Trophy } from 'lucide-react'
import gift from '../../assets/giveaway/gift.png'
import amazoncard from '../../assets/giveaway/amazoncard.png'
import phone from '../../assets/giveaway/phone.png'
import { CoinStackArt } from '../../art/RewardArt'

/* Small, slow particles with varying opacities and scales */
const PARTICLES = [
    { l: 8, t: 18, s: 2.5, d: 9, delay: 0, c: 'bg-violet-400/80' },
    { l: 22, t: 70, s: 2, d: 11, delay: 1.5, c: 'bg-amber-400/80' },
    { l: 40, t: 12, s: 3, d: 8, delay: 3, c: 'bg-indigo-400/80' },
    { l: 52, t: 82, s: 2, d: 10, delay: 0.8, c: 'bg-violet-400/80' },
    { l: 63, t: 22, s: 2.5, d: 12, delay: 2.2, c: 'bg-amber-400/80' },
    { l: 74, t: 60, s: 3, d: 9, delay: 4, c: 'bg-purple-400/80' },
    { l: 86, t: 16, s: 2, d: 10, delay: 1, c: 'bg-violet-400/80' },
    { l: 92, t: 74, s: 2.5, d: 11, delay: 2.8, c: 'bg-amber-400/80' },
    { l: 30, t: 40, s: 2, d: 13, delay: 3.6, c: 'bg-indigo-400/80' },
    { l: 80, t: 40, s: 3, d: 8, delay: 0.4, c: 'bg-violet-400/80' },
]

const CHECKS = ['Random draws', 'Public winners', 'Verified prizes']

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

/* One parallax layer. depth = max px of travel at the edge of the hero. */
function Layer({ depth, sx, sy, className, children }) {
    const x = useTransform(sx, (v) => v * depth)
    const y = useTransform(sy, (v) => v * depth)
    return (
        <motion.div style={{ x, y }} className={className}>
            {children}
        </motion.div>
    )
}

export default function GiveawayHero({ onJoin, joined = false }) {
    const reduce = useReducedMotion()

    const mx = useMotionValue(0)
    const my = useMotionValue(0)
    const sx = useSpring(mx, { stiffness: 45, damping: 22 })
    const sy = useSpring(my, { stiffness: 45, damping: 22 })

    // Subtle 3D perspective rotation for illustration container
    const rotateX = useTransform(sy, [-1, 1], [6, -6])
    const rotateY = useTransform(sx, [-1, 1], [-6, 6])

    const handleMove = (e) => {
        if (reduce) return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 2)
        my.set(((e.clientY - r.top) / r.height - 0.5) * 2)
    }
    const handleLeave = () => {
        mx.set(0)
        my.set(0)
    }

    const float = (distance, duration) =>
        reduce
            ? {}
            : {
                animate: { y: [0, -distance, 0] },
                transition: { duration, repeat: Infinity, ease: 'easeInOut' },
            }

    return (
        <section
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            aria-labelledby="giveaway-hero-title"
            className="relative isolate overflow-hidden bg-[#05030f] px-4 pb-28 pt-16 sm:px-6 sm:pb-36 lg:px-8 lg:pb-44 lg:pt-24"
        >
            {/* Background: Atmospheric Gradients & Ambient Lighting */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/30 via-[#05030f]/80 to-[#05030f]"
            />
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -left-32 top-1/4 -z-10 size-[520px] rounded-full bg-violet-600/15 blur-[140px]"
                animate={reduce ? undefined : { x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -right-32 top-10 -z-10 size-[480px] rounded-full bg-indigo-600/15 blur-[140px]"
                animate={reduce ? undefined : { x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Subtle Grid Pattern Overlay */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
            />

            {/* Particles */}
            {!reduce && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                    {PARTICLES.map((p, i) => (
                        <motion.span
                            key={i}
                            className={`absolute rounded-full ${p.c}`}
                            style={{ left: `${p.l}%`, top: `${p.t}%`, width: p.s, height: p.s }}
                            animate={{ y: [0, -25, 0], opacity: [0.2, 0.9, 0.2], scale: [1, 1.3, 1] }}
                            transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    ))}
                </div>
            )}

            <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
                {/* ---------- Copy Section ---------- */}
                <motion.div
                    variants={container}
                    initial={reduce ? false : 'hidden'}
                    animate="show"
                    className="text-center lg:text-left z-10"
                >
                    <motion.div variants={item} className="inline-block">
                        <div className="group relative inline-flex items-center gap-2.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-200 shadow-[0_0_25px_rgba(139,92,246,0.2)] backdrop-blur-xl">
                            <Sparkles className="size-4 text-violet-400 animate-pulse" aria-hidden="true" />
                            <span>Exclusive Giveaways</span>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </div>
                    </motion.div>

                    <motion.h1
                        id="giveaway-hero-title"
                        variants={item}
                        className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.05]"
                    >
                        <span className="block">Complete tasks.</span>
                        <span className="block">Earn entries.</span>
                        <span className="block bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent drop-shadow-sm">
                            Win rewards.
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={item}
                        className="mx-auto mt-6 max-w-lg text-base font-normal leading-relaxed text-slate-300 sm:text-lg lg:mx-0"
                    >
                        Join live giveaways from VELOOP Rewards. Every task you finish adds a verified entry,
                        and every winner draw is completely random and public.
                    </motion.p>

                    <motion.div
                        variants={item}
                        className="mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:justify-center lg:justify-start"
                    >
                        <motion.button
                            type="button"
                            onClick={onJoin}
                            disabled={joined}
                            whileHover={joined ? undefined : { scale: 1.02 }}
                            whileTap={joined ? undefined : { scale: 0.98 }}
                            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl
                            bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-8 py-4 text-base font-bold text-white
                            shadow-[0_10px_35px_rgba(109,40,217,0.45)] transition-all duration-300 hover:shadow-[0_15px_45px_rgba(109,40,217,0.65)]
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400
                            focus-visible:ring-offset-2 focus-visible:ring-offset-[#05030f]
                            disabled:cursor-not-allowed disabled:from-slate-800 disabled:via-slate-800 disabled:to-slate-800
                            disabled:text-slate-400 disabled:shadow-none"
                        >
                            {/* Shimmer sweep */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent
                                transition-transform duration-1000 group-hover:translate-x-full group-disabled:hidden motion-reduce:hidden"
                            />
                            {joined ? <Check className="size-5 text-emerald-300" aria-hidden="true" /> : <Gift className="size-5 text-violet-200" aria-hidden="true" />}
                            <span className="relative tracking-wide">{joined ? "You're in the Draw" : 'Join Giveaway Now'}</span>
                            {!joined && (
                                <ArrowRight
                                    className="relative size-5 transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none"
                                    aria-hidden="true"
                                />
                            )}
                        </motion.button>

                        <a
                            href="#giveaways"
                            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-4 text-base
                            font-semibold text-slate-200 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                        >
                            View Active Giveaways
                        </a>
                    </motion.div>

                    <motion.ul
                        variants={item}
                        className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium text-slate-400 lg:justify-start"
                    >
                        {CHECKS.map((c) => (
                            <li key={c} className="inline-flex items-center gap-2">
                                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)] border border-emerald-500/30">
                                    <Check className="size-3" aria-hidden="true" />
                                </span>
                                <span className="text-slate-300">{c}</span>
                            </li>
                        ))}
                    </motion.ul>
                </motion.div>

                {/* ---------- Illustration Stage with 3D Parallax Tilt ---------- */}
                <motion.div
                    style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                    className="group relative mx-auto aspect-[1/0.95] w-full max-w-[360px] sm:max-w-[480px] lg:max-w-[580px]"
                >
                    {/* Glowing Backdrop Mesh */}
                    <motion.div
                        aria-hidden="true"
                        className="absolute left-1/2 top-[48%] size-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-violet-600/35 to-indigo-600/35 blur-[90px]
                        transition-opacity duration-700 group-hover:opacity-100"
                        animate={reduce ? { opacity: 0.7 } : { opacity: [0.55, 0.85, 0.55], scale: [1, 1.05, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* Phone - Back Left */}
                    <Layer depth={22} sx={sx} sy={sy} className="absolute left-[2%] top-[12%] z-0 w-[24%]">
                        <motion.div {...float(6, 8.5)}>
                            <div className="-rotate-[10deg] drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)] transition-transform duration-500 hover:scale-105">
                                <img src={phone} alt="Phone reward" className="w-full h-auto rounded-2xl border border-white/10" />
                            </div>
                        </motion.div>
                    </Layer>

                    {/* Gift Box - Hero Element */}
                    <Layer depth={10} sx={sx} sy={sy} className="absolute left-[20%] top-[12%] z-10 w-[60%]">
                        <motion.div
                            whileHover={reduce ? undefined : { scale: 1.03, y: -6 }}
                            transition={{ type: 'spring', stiffness: 240, damping: 16 }}
                            className="drop-shadow-[0_30px_60px_rgba(109,40,217,0.4)]"
                        >
                            <img src={gift} alt="Gift Box" className="w-full h-auto" />
                        </motion.div>
                    </Layer>

                    {/* Amazon Card / Ticket - Front Right */}
                    <Layer depth={30} sx={sx} sy={sy} className="absolute bottom-[10%] right-[-2%] z-20 w-[46%]">
                        <motion.div {...float(8, 7)}>
                            <div className="-rotate-[8deg] drop-shadow-[0_22px_38px_rgba(0,0,0,0.7)] transition-transform duration-500 hover:scale-105">
                                <img src={amazoncard} alt="Gift Card" className="w-full h-auto rounded-xl border border-white/15" />
                            </div>
                        </motion.div>
                    </Layer>

                    {/* Coin Stack - Front Left */}
                    <Layer depth={18} sx={sx} sy={sy} className="absolute bottom-[6%] left-[6%] z-20 w-[24%]">
                        <motion.div {...float(5, 7.5)}>
                            <CoinStackArt className="w-full drop-shadow-[0_18px_28px_rgba(0,0,0,0.65)]" />
                        </motion.div>
                    </Layer>
                </motion.div>
            </div>
        </section>
    )
}