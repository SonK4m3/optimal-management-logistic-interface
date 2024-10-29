import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ROUTES_PATH } from '@/constant/routes'

const AppLayout = lazy(() => import('@/components/layout/AppLayout.tsx'))
const NotMatch = lazy(() => import('@/views/404/NotMatch.tsx'))
const LoginPage = lazy(() => import('@/views/login/LoginPage.tsx'))
const HomePage = lazy(() => import('@/views/home/HomePage.tsx'))
const ListOrderPage = lazy(() => import('@/views/order/ListOrderPage.tsx'))
const CreateOrderPage = lazy(() => import('@/views/order/CreateOrderPage.tsx'))
const VRPPage = lazy(() => import('@/views/vrp/VRPPage.tsx'))

export const router = createBrowserRouter([
    {
        path: '',
        element: <AppLayout />,
        children: [
            {
                path: '',
                children: [
                    {
                        path: ROUTES_PATH.HOME,
                        element: <HomePage />
                    },
                    {
                        path: ROUTES_PATH.ORDERS,
                        element: <ListOrderPage />
                    },
                    {
                        path: ROUTES_PATH.CREATE_ORDER,
                        element: <CreateOrderPage />
                    },
                    {
                        path: ROUTES_PATH.VRP,
                        element: <VRPPage />
                    }
                ]
            }
        ]
    },
    {
        path: ROUTES_PATH.LOGIN,
        element: <LoginPage />
    },
    {
        path: '*',
        element: <NotMatch />
    }
])
