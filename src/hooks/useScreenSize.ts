import { useEffect, useState } from 'react'

const breakpoints = {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
}

type Breakpoints = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const useScreenSize = () => {
    const [screenSize, setScreenSize] = useState<Breakpoints>('lg')

    const handleResize = () => {
        const width = window.innerWidth

        // Determine screen size based on breakpoints
        if (width >= breakpoints['2xl']) {
            setScreenSize('2xl')
        } else if (width >= breakpoints.xl) {
            setScreenSize('xl')
        } else if (width >= breakpoints.lg) {
            setScreenSize('lg')
        } else if (width >= breakpoints.md) {
            setScreenSize('md')
        } else if (width >= breakpoints.sm) {
            setScreenSize('sm')
        } else {
            setScreenSize('xs')
        }
    }

    const isLargerThan = (size: Breakpoints): boolean => {
        return breakpoints[screenSize] >= breakpoints[size]
    }

    useEffect(() => {
        handleResize()

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return { screenSize, isLargerThan }
}

export default useScreenSize
