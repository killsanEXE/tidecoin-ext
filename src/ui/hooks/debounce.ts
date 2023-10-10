import { useCallback, useEffect, useState } from "react"

export function useDebounceCall(value: () => Promise<void>, delay?: number): () => void {
    const [triggered, setTriggered] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (triggered) {
                value().then(() => setTriggered(false));
            }
        }, delay || 500)

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay])
    return useCallback(() => {
        setTriggered(true);
    }, [setTriggered])
}