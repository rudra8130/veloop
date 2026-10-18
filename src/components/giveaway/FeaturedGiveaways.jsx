import GiveawayCard from '../giveaway/Card'


export default function FeaturedGiveaways({ giveaways = [], enteredIds = [], onJoin }) {
    return (
        <section aria-labelledby="featured-title">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h2 id="featured-title" className="text-2xl font-bold text-white sm:text-3xl">
                        Featured giveaways
                    </h2>
                    <p className="mt-1 text-sm text-slate-400 sm:text-base">
                        Handpicked prizes you can enter right now.
                    </p>
                </div>
                <a
                    href="#all-giveaways"
                    className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-slate-100 transition
                     hover:border-white/30 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-violet-300"
                >
                    View all giveaways
                </a>
            </div>

            {giveaways.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 px-6 py-14 text-center">
                    <p className="font-semibold text-white">No giveaways right now</p>
                    <p className="mt-1 text-sm text-slate-400">New prizes are added regularly. Check back soon.</p>
                </div>
            ) : (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {giveaways.map((g, i) => (
                        <GiveawayCard
                            key={g.id}
                            prize={g}
                            index={i}
                            entered={enteredIds.includes(g.id)}
                            onJoin={onJoin}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}