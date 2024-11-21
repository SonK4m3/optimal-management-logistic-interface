import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ROUTES_PATH } from '@/constant/routes'
import StaffManagementPage from './views/admin/staff/StaffManagementPage'
import CustomerManagementPage from './views/admin/customer/CustomerManagementPage'
import TaskManagementPage from './views/admin/task/TaskManagementPage'
import ShiftManagementPage from './views/admin/shift/ShiftManagementPage'

const AppLayout = lazy(() => import('@/components/layout/AppLayout.tsx'))
const NotMatch = lazy(() => import('@/views/404/NotMatch.tsx'))
const LoginPage = lazy(() => import('@/views/login/LoginPage.tsx'))
const HomePage = lazy(() => import('@/views/home/HomePage.tsx'))
const ListOrderPage = lazy(() => import('@/views/order/ListOrderPage.tsx'))
const CreateOrderPage = lazy(() => import('@/views/order/CreateOrderPage.tsx'))
const VRPPage = lazy(() => import('@/views/vrp/VRPPage.tsx'))
const AdminPage = lazy(() => import('@/views/admin/AdminPage.tsx'))
const DriverPage = lazy(() => import('@/views/driver/DriverPage.tsx'))

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
                    },
                    {
                        path: ROUTES_PATH.ADMIN,
                        element: <AdminPage />
                    },
                    {
                        path: ROUTES_PATH.DRIVER,
                        element: <DriverPage />
                    },
                    {
                        path: ROUTES_PATH.STAFF,
                        element: <StaffManagementPage />
                    },
                    {
                        path: ROUTES_PATH.CUSTOMER,
                        element: <CustomerManagementPage />
                    },
                    {
                        path: ROUTES_PATH.TASK,
                        element: <TaskManagementPage />
                    },
                    {
                        path: ROUTES_PATH.SHIFT,
                        element: <ShiftManagementPage />
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
