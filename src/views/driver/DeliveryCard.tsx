import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import RequestFactory from '@/services/RequestFactory'
import { Driver } from '@/types/driver'

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

    if (!driver) return <div>No driver found</div>

    return (
        <div className='flex flex-col gap-4'>
            <div>
                {currentMarker && (
                    <div className='flex flex-col gap-2'>
                        <p className='text-sm text-muted-foreground'>
                            Latitude: {currentMarker.lat}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                            Longitude: {currentMarker.lng}
                        </p>
                    </div>
                )}
            </div>
            <div className='flex justify-end'>
                <Button
                    variant='emerald'
                    onClick={handleUpdateCurrentPosition}
                    disabled={!currentMarker}
                >
                    Update current position
                </Button>
            </div>
        </div>
    )
}

export default DeliveryCard
