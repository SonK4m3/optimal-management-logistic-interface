import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy } from 'react'
import AuthorizeRoute from './components/layout/AuthorizeRoute'

const AppLayout = lazy(() => import('@/components/layout/AppLayout.tsx'))
const NotMatch = lazy(() => import('@/views/404/NotMatch.tsx'))
// Bot
const ViewBotsPage = lazy(() => import('@/views/bot/ViewBotsPage.tsx'))
const CreateBotPage = lazy(() => import('@/views/bot/CreateBotPage.tsx'))
const DetailBotPage = lazy(() => import('@/views/bot/DetailBotPage.tsx'))
// Wallet
const GenerateWalletPage = lazy(() => import('@/views/wallet/GenerateWalletPage.tsx'))
const TechnicalAnalysisPage = lazy(() => import('@/views/technical-analysis/TechnicalAnalysisPage'))

const LoginPage = lazy(() => import('@/views/login/LoginPage.tsx'))

export const router = createBrowserRouter([
    {
        path: '',
        element: <AppLayout />,
        children: [
            {
                path: '',
                element: <Navigate to={`/bots`} />
            },
            {
                path: 'bots',
                element: <AuthorizeRoute />,
                children: [
                    {
                        path: '',
                        element: <ViewBotsPage />
                    },
                    {
                        path: 'create',
                        element: <CreateBotPage />
                    },
                    {
                        path: ':botId',
                        element: <DetailBotPage />
                    }
                ]
            },
            {
                path: 'wallet',
                element: <AuthorizeRoute />,
                children: [
                    {
                        path: 'generate',
                        element: <GenerateWalletPage />
                    }
                ]
            },
            {
                path: 'technical-analysis',
                element: <AuthorizeRoute />,
                children: [
                    {
                        path: '',
                        element: <TechnicalAnalysisPage />
                    }
                ]
            }
        ]
    },
    {
        path: 'login',
        element: <LoginPage />
    },
    {
        path: '*',
        element: <NotMatch />
    }
])
