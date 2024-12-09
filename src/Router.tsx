import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '@/constant/routes'
import StaffManagementPage from './views/admin/staff/StaffManagementPage'
import CustomerManagementPage from './views/admin/customer/CustomerManagementPage'
import TaskManagementPage from './views/admin/task/TaskManagementPage'
import ShiftManagementPage from './views/admin/shift/ShiftManagementPage'
import ProductManagementPage from './views/admin/product/ProductManagementPage'
import InventoryManagementPage from './views/admin/inventory/InventoryManagementPage'
import StorageLocationPage from './views/admin/warehouse/StorageLocationPage'
import DeliveryManagementPage from './views/admin/delivery/DeliveryManagementPage'
import DeliveryOrderPage from './views/admin/delivery/DeliveryOrderPage'

const AppLayout = lazy(() => import('@/components/layout/AppLayout.tsx'))
const NotMatch = lazy(() => import('@/views/404/NotMatch.tsx'))
const LoginPage = lazy(() => import('@/views/login/LoginPage.tsx'))
const HomePage = lazy(() => import('@/views/home/HomePage.tsx'))
const ListOrderPage = lazy(() => import('@/views/order/ListOrderPage'))
const CreateOrderPage = lazy(() => import('@/views/order/CreateOrderPage.tsx'))
const VRPPage = lazy(() => import('@/views/vrp/VRPPage.tsx'))
const AdminPage = lazy(() => import('@/views/admin/AdminPage.tsx'))
const DriverPage = lazy(() => import('@/views/driver/DriverPage.tsx'))
const WarehouseManagementPage = lazy(
    () => import('@/views/admin/warehouse/WarehouseManagementPage.tsx')
)
const DriverManagementPage = lazy(() => import('@/views/admin/driver/DriverManagementPage.tsx'))
const RegisterDriverPage = lazy(() => import('@/views/customer/RegisterDriverPage.tsx'))
export const router = createBrowserRouter([
    {
        path: '',
        element: <AppLayout />,
        children: [
            {
                path: '',
                children: [
                    {
                        path: ROUTES.CUSTOMER.HOME,
                        element: <HomePage />
                    },
                    {
                        path: ROUTES.CUSTOMER.ORDERS,
                        element: <ListOrderPage />
                    },
                    {
                        path: ROUTES.CUSTOMER.CREATE_ORDER,
                        element: <CreateOrderPage />
                    },
                    {
                        path: ROUTES.CUSTOMER.VRP,
                        element: <VRPPage />
                    },
                    {
                        path: ROUTES.ADMIN.DASHBOARD,
                        element: <AdminPage />
                    },
                    {
                        path: ROUTES.DRIVER.DRIVER,
                        element: <DriverPage />
                    },
                    {
                        path: ROUTES.ADMIN.STAFF,
                        element: <StaffManagementPage />
                    },
                    {
                        path: ROUTES.ADMIN.CUSTOMER,
                        element: <CustomerManagementPage />
                    },
                    {
                        path: ROUTES.ADMIN.TASK,
                        element: <TaskManagementPage />
                    },
                    {
                        path: ROUTES.ADMIN.SHIFT,
                        element: <ShiftManagementPage />
                    },
                    {
                        path: ROUTES.ADMIN.WAREHOUSE,
                        element: <WarehouseManagementPage />
                    },
                    {
                        path: ROUTES.ADMIN.PRODUCT,
                        element: <ProductManagementPage />
                    },
                    {
                        path: ROUTES.ADMIN.INVENTORY,
                        element: <InventoryManagementPage />
                    },
                    {
                        path: ROUTES.ADMIN.DELIVERY,
                        element: <DeliveryManagementPage />
                    },
                    {
                        path: ROUTES.ADMIN.STORAGE_LOCATION,
                        element: <StorageLocationPage />
                    },
                    {
                        path: ROUTES.ADMIN.DELIVERY_ORDER,
                        element: <DeliveryOrderPage />
                    },
                    {
                        path: ROUTES.ADMIN.DRIVER,
                        element: <DriverManagementPage />
                    },
                    {
                        path: ROUTES.CUSTOMER.REGISTER_DRIVER,
                        element: <RegisterDriverPage />
                    }
                ]
            }
        ]
    },
    {
        path: ROUTES.LOGIN,
        element: <LoginPage />
    },
    {
        path: '*',
        element: <NotMatch />
    }
])
