import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import {
    AlertCircle, ArrowRight, BadgeCheck, Check, Clock,
    Gift, Loader2, Mail, MapPin, Package, Phone, ShieldCheck,
    Sparkles, Trophy, User, X,
} from 'lucide-react'

/* ─────────────────────── Helpers ─────────────────────── */

export function isDigitalPrize(art, prizeName = '') {
    if (art === 'giftcard') return true
    if (prizeName && /gift\s*card|amazon/i.test(prizeName)) return true
    return false
}

/* Claim deadline: 7 days from now (or from a given date). */
export function getClaimDeadline(baseDate) {
    const d = baseDate ? new Date(baseDate) : new Date()
    d.setDate(d.getDate() + 7)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

/* ─────────────────────── Claim State Config ─────────────────────── */

export const CLAIM_STATES = {
    not_submitted: {
        key: 'not_submitted',
        label: 'Not Submitted',
        shortLabel: 'Not Claimed',
        chip: 'bg-slate-500/10 text-slate-300 border-slate-500/30',
        icon: Gift,
        stepIndex: 0,
        description: "You haven't submitted your claim details yet. Please submit within the 7-day claim window.",
    },
    submitted: {
        key: 'submitted',
        label: 'Claim Submitted ✓',
        shortLabel: 'Submitted',
        chip: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        icon: Check,
        stepIndex: 1,
        description: 'Your claim has been submitted successfully! Our team will verify your details.',
    },
    processing: {
        key: 'processing',
        label: 'Prize Verification In Progress',
        shortLabel: 'Processing',
        chip: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        icon: Loader2,
        stepIndex: 2,
        description: 'We are verifying your eligibility and preparing your prize shipment. This takes 2–3 business days.',
    },
    completed: {
        key: 'completed',
        label: 'Prize Delivered ✓',
        shortLabel: 'Completed',
        chip: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        icon: Package,
        stepIndex: 3,
        description: 'Your prize has been successfully fulfilled and delivered. Enjoy your reward!',
    },
    expired: {
        key: 'expired',
        label: 'Claim Window Expired',
        shortLabel: 'Expired',
        chip: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        icon: AlertCircle,
        stepIndex: -1,
        description: 'The 7-day claim window has passed. Unclaimed prizes are returned to the prize pool.',
    },
}

const LIFECYCLE_STEPS = [
    { key: 'submitted', label: 'Claim Submitted' },
    { key: 'processing', label: 'Verification & Prep' },
    { key: 'completed', label: 'Prize Delivered' },
]

/* ─────────────────────── Input Styling ─────────────────────── */

const inputClass = `w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white
    placeholder:text-slate-500 transition-all duration-200
    focus:border-violet-400/60 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-violet-400/30
    hover:border-white/25`

function Field({ label, icon: Icon, error, children }) {
    return (
        <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {Icon && <Icon className="size-3.5" aria-hidden="true" />}
                {label}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
        </div>
    )
}

/* ─────────────────────── Verification Step ─────────────────────── */

function VerificationStep({ prize, giveaway, onContinue }) {
    const isDigital = isDigitalPrize(prize?.art || giveaway?.art, prize?.name || giveaway?.name)
    const deadline = getClaimDeadline()

    const rows = [
        ['Prize', prize?.name || giveaway?.name || 'Selected Prize', 'text-white font-bold'],
        ['Giveaway name', prize?.giveawayName || giveaway?.name || 'Current Giveaway', 'text-violet-300'],
        ['Winner status', 'Winner ✓', 'text-emerald-400 font-semibold'],
        ['Claim within', '7 days', 'text-amber-300 font-semibold'],
        ['Claim deadline', deadline, 'text-slate-200'],
        ['Required information', isDigital ? 'Email address only' : 'Full Name, Phone, Complete Address, PIN', 'text-slate-300'],
    ]

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                    <ShieldCheck className="size-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Winner Verification</h3>
                    <p className="text-xs text-slate-400">Please review your prize and eligibility details before submitting.</p>
                </div>
            </div>

            <div className="space-y-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                {rows.map(([label, value, color]) => (
                    <div key={label} className="flex items-center justify-between gap-3 border-b border-white/[0.05] py-2 last:border-b-0">
                        <span className="text-xs font-medium text-slate-400">{label}</span>
                        <span className={`text-sm text-right ${color}`}>{value}</span>
                    </div>
                ))}
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-amber-200/90 flex items-start gap-2.5">
                <Clock className="size-4 shrink-0 mt-0.5 text-amber-400" />
                <span>
                    Prizes must be claimed within <strong>7 days</strong> of winner announcement. Only required fulfillment details will be collected.
                </span>
            </div>

            <motion.button
                type="button"
                onClick={onContinue}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600
                    px-6 py-3.5 text-sm font-bold text-black shadow-lg shadow-amber-500/20
                    transition hover:shadow-amber-500/30 hover:brightness-110
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
                Continue to Prize Form
                <ArrowRight className="size-4" />
            </motion.button>
        </div>
    )
}

/* ─────────────────────── Physical Prize Form ─────────────────────── */

function PhysicalForm({ prize, giveaway, onSubmit, onBack, loading }) {
    const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', state: '', pin: '' })
    const [errors, setErrors] = useState({})

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

    const validate = () => {
        const errs = {}
        if (!form.name.trim()) errs.name = 'Full name is required'
        if (!/^\d{10}$/.test(form.phone.trim())) errs.phone = 'Enter a valid 10-digit phone number'
        if (!form.address.trim()) errs.address = 'Complete delivery address is required'
        if (!form.city.trim()) errs.city = 'City is required'
        if (!form.state.trim()) errs.state = 'State is required'
        if (!/^\d{6}$/.test(form.pin.trim())) errs.pin = 'Enter a valid 6-digit PIN code'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) onSubmit(form)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-500/25 text-amber-300">
                        <Gift className="size-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white">Claim Your Prize</h3>
                        <p className="text-xs text-slate-400">
                            You won <span className="font-semibold text-amber-300">{prize?.name || giveaway?.name}</span>
                        </p>
                    </div>
                </div>
                {onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-xs text-slate-400 hover:text-white underline underline-offset-4"
                    >
                        Back
                    </button>
                )}
            </div>

            <Field label="Full Name" icon={User} error={errors.name}>
                <input
                    type="text"
                    value={form.name}
                    onChange={set('name')}
                    placeholder="Enter your full name"
                    className={inputClass}
                    autoFocus
                />
            </Field>

            <Field label="Phone Number" icon={Phone} error={errors.phone}>
                <input
                    type="tel"
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className={inputClass}
                />
            </Field>

            <Field label="Complete Address" icon={MapPin} error={errors.address}>
                <textarea
                    value={form.address}
                    onChange={set('address')}
                    placeholder="House/Flat No., Street, Landmark"
                    rows={2}
                    className={`${inputClass} resize-none`}
                />
            </Field>

            <div className="grid grid-cols-3 gap-3">
                <Field label="City" error={errors.city}>
                    <input
                        type="text"
                        value={form.city}
                        onChange={set('city')}
                        placeholder="City"
                        className={inputClass}
                    />
                </Field>
                <Field label="State" error={errors.state}>
                    <input
                        type="text"
                        value={form.state}
                        onChange={set('state')}
                        placeholder="State"
                        className={inputClass}
                    />
                </Field>
                <Field label="PIN Code" error={errors.pin}>
                    <input
                        type="text"
                        value={form.pin}
                        onChange={set('pin')}
                        placeholder="6-digit"
                        maxLength={6}
                        className={inputClass}
                    />
                </Field>
            </div>

            <p className="flex items-start gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                Only information required for prize fulfillment is collected. Never shared publicly.
            </p>

            <motion.button
                type="submit"
                disabled={loading}
                whileHover={loading ? undefined : { scale: 1.01 }}
                whileTap={loading ? undefined : { scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600
                    px-6 py-3.5 text-sm font-bold text-black shadow-lg shadow-amber-500/20
                    transition hover:shadow-amber-500/30 hover:brightness-110
                    disabled:opacity-60 disabled:cursor-not-allowed
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
                {loading && <Loader2 className="size-4 animate-spin" />}
                {loading ? 'Submitting Details…' : 'Submit Claim'}
            </motion.button>
        </form>
    )
}

/* ─────────────────────── Amazon Gift Card Form ─────────────────────── */

function GiftCardForm({ prize, giveaway, onSubmit, onBack, loading }) {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')

    const validate = () => {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError('Enter a valid email address')
            return false
        }
        setError('')
        return true
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) onSubmit({ email })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/25 text-amber-300">
                        <Gift className="size-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white">Claim Amazon Gift Card</h3>
                        <p className="text-xs text-slate-400">
                            You won <span className="font-semibold text-amber-300">{prize?.name || giveaway?.name}</span>
                        </p>
                    </div>
                </div>
                {onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="text-xs text-slate-400 hover:text-white underline underline-offset-4"
                    >
                        Back
                    </button>
                )}
            </div>

            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
                <p className="text-xs leading-relaxed text-amber-200">
                    🎁 For Amazon Gift Card winners, we do <strong>not</strong> require a physical delivery address.
                    Your digital gift card voucher code will be dispatched directly to your email.
                </p>
            </div>

            <Field label="Email Address" icon={Mail} error={error}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email where you want to receive your gift card"
                    className={inputClass}
                    autoFocus
                />
            </Field>

            <p className="flex items-start gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-400" />
                Your email is strictly used to deliver your gift card voucher code.
            </p>

            <motion.button
                type="submit"
                disabled={loading}
                whileHover={loading ? undefined : { scale: 1.01 }}
                whileTap={loading ? undefined : { scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600
                    px-6 py-3.5 text-sm font-bold text-black shadow-lg shadow-amber-500/20
                    transition hover:shadow-amber-500/30 hover:brightness-110
                    disabled:opacity-60 disabled:cursor-not-allowed
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
                {loading && <Loader2 className="size-4 animate-spin" />}
                {loading ? 'Submitting Details…' : 'Submit Claim'}
            </motion.button>
        </form>
    )
}

/* ─────────────────────── Claim Status View ─────────────────────── */

function ClaimStatusView({ claimState, prize, onClose, onStateChange }) {
    const cfg = CLAIM_STATES[claimState] ?? CLAIM_STATES.submitted
    const Icon = cfg.icon

    const isProcessing = claimState === 'processing'
    const isSuccess = claimState === 'submitted' || claimState === 'completed'
    const isExpired = claimState === 'expired'

    return (
        <div className="space-y-6 py-2 text-center">
            <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className={`mx-auto flex size-16 items-center justify-center rounded-2xl ${isSuccess
                    ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
                    : isExpired
                        ? 'bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30'
                        : 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30'
                    }`}
            >
                <Icon className={`size-8 ${isProcessing ? 'animate-spin' : ''}`} />
            </motion.div>

            <div>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-semibold ${cfg.chip}`}>
                    {cfg.label}
                </span>
                <h3 className="mt-2 text-lg font-bold text-white">
                    {isExpired ? 'Claim Period Has Ended' : isSuccess ? 'Claim In Good Standing' : 'Processing Prize'}
                </h3>
                <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">{cfg.description}</p>
            </div>

            {/* Lifecycle progress bar for non-expired states */}
            {!isExpired && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Fulfillment Timeline</p>
                    <div className="grid grid-cols-3 gap-2">
                        {LIFECYCLE_STEPS.map((s, idx) => {
                            const isDone = cfg.stepIndex >= idx + 1
                            const isCurrent = cfg.stepIndex === idx + 1
                            return (
                                <div key={s.key} className="space-y-1.5">
                                    <div
                                        className={`h-1.5 rounded-full transition-colors ${isDone
                                            ? 'bg-emerald-400'
                                            : isCurrent
                                                ? 'bg-amber-400'
                                                : 'bg-white/10'
                                            }`}
                                    />
                                    <p className={`text-[11px] font-medium leading-tight ${isDone || isCurrent ? 'text-white' : 'text-slate-500'}`}>
                                        {s.label}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {prize && (
                <div className="flex items-center justify-between rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3 text-left">
                    <div>
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">Won Prize</p>
                        <p className="text-sm font-semibold text-white">{prize.name}</p>
                    </div>
                    {prize.position && (
                        <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300 border border-amber-400/20">
                            {prize.position}
                        </span>
                    )}
                </div>
            )}

            {/* Dev helper to test claim states */}
            {onStateChange && (
                <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-3 text-left">
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Simulate Claim State (Preview)</p>
                    <div className="flex flex-wrap gap-1.5">
                        {Object.keys(CLAIM_STATES).map((st) => (
                            <button
                                key={st}
                                type="button"
                                onClick={() => onStateChange(st)}
                                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${claimState === st
                                    ? 'bg-violet-500/30 text-violet-200 border border-violet-400/40'
                                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                                    }`}
                            >
                                {CLAIM_STATES[st].shortLabel}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white
                    transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
            >
                Done
            </button>
        </div>
    )
}

/* ═══════════════════════ MAIN MODAL EXPORT ═══════════════════════ */

export default function ClaimPrizeModal({
    open,
    onOpenChange,
    prize,
    giveaway,
    claimState = 'not_submitted',
    onClaimStateChange,
}) {
    /*
     * Flow:
     * - If claimState === 'not_submitted': start at 'verify' -> 'form' -> 'loading' -> 'status'
     * - If claimState is already submitted/processing/completed/expired: open directly to 'status'
     */
    const [step, setStep] = useState(() => (claimState === 'not_submitted' ? 'verify' : 'status'))
    const [internalLoading, setInternalLoading] = useState(false)

    // When modal opens, sync initial step
    const handleOpenChange = (isOpen) => {
        if (isOpen) {
            setStep(claimState === 'not_submitted' ? 'verify' : 'status')
        }
        onOpenChange?.(isOpen)
    }

    const art = prize?.art || giveaway?.art || ''
    const digital = isDigitalPrize(art, prize?.name || giveaway?.name)

    const handleSubmit = (_formData) => {
        setInternalLoading(true)
        // Simulate API claim submission
        setTimeout(() => {
            setInternalLoading(false)
            onClaimStateChange?.('submitted')
            setStep('status')
        }, 1000)
    }

    const handleClose = () => {
        onOpenChange?.(false)
        setTimeout(() => {
            if (claimState === 'not_submitted') setStep('verify')
        }, 300)
    }

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <AnimatePresence>
                {open && (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                            <motion.div
                                className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        </Dialog.Overlay>

                        <Dialog.Content asChild>
                            <motion.div
                                className="fixed left-1/2 top-1/2 z-[70] w-[calc(100%-2rem)] max-w-lg max-h-[90vh] overflow-y-auto
                                    -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/15
                                    bg-[#0d0a22] p-6 sm:p-7 shadow-2xl focus:outline-none"
                                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.97 }}
                                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {/* Close button */}
                                <Dialog.Close
                                    aria-label="Close"
                                    onClick={handleClose}
                                    className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 transition
                                        hover:bg-white/10 hover:text-white
                                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                                >
                                    <X className="size-5" />
                                </Dialog.Close>

                                {/* Accessible dialog title */}
                                <Dialog.Title className="sr-only">
                                    Claim Prize: {prize?.name || 'Giveaway Prize'}
                                </Dialog.Title>

                                <AnimatePresence mode="wait">
                                    {step === 'verify' && (
                                        <motion.div
                                            key="verify"
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 12 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <VerificationStep
                                                prize={prize}
                                                giveaway={giveaway}
                                                onContinue={() => setStep('form')}
                                            />
                                        </motion.div>
                                    )}

                                    {step === 'form' && (
                                        <motion.div
                                            key="form"
                                            initial={{ opacity: 0, x: 12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -12 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {digital ? (
                                                <GiftCardForm
                                                    prize={prize}
                                                    giveaway={giveaway}
                                                    onSubmit={handleSubmit}
                                                    onBack={() => setStep('verify')}
                                                    loading={internalLoading}
                                                />
                                            ) : (
                                                <PhysicalForm
                                                    prize={prize}
                                                    giveaway={giveaway}
                                                    onSubmit={handleSubmit}
                                                    onBack={() => setStep('verify')}
                                                    loading={internalLoading}
                                                />
                                            )}
                                        </motion.div>
                                    )}

                                    {step === 'status' && (
                                        <motion.div
                                            key="status"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <ClaimStatusView
                                                claimState={claimState}
                                                prize={prize}
                                                onClose={handleClose}
                                                onStateChange={onClaimStateChange}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    )
}
