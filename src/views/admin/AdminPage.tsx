import { AppPagination } from '@/components/AppPagination'
import AppTable, { ColumnDef } from '@/components/AppTable'
import BaseLayout from '@/components/layout/BaseLayout'
import { Button } from '@/components/ui/button'
import ModalContext, { useModalContext } from '@/contexts/ModalContext'
import { Driver } from '@/types/driver'
import { Warehouse, WarehouseFormValues } from '@/types/warehouse'
import { useState } from 'react'
import CreateWarehouseForm from './form/CreateWarehouseForm'
import RequestFactory from '@/services/RequestFactory'
import { toast } from '@/components/ui/use-toast'
import CreateDriverForm from './form/CreateDriverForm'
import { DriverFormData } from '@/schemas/driverSchema'
import AdminMap from './AdminMap'
import AdminProvider, { useAdminContext } from '@/contexts/AdminContext'
import PlanManagement from './PlanManagement'
import VehicleManagement from './VehicleManagement'

const PAGE_SIZE = 10

const AdminPage: React.FC = () => {
    return (
        <ModalContext>
            <AdminProvider>
                <BaseLayout title='Admin' titleTab='OML | Admin'>
                    <div className='w-full flex flex-col gap-4'>
                        <WarehouseManagement />
                        <DriverManagement />
                        <VehicleManagement />
                    </div>
                    <div className='w-full flex gap-4'>
                        <div className='w-[50%]'>
                            <PlanManagement />
                        </div>
                        <div className='w-[50%]'>
                            <AdminMap />
                        </div>
                    </div>
                </BaseLayout>
            </AdminProvider>
        </ModalContext>
    )
}

const WarehouseManagement = () => {
    const request = RequestFactory.getRequest('WarehouseRequest')
    const { openModal, closeModal } = useModalContext()
    const [currentPage, setCurrentPage] = useState(1)
    const { warehouses, fetchWarehouses } = useAdminContext()

    const warehouseHeaders: ColumnDef<Warehouse>[] = [
        {
            header: 'Code',
            accessorKey: 'code'
        },
        {
            header: 'Name',
            accessorKey: 'name'
        },
        {
            header: 'Address',
            accessorKey: 'address'
        },
        {
            header: 'Status',
            accessorKey: 'status'
        }
    ]

    const handleSubmit = async (data: WarehouseFormValues) => {
        try {
            await request.createWarehouse(data)
            toast({
                title: 'Warehouse created successfully',
                variant: 'success'
            })
            fetchWarehouses()
            closeModal()
        } catch (error) {
            closeModal()
            console.log(error)
        }
    }

    const handleAddWarehouse = () => {
        openModal({
            title: 'Add Warehouse',
            content: <CreateWarehouseForm onSubmit={handleSubmit} id='create-warehouse-form' />,
            footer: (
                <Button variant='accentGhost' type='submit' form='create-warehouse-form'>
                    Add
                </Button>
            )
        })
    }

    return (
        <div>
            <div className='flex justify-between items-center'>
                <h1>WarehouseManagement</h1>
                <div className='flex gap-2'>
                    <Button variant='brand' onClick={handleAddWarehouse}>
                        Add Warehouse
                    </Button>
                </div>
            </div>
            <AppTable data={warehouses} headers={warehouseHeaders} />
            <AppPagination
                maxVisiblePages={PAGE_SIZE}
                totalDocs={warehouses.length}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

const DriverManagement = () => {
    const { openModal, closeModal } = useModalContext()
    const [currentPage, setCurrentPage] = useState(1)
    const { drivers, fetchDrivers } = useAdminContext()

    const driverHeaders: ColumnDef<Driver>[] = [
        {
            header: 'Full Name',
            accessorKey: 'fullName'
        },
        {
            header: 'Phone',
            accessorKey: 'phone'
        },
        {
            header: 'Status',
            accessorKey: 'status'
        }
    ]

    const request = RequestFactory.getRequest('DriverRequest')

    const handleSubmit = async (data: DriverFormData) => {
        try {
            await request.createDriver(data)
            toast({
                title: 'Driver created successfully',
                variant: 'success'
            })
            fetchDrivers()
            closeModal()
        } catch (error) {
            closeModal()
            console.log(error)
        }
    }

    const handleAddDriver = () => {
        openModal({
            title: 'Add Driver',
            content: <CreateDriverForm onSubmit={handleSubmit} id='create-driver-form' />,
            footer: (
                <Button variant='accentGhost' type='submit' form='create-driver-form'>
                    Add
                </Button>
            )
        })
    }

    return (
        <div>
            <div className='flex justify-between items-center'>
                <h1>DriverManagement</h1>
                <div className='flex gap-2'>
                    <Button variant='brand' onClick={handleAddDriver}>
                        Add Driver
                    </Button>
                </div>
            </div>
            <AppTable data={drivers} headers={driverHeaders} />
            <AppPagination
                maxVisiblePages={PAGE_SIZE}
                totalDocs={drivers.length}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default AdminPage
