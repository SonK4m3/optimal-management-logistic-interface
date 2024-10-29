import React, { ReactNode, useState, useEffect } from 'react'

interface Props {
    children: ReactNode
}

const ErrorBoundary: React.FC<Props> = ({ children }) => {
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        const errorHandler = (error: ErrorEvent) => {
            console.error('Uncaught error:', error)
            setHasError(true)
        }

        window.addEventListener('error', errorHandler)

        return () => {
            window.removeEventListener('error', errorHandler)
        }
    }, [])

    if (hasError) {
        return <h1>Sorry.. there was an error</h1>
    }

    return <>{children}</>
}

export default ErrorBoundary
