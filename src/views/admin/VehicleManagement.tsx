import { useState } from 'react'
import RequestFactory from '@/services/RequestFactory'
import { ColumnDef } from '@/components/AppTable'
import { Vehicle } from '@/types/vehicle'
import { useModalContext } from '@/contexts/ModalContext'
import { useAdminContext } from '@/contexts/AdminContext'
import CreateVehicleForm from '@/views/admin/form/CreateVehicleForm'
import AppTable from '@/components/AppTable'
import { AppPagination } from '@/components/AppPagination'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { VehicleFormValues } from '@/schemas/vehicleSchema'

const PAGE_SIZE = 10

const VehicleManagement = () => {
    const request = RequestFactory.getRequest('VehicleRequest')
    const { openModal, closeModal } = useModalContext()
    const [currentPage, setCurrentPage] = useState(1)
    const { vehicles, fetchVehicles } = useAdminContext()

    const vehicleHeaders: ColumnDef<Vehicle>[] = [
        {
            header: 'Vehicle Code',
            accessorKey: 'vehicleCode'
        },
        {
            header: 'Capacity(m3)',
            accessorKey: 'capacity'
        },
        {
            header: 'Status',
            accessorKey: 'status'
        }
    ]

    const handleSubmit = async (data: VehicleFormValues) => {
        try {
            await request.createVehicle(data)
            toast({
                title: 'Vehicle created successfully',
                variant: 'success'
            })
            fetchVehicles()
            closeModal()
        } catch (error) {
            closeModal()
            console.log(error)
        }
    }

    const handleAddVehicle = () => {
        openModal({
            title: 'Add Vehicle',
            content: <CreateVehicleForm onSubmit={handleSubmit} id='create-vehicle-form' />,
            footer: (
                <Button variant='accentGhost' type='submit' form='create-vehicle-form'>
                    Add
                </Button>
            )
        })
    }

    return (
        <div>
            <div className='flex justify-between items-center'>
                <h1>VehicleManagement</h1>
                <div className='flex gap-2'>
                    <Button variant='brand' onClick={handleAddVehicle}>
                        Add Vehicle
                    </Button>
                </div>
            </div>
            <AppTable data={vehicles} headers={vehicleHeaders} />
            <AppPagination
                maxVisiblePages={PAGE_SIZE}
                totalDocs={vehicles.length}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default VehicleManagement
