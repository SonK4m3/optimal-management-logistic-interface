import { useCallback, useEffect, useState } from 'react'
import { useModalContext } from '@/contexts/ModalContext'
import { Driver } from '@/types/driver'
import { ColumnDef } from '@/components/AppTable'
import { DriverFormData } from '@/schemas/driverSchema'
import RequestFactory from '@/services/RequestFactory'
import { toast } from '@/components/ui/use-toast'
import { DRIVER_STATUS } from '@/constant/enum'
import CreateDriverForm from '@/views/admin/form/CreateDriverForm'
import { AppPagination } from '@/components/AppPagination'
import AppTable from '@/components/AppTable'
import { Button } from '@/components/ui/button'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
const PAGE_SIZE = 10

const DriverManagement = () => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const driverRequest = RequestFactory.getRequest('DriverRequest')
    const { openModal, closeModal } = useModalContext()
    const [currentPage, setCurrentPage] = useState(1)
    const [drivers, setDrivers] = useState<Driver[]>([])
    const [totalDocs, setTotalDocs] = useState(0)

    const fetchDrivers = useCallback(async () => {
        if (!accessToken) return
        try {
            const response = await driverRequest.getDrivers()
            setDrivers(response.data.docs)
            setTotalDocs(response.data.totalDocs)
        } catch (error) {
            console.log(error)
        }
    }, [accessToken, driverRequest])

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
            header: 'License Number',
            accessorKey: 'licenseNumber'
        },
        {
            header: 'Vehicle Type',
            accessorKey: 'vehicleType'
        },
        {
            header: 'Vehicle Plate',
            accessorKey: 'vehiclePlate'
        },
        {
            header: 'Status',
            accessorKey: 'status',
            action(item) {
                return (
                    <div className='flex items-center gap-2'>
                        <div
                            className={`rounded-full w-2 h-2 ${
                                item.status === DRIVER_STATUS.READY_TO_ACCEPT_ORDERS
                                    ? 'bg-green-500'
                                    : 'bg-red-500'
                            }`}
                        ></div>
                        <div
                            className={`text-sm ${
                                item.status === DRIVER_STATUS.READY_TO_ACCEPT_ORDERS
                                    ? 'text-green-500'
                                    : 'text-red-500'
                            }`}
                        >
                            {item.status}
                        </div>
                    </div>
                )
            }
        }
    ]

    const handleSubmit = async (data: DriverFormData) => {
        try {
            await driverRequest.createDriverByManager({
                username: data.username,
                email: data.email,
                fullName: data.fullName,
                password: data.password,
                phone: data.phone,
                licenseNumber: data.licenseNumber,
                vehicleType: data.vehicleType,
                vehiclePlateNumber: data.vehiclePlate
            })
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
            content: (
                <CreateDriverForm
                    onSubmit={handleSubmit}
                    id='create-driver-form'
                    length={drivers.length + 1}
                />
            ),
            footer: (
                <Button variant='accentGhost' type='submit' form='create-driver-form'>
                    Add
                </Button>
            )
        })
    }

    useEffect(() => {
        fetchDrivers()
    }, [fetchDrivers])

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
                totalDocs={totalDocs}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default DriverManagement
