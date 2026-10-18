import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, FileText, Gift, ListChecks, ShieldCheck, Ticket, Trophy, User } from 'lucide-react'

/* Full class strings only, so Tailwind can find them. */
const STEPS = [
    {
        icon: User,
        title: 'Sign up or log in',
        text: 'Create your VELOOP account, or log in, to get started.',
        tint: 'bg-violet-500/15 text-violet-300',
        ring: 'group-hover:ring-violet-400/50',
    },
    {
        icon: ListChecks,
        title: 'Complete activities',
        text: 'Finish the eligible tasks listed on each giveaway.',
        tint: 'bg-sky-500/15 text-sky-300',
        ring: 'group-hover:ring-sky-400/50',
    },
    {
        icon: Ticket,
        title: 'Earn entries',
        text: 'Every completed task adds entries to your total.',
        tint: 'bg-emerald-500/15 text-emerald-300',
        ring: 'group-hover:ring-emerald-400/50',
    },
    {
        icon: Gift,
        title: 'Join the giveaway',
        text: 'Use your entries on the giveaways you want to win.',
        tint: 'bg-orange-500/15 text-orange-300',
        ring: 'group-hover:ring-orange-400/50',
    },
    {
        icon: Trophy,
        title: 'Winner is selected',
        text: 'When it ends, winners are picked at random and announced publicly.',
        tint: 'bg-amber-400/15 text-amber-300',
        ring: 'group-hover:ring-amber-300/50',
    },
]

export default function HowToParticipate({ onViewRules }) {
    const reduce = useReducedMotion()

    const lineProps = (axis) => ({
        initial: reduce ? false : { [axis]: 0 },
        whileInView: { [axis]: 1 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 1.2, ease: 'easeInOut' },
    })

    return (
        <section
            id="how-it-works"
            aria-labelledby="how-title"
            className="scroll-mt-8 rounded-3xl border border-white/10 bg-[#0d0a22] p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden"
        >
            {/* Subtle background ambient glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

            <div className="flex flex-wrap items-end justify-between gap-4 relative z-10">
                <div>
                    <h2 id="how-title" className="text-2xl font-bold text-white sm:text-3xl tracking-tight">
                        How to participate
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-400 sm:text-base">
                        Five simple steps from signing up to winning.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onViewRules}
                    className="group inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold
                     text-slate-100 transition-all duration-200 hover:border-white/30 hover:bg-white/5 focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-violet-300 shadow-sm"
                >
                    <FileText className="size-4 text-violet-300" aria-hidden="true" />
                    View rules and guidelines
                    <ArrowRight
                        className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                        aria-hidden="true"
                    />
                </button>
            </div>

            <ol className="relative mt-12 flex flex-col gap-8 lg:grid lg:grid-cols-5 lg:gap-6 relative z-10">
                {/* Connector: vertical on mobile, horizontal on desktop. Fills in once on scroll. */}
                <div aria-hidden="true" className="absolute bottom-7 left-7 top-7 w-px bg-white/10 lg:hidden">
                    <motion.div
                        {...lineProps('scaleY')}
                        className="h-full w-full origin-top bg-gradient-to-b from-violet-400/70 via-sky-400/70 to-amber-300/70"
                    />
                </div>
                <div aria-hidden="true" className="absolute left-[10%] right-[10%] top-7 hidden h-px bg-white/10 lg:block">
                    <motion.div
                        {...lineProps('scaleX')}
                        className="h-full w-full origin-left bg-gradient-to-r from-violet-400/70 via-emerald-400/70 to-amber-300/70"
                    />
                </div>

                {STEPS.map((s, i) => {
                    const Icon = s.icon
                    return (
                        <motion.li
                            key={s.title}
                            initial={reduce ? false : { opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.45, delay: i * 0.1, ease: 'easeOut' }}
                            className="group relative flex items-start gap-4 lg:flex-col lg:items-center lg:gap-0 lg:text-center"
                        >
                            <span className="relative z-10 shrink-0 rounded-full bg-[#0d0a22] shadow-md">
                                <span
                                    className={`flex size-14 items-center justify-center rounded-full ring-1 ring-white/10 transition-all duration-300
                                    group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${s.tint} ${s.ring}`}
                                >
                                    <Icon className="size-6" aria-hidden="true" />
                                </span>
                                <span
                                    aria-hidden="true"
                                    className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full border
                                    border-white/15 bg-[#161233] text-[11px] font-bold text-slate-200 shadow"
                                >
                                    {i + 1}
                                </span>
                            </span>

                            <div className="pt-0.5 lg:mt-5 lg:pt-0">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Step {i + 1}</p>
                                <h3 className="mt-1 text-base font-semibold text-white tracking-tight">{s.title}</h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-slate-400 lg:mx-auto lg:max-w-[210px]">{s.text}</p>
                            </div>
                        </motion.li>
                    )
                })}
            </ol>

            <p className="mt-12 flex items-start sm:items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3.5 text-sm text-slate-300 relative z-10">
                <ShieldCheck className="size-5 shrink-0 text-emerald-400" aria-hidden="true" />
                <span>Winners are chosen by a random draw after each giveaway closes, and every result is published on this page.</span>
            </p>
        </section>
    )
}