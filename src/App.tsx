import { Suspense } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeContext } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import ModalProvider from '@/contexts/ModalContext'
import { persistor, store } from '@/store'
import { RouterProvider } from 'react-router-dom'
import AppSkeleton from '@/components/skeleton/AppSkeleton.tsx'
import { router } from '@/Router.tsx'
import './App.css'

const App = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ThemeContext>
                <AuthProvider>
                    <ModalProvider>
                        <Suspense fallback={<AppSkeleton />}>
                            <RouterProvider router={router} />
                        </Suspense>
                    </ModalProvider>
                </AuthProvider>
            </ThemeContext>
        </PersistGate>
    </Provider>
)

export default App
