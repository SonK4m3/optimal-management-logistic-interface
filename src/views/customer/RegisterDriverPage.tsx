import BaseLayout from '@/components/layout/BaseLayout'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import RequestFactory from '@/services/RequestFactory'
import { Customer } from '@/types/resource'
import { useEffect, useState } from 'react'
import ColLabelValue from '@/components/ColLabelValue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import FormSelect from '@/components/FormSelect'
import { Driver } from '@/types/driver'
import FlexLabelValue from '@/components/FlexLabelValue'

const RegisterDriverPage = () => {
    const user = useSelector((state: RootState) => state.user.user)
    const resourceRequest = RequestFactory.getRequest('ResourceRequest')
    const driverRequest = RequestFactory.getRequest('DriverRequest')

    const [customer, setCustomer] = useState<Customer | null>(null)
    const [driver, setDriver] = useState<Driver | null>(null)
    const [licenseNumber, setLicenseNumber] = useState<string>('')
    const [vehicleType, setVehicleType] = useState<string>('MOTORCYCLE')
    const [vehiclePlateNumber, setVehiclePlateNumber] = useState<string>('')

    const fetchCustomer = async () => {
        if (!user?.id) return
        const res = await resourceRequest.getCustomerById(user?.id)
        setCustomer(res.data)
    }

    const handleCreateDriver = async () => {
        if (!user?.id) return

        const res = await driverRequest.createDriver({
            userId: user?.id || 0,
            phone: customer?.phone || '',
            licenseNumber,
            vehicleType,
            vehiclePlateNumber
        })
        if (res.success) {
            toast({
                title: 'Success',
                description: 'Driver registered successfully',
                variant: 'success'
            })
        }
    }

    const fetchDriver = async () => {
        if (!user?.id) return
        const res = await driverRequest.getDriverByUserId(user?.id.toString())
        setDriver(res.data)
    }

    useEffect(() => {
        if (user?.id) {
            fetchCustomer()
            fetchDriver()
        }
    }, [user?.id])

    return (
        <BaseLayout title='Register driver'>
            <div className='flex gap-4 border-b border-neutral-500 p-4'>
                <ColLabelValue label='Customer' value={customer?.fullName} />
                <ColLabelValue label='Email' value={customer?.email} />
                <ColLabelValue label='Phone' value={customer?.phone} />
            </div>
            {driver ? (
                <div>
                    Driver already registered
                    <div>
                        <FlexLabelValue label='License number' value={driver.licenseNumber} />
                        <FlexLabelValue label='Vehicle type' value={driver.vehicleType} />
                        <FlexLabelValue label='Vehicle plate number' value={driver.vehiclePlate} />
                    </div>
                </div>
            ) : (
                <form>
                    <ColLabelValue
                        label='License number'
                        value={
                            <Input
                                value={licenseNumber}
                                onChange={e => setLicenseNumber(e.target.value)}
                            />
                        }
                    />
                    <ColLabelValue
                        label='Vehicle type'
                        value={
                            <FormSelect
                                selected={vehicleType}
                                onSelect={value => setVehicleType(value)}
                                options={[
                                    { label: 'Car', value: 'CAR' },
                                    { label: 'Motorcycle', value: 'MOTORCYCLE' }
                                ]}
                            />
                        }
                    />
                    <ColLabelValue
                        label='Vehicle plate number'
                        value={
                            <Input
                                value={vehiclePlateNumber}
                                onChange={e => setVehiclePlateNumber(e.target.value)}
                            />
                        }
                    />
                    <div>
                        <Button type='button' variant='primary' onClick={handleCreateDriver}>
                            Register
                        </Button>
                    </div>
                </form>
            )}
        </BaseLayout>
    )
}

export default RegisterDriverPage
