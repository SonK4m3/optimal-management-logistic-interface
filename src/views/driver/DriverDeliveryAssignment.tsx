import { useEffect, useMemo, useState } from 'react'
import { DeliveryAssignment, Driver } from '@/types/driver'
import RequestFactory from '@/services/RequestFactory'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { DELIVERY_ASSIGNMENT_STATUS } from '@/constant/enum'
import { ReloadIcon } from '@radix-ui/react-icons'

interface DriverDeliveryAssignmentProps {
    driver: Driver
    selectedDeliveryAssignment: DeliveryAssignment | null
    onSelect: (assignment: DeliveryAssignment | null) => void
    refetchDriver: () => void
}

const DriverDeliveryAssignment = ({
    driver,
    selectedDeliveryAssignment,
    onSelect,
    refetchDriver
}: DriverDeliveryAssignmentProps) => {
    const driverRequest = RequestFactory.getRequest('DriverRequest')
    const [deliveryAssignments, setDeliveryAssignments] = useState<DeliveryAssignment[]>([])

    const filterDeliveryAssignments = useMemo(() => {
        const deliveringDeliveryAssignment = deliveryAssignments.find(
            assignment =>
                assignment.status === DELIVERY_ASSIGNMENT_STATUS.IN_PROGRESS ||
                assignment.status === DELIVERY_ASSIGNMENT_STATUS.DRIVER_ACCEPTED
        )

        if (!deliveringDeliveryAssignment) {
            return deliveryAssignments
        }

        const otherDeliveryAssignments = deliveryAssignments.filter(
            assignment => assignment.id !== deliveringDeliveryAssignment.id
        )

        return [deliveringDeliveryAssignment, ...otherDeliveryAssignments]
    }, [deliveryAssignments])

    const handleAcceptDelivery = async (assignment: DeliveryAssignment) => {
        const res = await driverRequest.updateAcceptedDeliveryAssignment({
            deliveryId: assignment.deliveryId,
            driverId: driver.id.toString()
        })
        if (res.success) {
            toast({
                title: 'Success',
                description: 'Delivery accepted successfully',
                variant: 'success'
            })
            fetchDeliveryAssignments()
            refetchDriver()
        }
    }

    const handleRejectDelivery = async (assignment: DeliveryAssignment) => {
        const res = await driverRequest.updateDeliveryAssignmentRejectionReason({
            deliveryId: assignment.deliveryId,
            driverId: driver.id.toString(),
            reason: 'Rejected'
        })
        if (res.success) {
            toast({
                title: 'Success',
                description: 'Delivery rejected successfully',
                variant: 'success'
            })
            fetchDeliveryAssignments()
        }
    }

    const handleStartDelivery = async (assignment: DeliveryAssignment) => {
        try {
            const res = await driverRequest.startDriverAssignment(assignment.id.toString())
            if (res.success) {
                toast({
                    title: 'Success',
                    description: 'Delivery started successfully',
                    variant: 'success'
                })
                fetchDeliveryAssignments()
                refetchDriver()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleEndDelivery = async (assignment: DeliveryAssignment) => {
        try {
            const res = await driverRequest.endDriverAssignment(assignment.id.toString())
            if (res.success) {
                toast({
                    title: 'Success',
                    description: 'Delivery ended successfully',
                    variant: 'success'
                })
                fetchDeliveryAssignments()
                refetchDriver()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleRefresh = async () => {
        await driverRequest.refreshDeliveryAssignments({
            driverId: driver.id.toString()
        })
        fetchDeliveryAssignments()
    }

    const fetchDeliveryAssignments = async () => {
        const res = await driverRequest.getDeliveryAssignmentsByDriverId(driver.id.toString())
        if (res.success) {
            setDeliveryAssignments(res.data)
        }
    }

    useEffect(() => {
        fetchDeliveryAssignments()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [driver])

    return (
        <div className='min-w-[400px] border border-gray-200 rounded-md p-4'>
            <div className='flex justify-between items-center mb-3'>
                <h3 className='text-lg font-bold'>Delivery Assignments</h3>
                <Button variant='primary' size='icon' onClick={handleRefresh}>
                    <ReloadIcon />
                </Button>
            </div>
            <div className='flex flex-col gap-4 max-h-[560px] overflow-y-auto'>
                {filterDeliveryAssignments.map(assignment => (
                    <div
                        key={assignment.id}
                        className={`border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                            selectedDeliveryAssignment?.id === assignment.id
                                ? 'border-blue-500 bg-gray-900'
                                : 'bg-gray-950'
                        } hover:bg-gray-800`}
                        onClick={() => onSelect(assignment)}
                    >
                        <div className='flex flex-wrap justify-between items-center gap-2 mb-2'>
                            <div className='font-medium'>Delivery #{assignment.deliveryId}</div>
                            <div
                                className={`px-2 py-1 rounded-full text-sm ${
                                    assignment.status === DELIVERY_ASSIGNMENT_STATUS.DRIVER_ACCEPTED
                                        ? 'bg-green-200 text-green-900'
                                        : assignment.status ===
                                            DELIVERY_ASSIGNMENT_STATUS.WAITING_FOR_DRIVER_ACCEPTANCE
                                          ? 'bg-blue-200 text-blue-900'
                                          : assignment.status ===
                                              DELIVERY_ASSIGNMENT_STATUS.DRIVER_REJECTED
                                            ? 'bg-red-200 text-red-900'
                                            : assignment.status ===
                                                DELIVERY_ASSIGNMENT_STATUS.IN_PROGRESS
                                              ? 'bg-blue-200 text-blue-900'
                                              : assignment.status ===
                                                  DELIVERY_ASSIGNMENT_STATUS.DELIVERED
                                                ? 'bg-green-200 text-green-900'
                                                : 'bg-gray-200 text-gray-900'
                                }`}
                            >
                                {assignment.status}
                            </div>
                        </div>
                        <div className='grid grid-cols-2 gap-4 text-sm text-neutral-400'>
                            <div className='col-span-2'>
                                <p>Warehouses: {assignment.warehouseIds.length}</p>
                                {assignment.rejectionReason && (
                                    <p className='text-red-700'>
                                        Reason: {assignment.rejectionReason}
                                    </p>
                                )}
                            </div>
                            <div className='col-span-2 flex flex-col gap-2'>
                                <p>Assigned: {new Date(assignment.assignedAt).toLocaleString()}</p>
                                <p>Expires: {new Date(assignment.expiresAt).toLocaleString()}</p>
                            </div>
                        </div>
                        {assignment.status === DELIVERY_ASSIGNMENT_STATUS.DRIVER_ACCEPTED && (
                            <div className='flex justify-end gap-2'>
                                <Button
                                    variant='primary'
                                    size='sm'
                                    onClick={() => handleStartDelivery(assignment)}
                                >
                                    Start
                                </Button>
                            </div>
                        )}
                        {assignment.status === DELIVERY_ASSIGNMENT_STATUS.IN_PROGRESS && (
                            <div className='flex justify-end gap-2'>
                                <Button
                                    variant='accentGhost'
                                    size='sm'
                                    onClick={() => handleEndDelivery(assignment)}
                                >
                                    End
                                </Button>
                            </div>
                        )}
                        {assignment.status ===
                            DELIVERY_ASSIGNMENT_STATUS.WAITING_FOR_DRIVER_ACCEPTANCE && (
                            <div className='flex justify-end gap-2'>
                                {assignment.status ===
                                    DELIVERY_ASSIGNMENT_STATUS.WAITING_FOR_DRIVER_ACCEPTANCE && (
                                    <>
                                        <Button
                                            variant='successGhost'
                                            size='sm'
                                            onClick={() => handleAcceptDelivery(assignment)}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            variant='accentGhost'
                                            size='sm'
                                            onClick={() => handleRejectDelivery(assignment)}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DriverDeliveryAssignment
