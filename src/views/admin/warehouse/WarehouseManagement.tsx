import { useState } from 'react'
import CreateWarehouseForm from '@/views/admin/form/CreateWarehouseForm'
import { Warehouse } from '@/types/warehouse'
import { WarehouseFormData } from '@/schemas/warehouse.schema'
import { useModalContext } from '@/contexts/ModalContext'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import AppTable, { ColumnDef } from '@/components/AppTable'
import { AppPagination } from '@/components/AppPagination'
import RequestFactory from '@/services/RequestFactory'
import { useWarehouseContext } from '@/contexts/WarehouseContext'
import { Link } from 'react-router-dom'
import WarehouseMapModal from './WarehouseMapModal'

const PAGE_SIZE = 10

const WarehouseManagement = () => {
    const request = RequestFactory.getRequest('WarehouseRequest')
    const { openModal, closeModal } = useModalContext()
    const [currentPage, setCurrentPage] = useState(1)
    const { warehouses, totalDocs, fetchWarehouses } = useWarehouseContext()

    const warehouseHeaders: ColumnDef<Warehouse>[] = [
        {
            header: 'Name',
            accessorKey: 'name'
        },
        {
            header: 'Status',
            accessorKey: 'status'
        },
        {
            header: 'Action',
            accessorKey: 'action',
            action: (warehouse: Warehouse) => (
                <div className='flex gap-2'>
                    <Button
                        variant='default'
                        type='button'
                        onClick={() =>
                            openModal({
                                title: 'Warehouse Map',
                                content: <WarehouseMapModal warehouse={warehouse} />
                            })
                        }
                    >
                        See in Map
                    </Button>
                    <Link to={`storage-location/${warehouse.id}`}>
                        <Button variant='primary' type='button'>
                            Storage Location
                        </Button>
                    </Link>
                </div>
            )
        }
    ]

    const handleSubmit = async (data: WarehouseFormData) => {
        try {
            await request.createWarehouse({
                name: data.name,
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
                totalCapacity: data.totalCapacity,
                totalArea: data.totalArea,
                type: data.type,
                managerId: data.managerId
            })
            toast({
                title: 'Warehouse created successfully',
                variant: 'success'
            })
            fetchWarehouses()
            closeModal()
        } catch (error) {
            closeModal()
            toast({
                title: 'Failed to create warehouse',
                variant: 'destructive'
            })
            console.log(error)
        }
    }

    const handleAddWarehouse = () => {
        openModal({
            title: 'Create Warehouse',
            content: (
                <CreateWarehouseForm
                    onSubmit={handleSubmit}
                    id='create-warehouse-form'
                    length={warehouses.length}
                />
            )
        })
    }

    return (
        <div>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>Warehouse Management</h1>
                <div className='flex gap-2'>
                    <Button variant='brand' type='button' onClick={handleAddWarehouse}>
                        Add Warehouse
                    </Button>
                </div>
            </div>
            <AppTable data={warehouses} headers={warehouseHeaders} />
            <AppPagination
                maxVisiblePages={PAGE_SIZE}
                totalDocs={totalDocs}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default WarehouseManagement
