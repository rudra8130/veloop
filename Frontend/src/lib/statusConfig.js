export const statusConfig = {
    upcoming: { label: 'Upcoming', dot: 'bg-brand', text: 'text-brand', cta: 'Notify Me', canJoin: false },
    live: { label: 'Live', dot: 'bg-success', text: 'text-success', cta: 'Join Now', canJoin: true, pulse: true },
    ending_soon: { label: 'Ending Soon', dot: 'bg-warn', text: 'text-warn', cta: 'Join Before It Ends', canJoin: true },
    closed: { label: 'Closed', dot: 'bg-muted', text: 'text-muted', cta: 'Draw in Progress', canJoin: false },
    winners_announced: { label: 'Winners Announced', dot: 'bg-reward', text: 'text-reward', cta: 'View Winners', canJoin: false },
}