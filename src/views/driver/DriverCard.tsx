import { Driver } from '@/types/driver'
import ColLabelValue from '@/components/ColLabelValue'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface DriverCardProps {
    driver: Driver | null
}

/**
 * DriverCard component displays detailed information about a driver
 * @param driver - Driver object containing all driver details
 * @returns JSX element displaying driver information in a card format
 */
const DriverCard = ({ driver }: DriverCardProps) => {
    const [showLess, setShowLess] = useState(true)

    if (!driver) return <div>No driver selected</div>

    // Format location string
    const locationString =
        driver.currentLatitude && driver.currentLongitude
            ? `${driver.currentLatitude}, ${driver.currentLongitude}`
            : 'Not available'

    // Format work hours
    const workHours = `${driver.workStartTime} - ${driver.workEndTime}`

    return (
        <div className='flex flex-col gap-4 p-4 border rounded-lg'>
            <div className='grid grid-cols-2 gap-4'>
                <ColLabelValue label='Driver Code' value={driver.driverCode} />
                <ColLabelValue label='Full Name' value={driver.fullName} />
                {!showLess && (
                    <>
                        <ColLabelValue label='Phone' value={driver.phone} />
                        <ColLabelValue label='Status' value={driver.status} />
                        <ColLabelValue label='Vehicle Type' value={driver.vehicleType} />
                        <ColLabelValue
                            label='Vehicle Plate Number'
                            value={driver.vehiclePlateNumber}
                        />
                        <ColLabelValue label='Work Hours' value={workHours} />
                        <ColLabelValue
                            label='Remaining Working Minutes'
                            value={driver.remainingWorkingMinutes}
                        />
                        <ColLabelValue label='Preferred Areas' value={driver.preferredAreas} />
                        <ColLabelValue
                            label='Completed Deliveries'
                            value={driver.completedDeliveries}
                        />
                        <ColLabelValue label='Average Rating' value={driver.averageRating} />
                        <ColLabelValue label='Current Location' value={locationString} />
                        <ColLabelValue
                            label='Active Status'
                            value={driver.isActive ? 'Active' : 'Inactive'}
                        />
                    </>
                )}
            </div>
            <div className='flex justify-end'>
                <Button variant='link' onClick={() => setShowLess(!showLess)}>
                    {showLess ? 'View less' : 'View more'}
                </Button>
            </div>
        </div>
    )
}

export default DriverCard
