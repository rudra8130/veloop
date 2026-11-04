import { Link } from 'react-router-dom'
import { LogOut, Ticket, Trophy } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import logoGif from '../../assets/logo.gif'

export default function Navbar({ onOpenWinners }) {
  const { user, isAuthenticated, logout, isWinner } = useAuth()

  const enteredCount = user?.enteredGiveaways?.length || 0

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-[#05030f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logoGif}
            alt="VELOOP Rewards Logo"
            className="size-10 rounded-xl object-contain shadow-[0_0_20px_rgba(139,92,246,0.35)] transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col">
            <span className="text-base font-black tracking-tight text-white group-hover:text-violet-200 transition-colors">
              VELOOP <span className="text-violet-400">REWARDS</span>
            </span>
          </div>
        </Link>

        {/* Right navigation / User info */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Winner Alert Badge */}
              {isWinner && (
                <button
                  type="button"
                  onClick={onOpenWinners}
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)] animate-pulse hover:bg-amber-400/25 transition cursor-pointer"
                >
                  <Trophy className="size-3.5 text-amber-300" />
                  <span>You Won! Claim Prize</span>
                </button>
              )}

              {/* Entries badge */}
              <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
                <Ticket className="size-3.5 text-violet-400" />
                <span>{enteredCount} {enteredCount === 1 ? 'Entry' : 'Entries'}</span>
              </div>

              {/* User profile */}
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1.5 pr-3 text-xs font-medium text-slate-200">
                <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold uppercase shadow-sm">
                  {user.username.charAt(0)}
                </div>
                <span className="font-semibold text-white max-w-[120px] truncate">{user.username}</span>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={logout}
                title="Log out"
                className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-300 transition hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-violet-900/30 transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
