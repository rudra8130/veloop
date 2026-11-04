import { AlertTriangle, FileText } from 'lucide-react'
import { buildTerms } from '../../data/terms'

/**
 * Terms & Conditions for one giveaway.
 * props:
 *  giveaway                  a giveaway object (see data/giveaways.js)
 *  showPlaceholderNotice     show the "some sections are placeholders" banner.
 *                            Set to false once every section is confirmed.
 */
export default function TermsAndConditions({ giveaway, showPlaceholderNotice = true }) {
    const sections = buildTerms(giveaway)
    const pending = sections.filter((s) => s.status === 'placeholder').length

    return (
        <section id="terms" aria-labelledby="terms-title" className="scroll-mt-24">
            <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
                    <FileText className="size-6" aria-hidden="true" />
                </span>
                <div>
                    <h2 id="terms-title" className="text-2xl font-bold text-white sm:text-3xl">
                        Terms &amp; Conditions
                    </h2>
                    <p className="mt-1 text-sm text-slate-400 sm:text-base">
                        These terms apply to the {giveaway.name} giveaway. Please read them before you join.
                    </p>
                </div>
            </div>

            {showPlaceholderNotice && pending > 0 && (
                <p className="mt-6 flex items-start gap-3 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3 text-sm text-amber-100">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" aria-hidden="true" />
                    <span>
                        {pending} of {sections.length} sections contain placeholder text that VELOOP still needs to confirm.
                        They are marked below.
                    </span>
                </p>
            )}

            <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
                {/* Section index (desktop) */}
                <nav aria-label="Terms sections" className="hidden lg:block">
                    <ol className="sticky top-24 space-y-1 text-sm">
                        {sections.map((s, i) => (
                            <li key={s.id}>
                                <a
                                    href={`#terms-${s.id}`}
                                    className="flex gap-2 rounded-lg px-3 py-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                                >
                                    <span className="tabular-nums text-slate-600">{i + 1}.</span>
                                    {s.title}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>

                <div className="space-y-4">
                    {sections.map((s, i) => (
                        <article
                            key={s.id}
                            id={`terms-${s.id}`}
                            aria-labelledby={`terms-h-${s.id}`}
                            className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#0d0a22] p-5 sm:p-6"
                        >
                            <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-xs font-semibold text-violet-300" aria-hidden="true">
                                    {i + 1}
                                </span>
                                <h3 id={`terms-h-${s.id}`} className="text-lg font-semibold text-white">
                                    {s.title}
                                </h3>
                                {s.status === 'placeholder' && (
                                    <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                                        Placeholder: to be confirmed
                                    </span>
                                )}
                            </header>

                            <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-300 sm:text-base sm:pl-10">
                                {s.facts && (
                                    <dl className="grid gap-3 sm:grid-cols-2">
                                        {s.facts.map(([k, v]) => (
                                            <div key={k} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                                                <dt className="text-xs uppercase tracking-wide text-slate-500">{k}</dt>
                                                <dd className="mt-1 font-semibold text-white">{v}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                )}
                                {s.body?.map((p, idx) => <p key={idx}>{p}</p>)}
                                {s.list && (
                                    <ol className="list-decimal space-y-1.5 pl-5 marker:text-slate-500">
                                        {s.list.map((item, idx) => <li key={idx}>{item}</li>)}
                                    </ol>
                                )}
                                {s.status === 'placeholder' && s.note && (
                                    <p className="text-xs italic text-amber-300/90">{s.note}</p>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}