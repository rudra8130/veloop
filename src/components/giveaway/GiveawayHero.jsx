import {
    motion,
    useMotionValue,
    useReducedMotion,
    useSpring,
    useTransform,
} from 'framer-motion'
import { ArrowRight, Check, Gift, Sparkles } from 'lucide-react'
import gift from '../../assets/giveaway/gift.png'
import amazoncard from '../../assets/giveaway/amazoncard.png'
import phone from '../../assets/giveaway/phone.png'
import { CoinStackArt } from '../../art/RewardArt'

/* Small, slow particles. Fixed positions so SSR/refresh never reshuffles them. */
const PARTICLES = [
    { l: 8, t: 18, s: 3, d: 9, delay: 0, c: 'bg-violet-300' },
    { l: 22, t: 70, s: 2, d: 11, delay: 1.5, c: 'bg-amber-300' },
    { l: 40, t: 12, s: 2, d: 8, delay: 3, c: 'bg-violet-300' },
    { l: 52, t: 82, s: 3, d: 10, delay: 0.8, c: 'bg-violet-300' },
    { l: 63, t: 22, s: 2, d: 12, delay: 2.2, c: 'bg-amber-300' },
    { l: 74, t: 60, s: 3, d: 9, delay: 4, c: 'bg-violet-300' },
    { l: 86, t: 16, s: 2, d: 10, delay: 1, c: 'bg-violet-300' },
    { l: 92, t: 74, s: 2, d: 11, delay: 2.8, c: 'bg-amber-300' },
    { l: 30, t: 40, s: 2, d: 13, delay: 3.6, c: 'bg-violet-300' },
    { l: 80, t: 40, s: 2, d: 8, delay: 0.4, c: 'bg-violet-300' },
]

const CHECKS = ['Random draws', 'Public winners', 'Verified prizes']

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const item = {
    hidden: { opacity: 0, y: 20 },
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
    const sx = useSpring(mx, { stiffness: 50, damping: 20 })
    const sy = useSpring(my, { stiffness: 50, damping: 20 })

    // 3D card tilt values for illustration stage
    const rotateX = useTransform(sy, [-1, 1], [8, -8])
    const rotateY = useTransform(sx, [-1, 1], [-8, 8])

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
            className="relative isolate overflow-hidden bg-[#070514] px-4 pb-28 pt-14 sm:px-6 sm:pb-32 lg:px-8 lg:pb-36 lg:pt-20"
        >
            {/* Background: dynamic mesh wash + atmospheric glowing orbs */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_50%_0%,rgb(88,28,135/0.4),transparent_70%)]"
            />
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -left-24 top-1/3 -z-10 size-[480px] rounded-full bg-violet-600/20 blur-[120px]"
                animate={reduce ? undefined : { x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 top-10 -z-10 size-[420px] rounded-full bg-indigo-600/20 blur-[120px]"
                animate={reduce ? undefined : { x: [0, -45, 0], y: [0, 35, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Particles */}
            {!reduce && (
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                    {PARTICLES.map((p, i) => (
                        <motion.span
                            key={i}
                            className={`absolute rounded-full ${p.c}`}
                            style={{ left: `${p.l}%`, top: `${p.t}%`, width: p.s, height: p.s }}
                            animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2], scale: [1, 1.2, 1] }}
                            transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    ))}
                </div>
            )}

            <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
                {/* ---------- Copy ---------- */}
                <motion.div
                    variants={container}
                    initial={reduce ? false : 'hidden'}
                    animate="show"
                    className="text-center lg:text-left"
                >
                    <motion.div variants={item} className="inline-block">
                        <span className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-violet-400/40 bg-violet-500/10 px-4 py-1.5 text-sm font-semibold text-violet-200 shadow-[0_0_20px_rgb(139,92,246,0.15)] backdrop-blur-md">
                            <Sparkles className="size-4 text-violet-400 animate-pulse" aria-hidden="true" />
                            <span>Exclusive giveaways</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </span>
                    </motion.div>

                    <motion.h1
                        id="giveaway-hero-title"
                        variants={item}
                        className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.08]"
                    >
                        <span className="block">Complete tasks.</span>
                        <span className="block">Earn entries.</span>
                        <span className="block bg-gradient-to-r from-violet-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                            Win rewards.
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={item}
                        className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg lg:mx-0 font-normal"
                    >
                        Join live giveaways from VELOOP Rewards. Every task you finish adds an entry,
                        and every draw is 100% random and public.
                    </motion.p>

                    <motion.div
                        variants={item}
                        className="mt-8 flex flex-col items-stretch gap-3.5 sm:flex-row sm:justify-center lg:justify-start"
                    >
                        <motion.button
                            type="button"
                            onClick={onJoin}
                            disabled={joined}
                            whileHover={joined ? undefined : { scale: 1.02 }}
                            whileTap={joined ? undefined : { scale: 0.98 }}
                            className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-xl
                            bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 bg-[length:200%_auto] px-8 py-4 text-sm sm:text-base font-bold text-white
                            shadow-[0_10px_30px_rgb(109,40,217,0.4)] transition-all duration-300 hover:bg-[position:right_center] hover:shadow-[0_14px_40px_rgb(109,40,217,0.6)]
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300
                            focus-visible:ring-offset-2 focus-visible:ring-offset-[#070514]
                            disabled:cursor-not-allowed disabled:from-slate-800 disabled:to-slate-800
                            disabled:text-slate-400 disabled:shadow-none"
                        >
                            {joined ? <Check className="size-5" aria-hidden="true" /> : <Gift className="size-5 text-violet-200" aria-hidden="true" />}
                            <span className="relative tracking-wide">{joined ? "You're in" : 'Join Giveaway Now'}</span>
                            {!joined && (
                                <ArrowRight
                                    className="relative size-5 transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none"
                                    aria-hidden="true"
                                />
                            )}
                        </motion.button>

                        <a
                            href="#giveaways"
                            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.02] px-8 py-4 text-sm sm:text-base
                            font-semibold text-slate-200 transition-all duration-300 hover:border-violet-500/40 hover:bg-white/[0.06] hover:text-white
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 backdrop-blur-md"
                        >
                            View live giveaways
                        </a>
                    </motion.div>

                    <motion.ul
                        variants={item}
                        className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-sm text-slate-400 lg:justify-start font-medium"
                    >
                        {CHECKS.map((c) => (
                            <li key={c} className="inline-flex items-center gap-2">
                                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/30">
                                    <Check className="size-3" aria-hidden="true" />
                                </span>
                                <span className="text-slate-300">{c}</span>
                            </li>
                        ))}
                    </motion.ul>
                </motion.div>

                {/* ---------- Illustration stage with 3D Parallax Tilt ---------- */}
                <motion.div
                    style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                    className="group relative mx-auto aspect-[1/0.95] w-full max-w-[340px] sm:max-w-[460px] lg:max-w-[560px]"
                >
                    {/* Pulsing reward glow behind the center box */}
                    <motion.div
                        aria-hidden="true"
                        className="absolute left-1/2 top-[48%] size-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-violet-600/30 to-indigo-500/30 blur-[80px]
                        transition-opacity duration-700 group-hover:opacity-100"
                        animate={reduce ? { opacity: 0.7 } : { opacity: [0.6, 0.9, 0.6], scale: [1, 1.08, 1] }}
                        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* Phone, back left */}
                    <Layer depth={24} sx={sx} sy={sy} className="absolute left-[1%] top-[10%] z-0 w-[24%]">
                        <motion.div {...float(6, 9)}>
                            <div className="-rotate-[12deg] drop-shadow-[0_20px_35px_rgb(0_0_0/0.6)] transition-transform duration-500 hover:scale-105">
                                <img src={phone} alt="phone prize" className="w-full h-auto" />
                            </div>
                        </motion.div>
                    </Layer>

                    {/* Gift box, central hero element */}
                    <Layer depth={12} sx={sx} sy={sy} className="absolute left-[21%] top-[14%] z-10 w-[58%]">
                        <motion.div
                            whileHover={reduce ? undefined : { scale: 1.05, y: -6 }}
                            transition={{ type: 'spring', stiffness: 250, damping: 15 }}
                            className="drop-shadow-[0_25px_50px_rgb(0_0_0/0.7)]"
                        >
                            <img src={gift} alt="gift box" className="w-full h-auto" />
                        </motion.div>
                    </Layer>

                    {/* Ticket/Card, front right */}
                    <Layer depth={32} sx={sx} sy={sy} className="absolute bottom-[12%] right-[-2%] z-20 w-[46%]">
                        <motion.div {...float(9, 6.5)}>
                            <div className="-rotate-[10deg] drop-shadow-[0_20px_35px_rgb(0_0_0/0.65)] transition-transform duration-500 hover:scale-105">
                                <img src={amazoncard} alt="gift card reward" className="w-full h-auto" />
                            </div>
                        </motion.div>
                    </Layer>

                    {/* Coins, front left */}
                    <Layer depth={20} sx={sx} sy={sy} className="absolute bottom-[4%] left-[8%] z-20 w-[24%]">
                        <motion.div {...float(7, 8)}>
                            <CoinStackArt className="w-full drop-shadow-[0_16px_25px_rgb(0_0_0/0.6)]" />
                        </motion.div>
                    </Layer>
                </motion.div>
            </div>
        </section>
    )
}