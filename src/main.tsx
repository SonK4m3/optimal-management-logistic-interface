import ReactDOM from 'react-dom/client'
import ErrorBoundary from '@/components/layout/ErrorBoundary'
import App from '@/App'
import '@radix-ui/themes/styles.css'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
)
