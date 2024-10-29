import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeContext } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import ModalProvider from '@/contexts/ModalContext'
import { persistor, store } from '@/store'
import App from './App'
import ErrorBoundary from '@/components/ErrorBoundary'
import '@radix-ui/themes/styles.css'
import './index.css'
import { MetaMaskProvider } from '@metamask/sdk-react'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ErrorBoundary>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeContext>
                    <AuthProvider>
                        <GoogleOAuthProvider clientId={import.meta.env.VITE_NODE_GOOGLE_CLIENT_ID}>
                            <MetaMaskProvider
                                debug={false}
                                sdkOptions={{
                                    logging: {
                                        developerMode: false
                                    },
                                    checkInstallationImmediately: false,
                                    dappMetadata: {
                                        name: 'Trading Bot App',
                                        url: window.location.host
                                    }
                                }}
                            >
                                <ModalProvider>
                                    <App />
                                </ModalProvider>
                            </MetaMaskProvider>
                        </GoogleOAuthProvider>
                    </AuthProvider>
                </ThemeContext>
            </PersistGate>
        </Provider>
    </ErrorBoundary>
)
