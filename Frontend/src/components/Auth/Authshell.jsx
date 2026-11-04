import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Sparkles } from 'lucide-react'

/* Shared layout for the Login and Signup pages. */
export function AuthShell({ title, subtitle, notice, children, footer }) {
    const reduce = useReducedMotion()
    return (
        <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#05030f] px-4 py-16 sm:px-6 lg:px-8">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/30 via-[#05030f]/90 to-[#05030f]"
            />
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -left-32 top-1/4 -z-10 size-[480px] rounded-full bg-violet-600/15 blur-[130px]"
                animate={reduce ? undefined : { x: [0, 50, 0], y: [0, -30, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
            />

            <Link
                to="/"
                className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 sm:left-6 sm:top-6"
            >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back to giveaways
            </Link>

            <motion.div
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#0c091d]/90 p-8 shadow-[0_30px_70px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:p-10"
            >
                <div className="text-center">
                    <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-violet-300">
                        <Sparkles className="size-3.5 text-violet-400" aria-hidden="true" />
                        VELOOP Rewards
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-white">{title}</h1>
                    <p className="mt-1.5 text-sm text-slate-400">{subtitle}</p>
                </div>

                {notice && (
                    <p className="mt-6 rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-100">
                        {notice}
                    </p>
                )}

                <div className="mt-8">{children}</div>
                <div className="mt-8 border-t border-white/5 pt-6 text-center text-sm text-slate-400">{footer}</div>
            </motion.div>
        </section>
    )
}

/* Labelled input with an error message and a show/hide toggle for passwords. */
export function Field({ id, label, icon: Icon, error, type = 'text', ...rest }) {
    const [show, setShow] = useState(false)
    const isPassword = type === 'password'

    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                {label}
            </label>
            <div className="relative">
                {Icon && (
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                        <Icon className="size-4" aria-hidden="true" />
                    </span>
                )}
                <input
                    id={id}
                    type={isPassword && show ? 'text' : type}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className={`w-full rounded-2xl border bg-white/[0.03] py-3.5 text-sm text-white placeholder-slate-500 transition focus:bg-white/[0.06] focus:outline-none focus:ring-2 ${Icon ? 'pl-11' : 'pl-4'
                        } ${isPassword ? 'pr-12' : 'pr-4'} ${error
                            ? 'border-rose-400/60 focus:border-rose-400 focus:ring-rose-400/20'
                            : 'border-white/10 focus:border-violet-500 focus:ring-violet-500/30'
                        }`}
                    {...rest}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        aria-label={show ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-0 flex items-center rounded-r-2xl px-4 text-slate-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                    >
                        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                )}
            </div>
            {error && (
                <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-rose-300">
                    {error}
                </p>
            )}
        </div>
    )
}

/* Primary submit button used by both forms. */
export function SubmitButton({ loading, loadingText, children }) {
    return (
        <motion.button
            type="submit"
            disabled={loading}
            whileTap={loading ? undefined : { scale: 0.98 }}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 py-4 text-base font-bold text-white
                 shadow-[0_10px_30px_rgba(109,40,217,0.4)] transition hover:brightness-110 focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? loadingText : children}
        </motion.button>
    )
}