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
import WinnerAnnouncementSlider from './components/giveaway/WinnerSlider'
import * as Tabs from '@radix-ui/react-tabs'
import WinnersTab from './components/giveaway/WinnersTab'


const CAMPAIGN_STATES = ['upcoming', 'live', 'ending_soon', 'closed', 'winners_announced', 'next_giveaway']
const STATUSES = ['upcoming', 'live', 'ending_soon', 'entered', 'closed', 'winners_announced']

export default function App() {
  const [status, setStatus] = useState('live')
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('confirm') // confirm | loading | success
  const [agreed, setAgreed] = useState(false)
  const [tab, setTab] = useState('giveaways')
  const [campaign, setCampaign] = useState('live') // overall giveaway state, drives the Winners tab
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
        <div className="mt-5">
          <WinnerAnnouncementSlider />
        </div>
      </div>

      <main id="giveaways" className="mx-auto w-full max-w-7xl scroll-mt-8 px-4 py-14 sm:px-6 lg:px-8">
        <Tabs.Root value={tab} onValueChange={setTab}>
          <Tabs.List
            aria-label="Giveaway sections"
            className="mb-8 inline-flex rounded-xl border border-white/10 bg-[#0d0a22] p-1"
          >
            {[['giveaways', '🎁 Giveaways'], ['winners', '🏆 Winners']].map(([value, label]) => (
              <Tabs.Trigger
                key={value}
                value={value}
                className="rounded-lg px-5 py-2 text-sm font-semibold text-slate-400 transition hover:text-white
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300
                           data-[state=active]:bg-violet-500/20 data-[state=active]:text-white"
              >
                {label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          <Tabs.Content value="giveaways" className="focus-visible:outline-none">
            <FeaturedGiveaways giveaways={giveaways} enteredIds={enteredIds} onJoin={handleJoinPrize} />

            <div className="mt-14">
              <HowToParticipate onViewRules={() => { /* open rules modal later */ }} />
            </div>

            <div id="all-giveaways" className="mt-14 scroll-mt-8">
              <GiveawayBanner status={status} onAction={handleAction} />
            </div>
          </Tabs.Content>

          <Tabs.Content value="winners" className="focus-visible:outline-none">
            <WinnersTab status={campaign} giveaways={giveaways} onBrowse={() => setTab('giveaways')} />
          </Tabs.Content>
        </Tabs.Root>

        {/* Dev-only: preview states. Remove before shipping. */}
        <div className="mt-10 space-y-2 text-xs">
          {[
            ['Banner status:', STATUSES, status, setStatus],
            ['Giveaway state (Winners tab):', CAMPAIGN_STATES, campaign, setCampaign],
          ].map(([label, list, value, set]) => (
            <div key={label} className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500">{label}</span>
              {list.map((x) => (
                <button
                  key={x}
                  type="button"
                  onClick={() => set(x)}
                  className={`rounded-full border px-3 py-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${value === x
                    ? 'border-violet-400 bg-violet-500/20 text-violet-200'
                    : 'border-white/10 text-slate-400 hover:border-white/25'
                    }`}
                >
                  {x}
                </button>
              ))}
            </div>
          ))}
        </div>
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