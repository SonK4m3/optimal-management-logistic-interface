import FormSelect from '@/components/FormSelect'
import { Button } from '@/components/ui/button'
import { DRIVER_STATUS } from '@/constant/enum'
import { toast } from '@/components/ui/use-toast'
import RequestFactory from '@/services/RequestFactory'
import { Driver, DriverStatus } from '@/types/driver'
import FlexLabelValue from '@/components/FlexLabelValue'

interface DeliveryCardProps {
    driver: Driver | null
    onUpdate: (driver: Driver) => void
    currentMarker: { lat: number; lng: number } | null
}

const DeliveryCard = ({ driver, onUpdate, currentMarker }: DeliveryCardProps) => {
    const requestDriver = RequestFactory.getRequest('DriverRequest')

    const handleUpdateCurrentPosition = async () => {
        if (!driver) return

        if (!currentMarker?.lat || !currentMarker?.lng) return

        try {
            const response = await requestDriver.updateDriverLocation(driver.id, {
                latitude: currentMarker?.lat,
                longitude: currentMarker?.lng
            })
            onUpdate(response.data)
            toast({
                title: 'Success',
                description: 'Current position updated',
                variant: 'success'
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update current position',
                variant: 'destructive'
            })
        }
    }

    const handleUpdateDriverStatus = async (status: DriverStatus) => {
        if (!driver) return

        try {
            const response = await requestDriver.updateDriverStatus(driver.id, status)
            onUpdate(response.data)
            toast({
                title: 'Success',
                description: 'Driver status updated',
                variant: 'success'
            })
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to update driver status',
                variant: 'destructive'
            })
        }
    }

    if (!driver) return <div>No driver found</div>

    return (
        <div className='flex gap-4'>
            <div className='flex-1 flex'>
                {currentMarker && (
                    <div className='flex gap-2'>
                        <div className='flex items-center gap-2'>
                            <span className='text-sm font-medium text-neutral-400'>Latitude:</span>
                            <span className='text-sm text-white'>
                                {currentMarker.lat.toFixed(6)}°
                            </span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='text-sm font-medium text-neutral-400'>Longitude:</span>
                            <span className='text-sm text-white'>
                                {currentMarker.lng.toFixed(6)}°
                            </span>
                        </div>
                    </div>
                )}
            </div>
            <div className='flex justify-end items-center gap-2'>
                <FlexLabelValue
                    label='Update Current Position'
                    value={
                        <Button
                            variant='emerald'
                            onClick={handleUpdateCurrentPosition}
                            disabled={!currentMarker}
                        >
                            Update
                        </Button>
                    }
                />
                {driver.status !== DRIVER_STATUS.DELIVERING ? (
                    <FlexLabelValue
                        label='Update Driver Status'
                        value={
                            <FormSelect
                                options={[
                                    DRIVER_STATUS.READY_TO_ACCEPT_ORDERS,
                                    DRIVER_STATUS.NOT_ACCEPTING_ORDERS
                                ].map(status => ({
                                    label: status,
                                    value: status
                                }))}
                                selected={driver?.status}
                                onSelect={handleUpdateDriverStatus}
                            />
                        }
                    />
                ) : (
                    <div className='text-sm text-neutral-400'>Driver is currently delivering</div>
                )}
            </div>
        </div>
    )
}

export default DeliveryCard
