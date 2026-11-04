import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { BadgeCheck, ChevronLeft, ChevronRight, Gift, Headphones, Pause, Play, Smartphone, Watch } from 'lucide-react'
import { recentWinners } from '../../data/winners'

const ICONS = { phone: Smartphone, watch: Watch, earbuds: Headphones, giftcard: Gift }
const INTERVAL = 5000 // ms per message, kept slow so it stays readable

export default function WinnerAnnouncementSlider({ winners = recentWinners }) {
    const reduce = useReducedMotion()
    const n = winners.length

    const [index, setIndex] = useState(0)
    const [dir, setDir] = useState(1)
    const [userPaused, setUserPaused] = useState(false)
    const [hovered, setHovered] = useState(false)
    const [focused, setFocused] = useState(false)

    const paused = userPaused || hovered || focused

    const go = (delta) => {
        setDir(delta > 0 ? 1 : -1)
        setIndex((i) => (i + delta + n) % n)
    }
    const goTo = (i) => {
        if (i === index) return
        setDir(i > index ? 1 : -1)
        setIndex(i)
    }


    useEffect(() => {
        if (paused || n < 2) return
        const t = setTimeout(() => go(1), INTERVAL)
        return () => clearTimeout(t)
    }, [index, paused, n])

    if (n === 0) return null

    const w = winners[index]
    const Icon = ICONS[w.kind] ?? Gift

    const variants = {
        enter: (d) => ({ opacity: 0, x: reduce ? 0 : d * 28 }),
        center: { opacity: 1, x: 0 },
        exit: (d) => ({ opacity: 0, x: reduce ? 0 : d * -28 }),
    }

    const btn =
        'flex size-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white ' +
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300'

    return (
        <section
            role="region"
            aria-roledescription="carousel"
            aria-label="Recent winners"
            onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
            onPointerLeave={(e) => e.pointerType === 'mouse' && setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0d0a22] px-3 py-4 sm:gap-4 sm:px-4"
        >
            {/* Label */}
            <div className="flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-300">
                <span className="relative flex size-2">
                    {!paused && (
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
                    )}
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                </span>
                <span className="hidden sm:inline">Live winners</span>
            </div>

            <span className="hidden h-8 w-px bg-white/10 sm:block" aria-hidden="true" />

            {/* Message (swipe left/right on touch screens) */}
            <div
                className="relative flex h-[4.25rem] min-w-0 flex-1 items-center overflow-hidden sm:h-12"
                aria-live={paused ? 'polite' : 'off'}
                aria-atomic="true"
            >
                <AnimatePresence mode="wait" custom={dir} initial={false}>
                    <motion.div
                        key={w.id}
                        custom={dir}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.32, ease: 'easeOut' }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                            if (info.offset.x < -50) go(1)
                            else if (info.offset.x > 50) go(-1)
                        }}
                        className="flex w-full cursor-grab items-center gap-3 active:cursor-grabbing"
                    >
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                            <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                            <p className="text-sm leading-5 text-slate-200 sm:truncate sm:text-base">
                                {w.lead}<span className="font-semibold text-amber-300">{w.prize}</span>
                            </p>
                            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                                <BadgeCheck className="size-3.5 text-emerald-400" aria-hidden="true" />
                                Verified winner · {w.ago}
                            </p>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex shrink-0 items-center gap-0.5">
                <div className="mr-2 hidden items-center gap-1.5 md:flex" role="group" aria-label="Choose message">
                    {winners.map((x, i) => (
                        <button
                            key={x.id}
                            type="button"
                            aria-label={`Show winner ${i + 1} of ${n}`}
                            aria-current={i === index}
                            onClick={() => goTo(i)}
                            className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 ${i === index ? 'w-5 bg-violet-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
                                }`}
                        />
                    ))}
                </div>

                <button type="button" onClick={() => go(-1)} aria-label="Previous winner" className={`${btn} hidden sm:flex`}>
                    <ChevronLeft className="size-4" />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next winner" className={btn}>
                    <ChevronRight className="size-4" />
                </button>
                <button
                    type="button"
                    onClick={() => setUserPaused((p) => !p)}
                    aria-label={userPaused ? 'Resume automatic rotation' : 'Pause automatic rotation'}
                    className={btn}
                >
                    {userPaused ? <Play className="size-4" /> : <Pause className="size-4" />}
                </button>
            </div>
        </section>
    )
}