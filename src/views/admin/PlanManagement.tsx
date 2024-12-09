import { Button } from '@/components/ui/button'
import RequestFactory from '@/services/RequestFactory'
import { useAdminContext } from '@/contexts/AdminContext'
import FormSelect from '@/components/FormSelect'
import { toast } from '@/components/ui/use-toast'

const PlanManagement = () => {
    const requestOrder = RequestFactory.getRequest('OrderRequest')

    const {
        drivers,
        orders,
        inTransit,
        fetchInTransit,
        selectedDriver,
        setSelectedDriver,
        fetchOrders
    } = useAdminContext()

    const handleSelectDriver = (fullName: string) => {
        const selectedDriver = drivers.find(driver => driver.fullName === fullName)
        setSelectedDriver(selectedDriver || null)
        fetchInTransit(selectedDriver?.id || 1)
    }

    const handleCreatePlan = async () => {
        if (!selectedDriver) return

        const orderIds = inTransit.map(delivery => delivery.order.id)

        const order = orders.find(
            order => order.status === 'PENDING' && !orderIds.includes(order.id)
        )

        if (!order) return

        try {
            const response = await requestOrder.acceptOrderForDelivery({
                orderId: order.id,
                driverId: selectedDriver.id
            })
            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Plan created successfully',
                    variant: 'success'
                })
                fetchInTransit(selectedDriver.id)
                fetchOrders()
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Error creating plan',
                variant: 'destructive'
            })
        }
    }

    const handleRejectOrder = async (deliveryId: number) => {
        if (!selectedDriver) return

        try {
            const response = await requestOrder.rejectDelivery({
                deliveryId,
                driverId: selectedDriver.id
            })
            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Order rejected successfully',
                    variant: 'success'
                })
                fetchInTransit(selectedDriver.id)
                fetchOrders()
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Error rejecting order',
                variant: 'destructive'
            })
        }
    }

    const handleAcceptOrder = async (deliveryId: number) => {
        if (!selectedDriver) return

        try {
            const response = await requestOrder.completeDelivery({
                deliveryId,
                driverId: selectedDriver.id
            })
            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Order completed successfully',
                    variant: 'success'
                })
                fetchInTransit(selectedDriver.id)
                fetchOrders()
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Error completing order',
                variant: 'destructive'
            })
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <h1 className='text-2xl font-bold'>Plan Management</h1>
            <div>
                <Button variant='default' onClick={handleCreatePlan}>
                    Create Plan
                </Button>
            </div>
            <div className='flex gap-2 items-center'>
                <label className='text-sm font-normal leading-3 text-color-neutral-900'>
                    Select one driver
                </label>
                <FormSelect
                    options={drivers.map(driver => ({
                        label: driver.fullName,
                        value: driver.fullName
                    }))}
                    selected={selectedDriver?.fullName}
                    onSelect={handleSelectDriver}
                />
            </div>
            <div className='flex flex-col gap-2'>
                <h2 className='text-sm font-normal leading-3 text-color-neutral-900'>Deliveries</h2>
                <div className='flex flex-col gap-2'>
                    {inTransit.map(delivery => (
                        <div key={delivery.id} className='bg-color-neutral-100 p-2 rounded-md'>
                            <div className='flex justify-between items-center'>
                                <div>
                                    {delivery.id} - {delivery.status} - {delivery.order.status}
                                </div>
                                {delivery.order.status !== 'DELIVERED' && (
                                    <div className='flex gap-2'>
                                        <Button
                                            variant='accentGhost'
                                            onClick={() => handleRejectOrder(delivery.id)}
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            variant='successSolid'
                                            onClick={() => handleAcceptOrder(delivery.id)}
                                        >
                                            Accept
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PlanManagement
