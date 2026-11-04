import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Lock, Mail, ArrowRight, Sparkles, User, AlertCircle, ArrowLeft, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { FaGoogle, FaTwitter, FaDiscord } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

export default function Login({ initialMode = 'login', onAuthSuccess, onCancel }) {
    const [mode, setMode] = useState(initialMode) // 'login' | 'signup'
    const [identifier, setIdentifier] = useState('') // username or email for login
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { login, signup } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const reduce = useReducedMotion()

    // Determine return destination
    const returnPath = location.state?.from || '/'
    const returnAction = location.state?.action || null
    const selectedPrize = location.state?.prize || null

    const handleModeSwitch = (newMode) => {
        setMode(newMode)
        setError('')
        setSuccessMsg('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccessMsg('')
        setIsLoading(true)

        if (mode === 'login') {
            if (!identifier.trim() || !password) {
                setError('Please provide your username/email and password.')
                setIsLoading(false)
                return
            }

            const res = await login(identifier, password)
            setIsLoading(false)

            if (!res.success) {
                setError(res.error || 'Failed to login.')
            } else {
                setSuccessMsg(`Welcome back, ${res.user.username}! Redirecting...`)
                setTimeout(() => {
                    if (onAuthSuccess) {
                        onAuthSuccess(res.user)
                    } else {
                        navigate(returnPath, {
                            state: {
                                triggerJoin: returnAction === 'join',
                                prize: selectedPrize,
                            },
                            replace: true,
                        })
                    }
                }, 700)
            }
        } else {
            // Signup mode
            if (!username.trim() || !email.trim() || !password) {
                setError('All fields are required.')
                setIsLoading(false)
                return
            }

            if (username.trim().length < 3) {
                setError('Username must be at least 3 characters.')
                setIsLoading(false)
                return
            }

            if (password.length < 6) {
                setError('Password must be at least 6 characters.')
                setIsLoading(false)
                return
            }

            const res = await signup(username, email, password)
            setIsLoading(false)

            if (!res.success) {
                setError(res.error || 'Registration failed.')
            } else {
                setSuccessMsg(`Account created for ${res.user.username}! Redirecting...`)
                setTimeout(() => {
                    if (onAuthSuccess) {
                        onAuthSuccess(res.user)
                    } else {
                        navigate(returnPath, {
                            state: {
                                triggerJoin: returnAction === 'join',
                                prize: selectedPrize,
                            },
                            replace: true,
                        })
                    }
                }, 700)
            }
        }
    }

    return (
        <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#05030f] px-4 py-16 sm:px-6 lg:px-8">
            {/* Background Mesh Gradients & Atmospheric Glow */}
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
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -right-32 bottom-10 -z-10 size-[420px] rounded-full bg-indigo-600/15 blur-[130px]"
                animate={reduce ? undefined : { x: [0, -40, 0], y: [0, 30, 0] }}
                transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Subtle Grid Pattern Overlay */}
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
            />

            {/* Back Button */}
            <button
                type="button"
                onClick={() => (onCancel ? onCancel() : navigate('/'))}
                className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 backdrop-blur-md transition hover:border-white/20 hover:bg-white/10 hover:text-white sm:left-8 sm:top-8"
            >
                <ArrowLeft className="size-4" />
                Back to Giveaways
            </button>

            {/* Card Container */}
            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-[#0c091d]/90 p-8 shadow-[0_30px_70px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:p-10"
            >
                {/* Top Badge */}
                <div className="text-center">
                    <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.15)] mb-3">
                        <Sparkles className="size-3.5 text-violet-400" aria-hidden="true" />
                        VELOOP Rewards
                    </div>
                    <h2 className="text-3xl font-black tracking-tight text-white">
                        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-400">
                        {mode === 'login'
                            ? 'Log in to participate in live giveaways & win rewards.'
                            : 'Join VELOOP Rewards to start earning verified giveaway entries.'}
                    </p>
                </div>

                {/* Tabs switcher */}
                <div className="mt-6 grid grid-cols-2 rounded-xl border border-white/10 bg-white/[0.03] p-1">
                    <button
                        type="button"
                        onClick={() => handleModeSwitch('login')}
                        className={`rounded-lg py-2 text-xs font-bold transition ${
                            mode === 'login'
                                ? 'bg-violet-600 text-white shadow'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => handleModeSwitch('signup')}
                        className={`rounded-lg py-2 text-xs font-bold transition ${
                            mode === 'signup'
                                ? 'bg-violet-600 text-white shadow'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Feedback notices */}
                {error && (
                    <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
                        <AlertCircle className="size-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                {successMsg && (
                    <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-300">
                        <CheckCircle2 className="size-4 shrink-0" />
                        <span>{successMsg}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {mode === 'login' ? (
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                Username or Email
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                    <Mail className="size-4" />
                                </span>
                                <input
                                    type="text"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="Enter your username or email"
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 backdrop-blur-xl transition-all focus:border-violet-500 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                />
                            </div>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                    Username
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                        <User className="size-4" />
                                    </span>
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Choose a username"
                                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 backdrop-blur-xl transition-all focus:border-violet-500 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                        <Mail className="size-4" />
                                    </span>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 backdrop-blur-xl transition-all focus:border-violet-500 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                Password
                            </label>
                            {mode === 'login' && (
                                <span className="text-xs font-medium text-violet-400">
                                    Min 6 characters
                                </span>
                            )}
                        </div>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                                <Lock className="size-4" />
                            </span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3.5 pl-11 pr-12 text-sm text-white placeholder-slate-500 backdrop-blur-xl transition-all focus:border-violet-500 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative mt-2 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 py-3.5 text-base font-bold text-white shadow-[0_10px_30px_rgba(109,40,217,0.4)] transition-all hover:shadow-[0_14px_40px_rgba(109,40,217,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:opacity-50"
                    >
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                        <span className="relative flex items-center justify-center gap-2">
                            {isLoading
                                ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                                : (mode === 'login' ? 'Sign In' : 'Create Free Account')}
                            {!isLoading && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />}
                        </span>
                    </motion.button>
                </form>

                {/* Divider */}
                <div className="relative my-6 text-center">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10" />
                    </div>
                    <span className="relative bg-[#0c091d] px-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Or Continue With
                    </span>
                </div>

                {/* Social Login Buttons */}
                <div className="flex items-center justify-center gap-4">
                    <button
                        type="button"
                        onClick={() => setError('Social login is available with email registration.')}
                        className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white transition hover:border-violet-500/50 hover:bg-violet-600/20"
                        title="Google"
                    >
                        <FaGoogle className="size-4 text-rose-400" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setError('Social login is available with email registration.')}
                        className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white transition hover:border-violet-500/50 hover:bg-violet-600/20"
                        title="Twitter"
                    >
                        <FaTwitter className="size-4 text-sky-400" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setError('Social login is available with email registration.')}
                        className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white transition hover:border-violet-500/50 hover:bg-violet-600/20"
                        title="Discord"
                    >
                        <FaDiscord className="size-4 text-indigo-400" />
                    </button>
                </div>

                {/* Switch link */}
                <div className="mt-6 text-center border-t border-white/5 pt-5">
                    <p className="text-sm text-slate-400">
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button
                            type="button"
                            onClick={() => handleModeSwitch(mode === 'login' ? 'signup' : 'login')}
                            className="font-bold text-violet-400 transition-colors hover:text-violet-300 underline underline-offset-4"
                        >
                            {mode === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </section>
    )
}
