import { useEffect, useState } from 'react'


export default function useCountdown(target) {
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(id)
    }, [])

    const diff = Math.max(0, new Date(target).getTime() - now)
    const total = Math.floor(diff / 1000)

    return {
        d: Math.floor(total / 86400),
        h: Math.floor((total % 86400) / 3600),
        m: Math.floor((total % 3600) / 60),
        s: total % 60,
        isOver: diff === 0,
    }
}