import { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
    errorInfo: ErrorInfo | null
}

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in child component tree
 * Logs error information and displays fallback UI
 */
class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        }
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null
        }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log error to error reporting service
        console.error('Error caught by boundary:', error, errorInfo)
        this.setState({
            error,
            errorInfo
        })
    }

    handleReset = (): void => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        })
    }

    render() {
        const { hasError, error } = this.state
        const { children, fallback } = this.props

        if (hasError) {
            return (
                fallback || (
                    <div className='flex flex-col items-center justify-center min-h-screen p-4 bg-background'>
                        <h1 className='text-2xl font-bold text-destructive mb-4'>
                            Something went wrong
                        </h1>
                        <p className='text-muted-foreground mb-4'>
                            {error?.message || 'An unexpected error occurred'}
                        </p>
                        <Button variant='outline' onClick={this.handleReset}>
                            Try Again
                        </Button>
                    </div>
                )
            )
        }

        return children
    }
}

export default ErrorBoundary
