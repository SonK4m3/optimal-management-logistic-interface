import { Driver } from '@/types/driver'
import ColLabelValue from '@/components/ColLabelValue'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { DRIVER_STATUS } from '@/constant/enum'

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

    return (
        <div className='flex flex-col gap-4 p-4 border rounded-lg'>
            <div className='grid grid-cols-3 gap-4'>
                <ColLabelValue label='Full Name' value={driver.fullName} />
                <ColLabelValue label='Phone' value={driver.phone} />
                <ColLabelValue
                    label='Status'
                    value={
                        <div
                            className={`capitalize  ${
                                driver.status === DRIVER_STATUS.READY_TO_ACCEPT_ORDERS
                                    ? 'text-emerald-500'
                                    : driver.status === DRIVER_STATUS.DELIVERING
                                      ? 'text-blue-500'
                                      : 'text-red-500'
                            }`}
                        >
                            <div className='flex items-center gap-2'>
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        driver.status === DRIVER_STATUS.READY_TO_ACCEPT_ORDERS
                                            ? 'bg-emerald-500'
                                            : driver.status === DRIVER_STATUS.DELIVERING
                                              ? 'bg-blue-500'
                                              : 'bg-red-500'
                                    }`}
                                />
                                {driver.status}
                            </div>
                        </div>
                    }
                />
                {!showLess && (
                    <>
                        <ColLabelValue label='Vehicle Type' value={driver.vehicleType} />
                        <ColLabelValue label='Vehicle Plate Number' value={driver.vehiclePlate} />
                        <ColLabelValue label='License Number' value={driver.licenseNumber} />
                        <ColLabelValue label='Current Location' value={locationString} />
                    </>
                )}
            </div>
            <div className='flex justify-end'>
                <Button variant='link' onClick={() => setShowLess(!showLess)}>
                    {showLess ? 'View more' : 'View less'}
                </Button>
            </div>
        </div>
    )
}

export default DriverCard
