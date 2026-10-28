import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import GiveawayCard from '../giveaway/Card'
import gift from '../../assets/giveaway/gift.png'
import amazoncard from '../../assets/giveaway/amazoncard.png'
import phone from '../../assets/giveaway/phone.png'

const container = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05,
        },
    },
}

const itemVariant = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function FeaturedGiveaways({ giveaways = [], enteredIds = [], onJoin }) {
    const reduce = useReducedMotion()

    return (
        <section aria-labelledby="featured-title" className="relative py-8">
            {/* Ambient Background Glow */}
            <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 -z-10 h-[300px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]"
            />

            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-violet-300 backdrop-blur-md mb-3 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                        <Sparkles className="size-3.5 text-violet-400" aria-hidden="true" />
                        Handpicked Rewards
                    </div>
                    <h2 id="featured-title" className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                        Featured <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">giveaways</span>
                    </h2>
                    <p className="mt-1.5 text-sm sm:text-base text-slate-300">
                        Handpicked prizes you can enter right now. Complete tasks to increase your winning odds.
                    </p>
                </div>
                <a
                    href="#all-giveaways"
                    className="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm
                    font-semibold text-slate-200 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/40 hover:bg-white/[0.08] hover:text-white
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                >
                    <span>View all giveaways</span>
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </a>
            </div>

            {giveaways.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-3xl border border-dashed border-white/15 bg-[#0c091d]/50 px-6 py-16 text-center backdrop-blur-xl"
                >
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-4 shadow-lg">
                        <Sparkles className="size-6" />
                    </div>
                    <p className="text-lg font-bold text-white">No giveaways right now</p>
                    <p className="mt-1.5 text-sm text-slate-400 max-w-sm mx-auto">New high-value prizes are added regularly. Check back soon or join our community.</p>
                </motion.div>
            ) : (
                <motion.div
                    variants={container}
                    initial={reduce ? false : 'hidden'}
                    whileInView="show"
                    viewport={{ once: true, margin: '-40px' }}
                    className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
                >
                    {giveaways.map((g, i) => (
                        <motion.div key={g.id} variants={itemVariant} className="h-full">
                            <GiveawayCard
                                prize={g}
                                index={i}
                                entered={enteredIds.includes(g.id)}
                                onJoin={onJoin}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </section>
    )
}