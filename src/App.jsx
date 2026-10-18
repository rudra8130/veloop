import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Loader2, X } from 'lucide-react'
import GiveawayHero from './components/giveaway/GiveawayHero'
import GiveawayStats from './components/giveaway/GiveawayStats'
import GiveawayBanner from './components/giveaway/Banner'
import FeaturedGiveaways from './components/giveaway/FeaturedGiveaways'
import { giveaways } from './data/giveaways'
import HowToParticipate from './components/giveaway/HowToParticipate'

const STATUSES = ['upcoming', 'live', 'ending_soon', 'entered', 'closed', 'winners_announced']

export default function App() {
  const [status, setStatus] = useState('live')
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('confirm') // confirm | loading | success
  const [agreed, setAgreed] = useState(false)
  const [selected, setSelected] = useState(null) // prize chosen from a card, null = general entry
  const [enteredIds, setEnteredIds] = useState([])

  const handleJoinPrize = (prize) => {
    if (prize.status !== 'live') return // upcoming / winners flows come later
    setSelected(prize)
    setStep('confirm')
    setAgreed(false)
    setOpen(true)
  }

  const handleAction = () => {
    if (status === 'live' || status === 'ending_soon') {
      setSelected(null)
      setStep('confirm')
      setAgreed(false)
      setOpen(true)
    }
    // upcoming -> notify flow, winners_announced -> scroll to winners (build later)
  }

  const confirmEntry = () => {
    setStep('loading')
    setTimeout(() => {
      setStep('success')
      if (selected) setEnteredIds((ids) => [...ids, selected.id])
      else setStatus('entered')
    }, 900)
  }

  return (
    <div className="min-h-screen bg-[#070514] text-slate-100 antialiased">
      <GiveawayHero onJoin={handleAction} joined={status === 'entered'} />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <GiveawayStats />
      </div>

      <main id="giveaways" className="mx-auto w-full max-w-7xl scroll-mt-8 px-4 py-14 sm:px-6 lg:px-8">
        <FeaturedGiveaways giveaways={giveaways} enteredIds={enteredIds} onJoin={handleJoinPrize} />

        <div className="mt-14">
          <HowToParticipate onViewRules={() => { /* open rules modal later */ }} />
        </div>

        <div id="all-giveaways" className="mt-14 scroll-mt-8">
          <GiveawayBanner status={status} onAction={handleAction} />
        </div>

        {/* Dev-only: preview every status. Remove before shipping. */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500">Preview status:</span>
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`rounded-full border px-3 py-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${status === s
                ? 'border-violet-400 bg-violet-500/20 text-violet-200'
                : 'border-white/10 text-slate-400 hover:border-white/25'
                }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Next: Winner slider, Giveaway grid, How it works, Winners, Previous winners, FAQ */}
      </main>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2
                             rounded-2xl border border-white/10 bg-[#0f0b24] p-6 shadow-2xl focus:outline-none"
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Dialog.Close
                    aria-label="Close"
                    className="absolute right-4 top-4 rounded-md p-1 text-slate-400 hover:text-white
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                  >
                    <X className="size-5" />
                  </Dialog.Close>

                  {step !== 'success' ? (
                    <>
                      <Dialog.Title className="text-xl font-bold text-white">
                        {selected ? `Enter the ${selected.name} giveaway` : 'Enter this giveaway'}
                      </Dialog.Title>
                      <Dialog.Description className="mt-2 text-sm text-slate-400">
                        {selected?.entry ? `Entry: ${selected.entry}. ` : ''}Your entry is added to the draw. Winners are picked at random and announced publicly.
                      </Dialog.Description>

                      <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-slate-300">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="mt-0.5 size-4 accent-violet-500"
                        />
                        I agree to the giveaway rules and terms.
                      </label>

                      <button
                        type="button"
                        onClick={confirmEntry}
                        disabled={!agreed || step === 'loading'}
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl
                                   bg-gradient-to-r from-violet-500 to-indigo-500 px-6 py-3 font-semibold text-white
                                   transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50
                                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
                      >
                        {step === 'loading' && <Loader2 className="size-4 animate-spin" />}
                        {step === 'loading' ? 'Entering…' : 'Confirm entry'}
                      </button>
                    </>
                  ) : (
                    <div className="py-4 text-center">
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                        className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400"
                      >
                        <Check className="size-7" />
                      </motion.div>
                      <Dialog.Title className="text-xl font-bold text-white">You're in</Dialog.Title>
                      <Dialog.Description className="mt-2 text-sm text-slate-400">
                        Your entry is confirmed. We'll announce the winners when the giveaway ends.
                      </Dialog.Description>
                      <Dialog.Close className="mt-6 w-full rounded-xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
                        Done
                      </Dialog.Close>
                    </div>
                  )}
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  )
}