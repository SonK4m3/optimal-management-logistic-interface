import React from 'react'
import { useRef } from 'react'

const useThrottle = (callback: (...args: unknown[]) => void, delay: number) => {
    const lastCall = useRef<number>(0)

    return React.useCallback(
        (...args: unknown[]) => {
            const now = Date.now()
            if (now - lastCall.current > delay) {
                callback(...args)
                lastCall.current = now
            }
        },
        [callback, delay]
    )
}

export default useThrottle
