import { useEffect, useState } from 'react'
import { Shipment } from '@/types/shipment'
import { Button } from '@/components/ui/button'
import AppTable, { ColumnDef } from '@/components/AppTable'
import { AppPagination } from '@/components/AppPagination'
import { useWarehouseContext } from '@/contexts/WarehouseContext'
import { cn } from '@/lib/utils'
import { useModalContext } from '@/contexts/ModalContext'
import ReceipDetailModal from './ReceipDetailModal'

const PAGE_SIZE = 10

const ShipmentManagement = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const { shipments, shipmentTotalDocs, fetchShipments, confirmShipment, cancelShipment } =
        useWarehouseContext()

    const { openModal } = useModalContext()

    const shipmentHeaders: ColumnDef<Shipment>[] = [
        {
            header: 'Shipment Code',
            accessorKey: 'code'
        },
        {
            header: 'Warehouse',
            accessorKey: 'warehouse.name'
        },
        {
            header: 'Status',
            accessorKey: 'status',
            action: item => {
                return (
                    <div className='flex items-center justify-center'>
                        <div
                            className={cn(
                                'w-[100px] text-xs uppercase rounded-lg px-2 py-1 text-center',
                                item.status === 'CONFIRMED'
                                    ? 'bg-green-900 text-white'
                                    : item.status === 'CANCELLED'
                                      ? 'bg-red-500 text-white'
                                      : 'bg-yellow-500/80 text-white'
                            )}
                        >
                            {item.status}
                        </div>
                    </div>
                )
            }
        },
        {
            header: 'Created By',
            accessorKey: 'createdBy.fullName'
        },
        {
            header: 'Created At',
            accessorKey: 'createdAt'
        },
        {
            header: 'Action',
            accessorKey: 'action',
            action: item => (
                <div className='flex gap-2'>
                    {item.status === 'PENDING' ? (
                        <>
                            <Button
                                variant='successSolid'
                                onClick={() => handleConfirmShipment(item.id)}
                            >
                                Confirm
                            </Button>
                            <Button
                                variant='destructive'
                                onClick={() => handleCancelShipment(item.id)}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : item.status === 'CONFIRMED' ? (
                        <div className='w-[200px] text-xs uppercase rounded-lg px-2 py-1 text-center bg-green-100 text-green-800'>
                            {item.confirmedBy.username || 'N/A'} <br /> {item.confirmedAt}
                        </div>
                    ) : null}
                    <Button variant='ghost' onClick={() => handleOpenDetailModal(item)}>
                        Detail
                    </Button>
                </div>
            )
        }
    ]

    const handleConfirmShipment = (id: number) => {
        confirmShipment(id)
    }

    const handleCancelShipment = (id: number) => {
        cancelShipment(id)
    }

    const handleOpenDetailModal = (shipment: Shipment) => {
        openModal({
            title: `Shipment ${shipment.code}`,
            content: <ReceipDetailModal receipt={shipment} />
        })
    }

    useEffect(() => {
        if (currentPage > 0) {
            fetchShipments({
                page: currentPage,
                size: PAGE_SIZE
            })
        }
    }, [currentPage, fetchShipments])

    return (
        <div>
            <h1 className='text-2xl font-bold'>Shipment Management</h1>
            <AppTable data={shipments} headers={shipmentHeaders} />
            <AppPagination
                maxVisiblePages={PAGE_SIZE}
                totalDocs={shipmentTotalDocs}
                currentPage={currentPage}
                onPageChange={page => setCurrentPage(page)}
            />
        </div>
    )
}

export default ShipmentManagement
