import { driverSchema } from '@/schemas/driverSchema'
import { DriverFormData } from '@/schemas/driverSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectItem,
    SelectContent,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import TimePicker from '@/components/TimePicker'
import { FormError } from '@/components/ui/form-error'
import { Controller } from 'react-hook-form'
import { VehicleType } from '@/types/driver'
import { VEHICLE_TYPE } from '@/constant/enum'

type CreateDriverFormProps = {
    id?: string
    onSubmit: (data: DriverFormData) => void
}

const CreateDriverForm = ({ id, onSubmit }: CreateDriverFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
        setValue
    } = useForm<DriverFormData>({
        resolver: zodResolver(driverSchema),
        defaultValues: {
            fullName: 'Nguyen Van A',
            phone: '0909090909',
            email: 'nguyenvana@gmail.com',
            licenseNumber: '1234567890',
            vehicleType: VEHICLE_TYPE.MOTORCYCLE,
            vehiclePlateNumber: '1234567890',
            vehicleCapacity: 100,
            workStartTime: '08:00:00',
            workEndTime: '17:00:00',
            preferredAreas: 'Ha Noi',
            maxDeliveryRadius: 100,
            baseRate: 100000,
            ratePerKm: 10000
        }
    })

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            id={id || 'create-driver-form'}
            className='space-y-6'
        >
            {/* Basic Information */}
            <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Basic Information</h3>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label htmlFor='fullName' className='block text-sm font-medium'>
                            Full Name
                        </label>
                        <Input
                            id='fullName'
                            {...register('fullName')}
                            placeholder='Enter full name'
                        />
                        {errors.fullName && <FormError>{errors.fullName.message}</FormError>}
                    </div>
                    <div>
                        <label htmlFor='phone' className='block text-sm font-medium'>
                            Phone Number
                        </label>
                        <Input id='phone' {...register('phone')} placeholder='Enter phone number' />
                        {errors.phone && <FormError>{errors.phone.message}</FormError>}
                    </div>
                </div>

                <div>
                    <label htmlFor='email' className='block text-sm font-medium'>
                        Email
                    </label>
                    <Input id='email' {...register('email')} placeholder='Enter email address' />
                    {errors.email && <FormError>{errors.email.message}</FormError>}
                </div>

                <div>
                    <label htmlFor='licenseNumber' className='block text-sm font-medium'>
                        License Number
                    </label>
                    <Input
                        id='licenseNumber'
                        {...register('licenseNumber')}
                        placeholder='Enter license number'
                    />
                    {errors.licenseNumber && <FormError>{errors.licenseNumber.message}</FormError>}
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label htmlFor='vehicleType' className='block text-sm font-medium'>
                            Vehicle Type
                        </label>
                        <Controller
                            name='vehicleType'
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value as VehicleType}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Select vehicle type' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(VEHICLE_TYPE).map(type => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.vehicleType && <FormError>{errors.vehicleType.message}</FormError>}
                    </div>
                    <div>
                        <label htmlFor='vehiclePlateNumber' className='block text-sm font-medium'>
                            Vehicle Plate Number
                        </label>
                        <Input
                            id='vehiclePlateNumber'
                            {...register('vehiclePlateNumber')}
                            placeholder='Enter vehicle plate number'
                        />
                        {errors.vehiclePlateNumber && (
                            <FormError>{errors.vehiclePlateNumber.message}</FormError>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor='vehicleCapacity' className='block text-sm font-medium'>
                        Vehicle Capacity (kg)
                    </label>
                    <Input
                        id='vehicleCapacity'
                        type='number'
                        {...register('vehicleCapacity', {
                            setValueAs: (value: string) => (value ? parseInt(value) : null)
                        })}
                        placeholder='Enter vehicle capacity'
                    />
                    {errors.vehicleCapacity && (
                        <FormError>{errors.vehicleCapacity.message}</FormError>
                    )}
                </div>

                {/* Operating Hours */}
                <div className='space-y-4'>
                    <h3 className='text-lg font-medium'>Operating Hours</h3>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium mb-1'>
                                Work Start Time
                            </label>
                            <Controller
                                name='workStartTime'
                                control={control}
                                render={({ field }) => (
                                    <TimePicker
                                        value={field.value}
                                        onChange={(time: string | undefined) => {
                                            field.onChange(time)
                                            const startHour = parseInt(time?.split(':')[0] || '0')
                                            const endHour = parseInt(
                                                watch('workEndTime')?.split(':')[0] || '0'
                                            )
                                            if (endHour <= startHour) {
                                                setValue('workEndTime', `${startHour + 1}:00:00`)
                                            }
                                        }}
                                    />
                                )}
                            />
                            {errors.workStartTime && (
                                <FormError>{errors.workStartTime.message}</FormError>
                            )}
                        </div>
                        <div>
                            <label className='block text-sm font-medium mb-1'>Work End Time</label>
                            <Controller
                                name='workEndTime'
                                control={control}
                                render={({ field }) => (
                                    <TimePicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        minTime={watch('workStartTime')}
                                    />
                                )}
                            />
                            {errors.workEndTime && (
                                <FormError>{errors.workEndTime.message}</FormError>
                            )}
                        </div>
                    </div>
                </div>

                {/* Delivery Preferences */}
                <div className='space-y-4'>
                    <h3 className='text-lg font-medium'>Delivery Preferences</h3>
                    <div>
                        <label htmlFor='preferredAreas' className='block text-sm font-medium'>
                            Preferred Areas
                        </label>
                        <Input
                            id='preferredAreas'
                            {...register('preferredAreas')}
                            placeholder='Enter preferred delivery areas'
                        />
                        {errors.preferredAreas && (
                            <FormError>{errors.preferredAreas.message}</FormError>
                        )}
                    </div>

                    <div>
                        <label htmlFor='maxDeliveryRadius' className='block text-sm font-medium'>
                            Max Delivery Radius (km)
                        </label>
                        <Input
                            id='maxDeliveryRadius'
                            type='number'
                            {...register('maxDeliveryRadius', {
                                setValueAs: (value: string) => (value ? parseInt(value) : null)
                            })}
                            placeholder='Enter maximum delivery radius'
                        />
                        {errors.maxDeliveryRadius && (
                            <FormError>{errors.maxDeliveryRadius.message}</FormError>
                        )}
                    </div>
                </div>

                {/* Rate Information */}
                <div className='space-y-4'>
                    <h3 className='text-lg font-medium'>Rate Information</h3>
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label htmlFor='baseRate' className='block text-sm font-medium'>
                                Base Rate (VND)
                            </label>
                            <Input
                                id='baseRate'
                                type='number'
                                {...register('baseRate')}
                                placeholder='Enter base rate'
                            />
                            {errors.baseRate && <FormError>{errors.baseRate.message}</FormError>}
                        </div>
                        <div>
                            <label htmlFor='ratePerKm' className='block text-sm font-medium'>
                                Rate per KM (VND)
                            </label>
                            <Input
                                id='ratePerKm'
                                type='number'
                                {...register('ratePerKm')}
                                placeholder='Enter rate per kilometer'
                            />
                            {errors.ratePerKm && <FormError>{errors.ratePerKm.message}</FormError>}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default CreateDriverForm
