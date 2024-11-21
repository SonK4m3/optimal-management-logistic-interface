import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { WAREHOUSE_TYPE } from '@/constant/enum'
import { warehouseSchema, type WarehouseFormData } from '@/schemas/warehouse.schema'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { FormError } from '@/components/ui/form-error'
import { Controller } from 'react-hook-form'
import { WarehouseFormValues, WarehouseType } from '@/types/warehouse'
import TimePicker from '@/components/TimePicker'
import AppMap from '@/components/AppMap'

interface CreateWarehouseFormProps {
    id?: string
    onSubmit: (data: WarehouseFormData) => void
}

const CreateWarehouseForm: React.FC<CreateWarehouseFormProps> = ({ id, onSubmit }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
        watch
    } = useForm<WarehouseFormValues>({
        resolver: zodResolver(warehouseSchema),
        defaultValues: {
            code: 'WH-001',
            name: 'Main Warehouse',
            address: '456 Warehouse Ave, Cityville, ST 12345',
            latitude: 10.762622, // Default latitude for a central location
            longitude: 106.660172, // Default longitude for a central location
            totalCapacity: 1000, // Default capacity for a warehouse
            type: WAREHOUSE_TYPE.GENERAL,
            city: 'Cityville',
            state: 'ST',
            country: 'Country',
            postalCode: '12345',
            phone: '555-123-4567',
            email: 'contact@mainwarehouse.com',
            contactPerson: 'John Doe',
            openingTime: '08:00:00', // Default opening time
            closingTime: '17:00:00', // Default closing time
            isOpen24Hours: false,
            workingDays: 'Monday to Friday',
            hasLoadingDock: true,
            hasRefrigeration: false, // Default to no refrigeration
            hasSecuritySystem: true,
            temperatureMin: -10, // Default minimum temperature for refrigerated items
            temperatureMax: 30, // Default maximum temperature for refrigerated items
            area: 1000
        }
    })

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            id={id || 'create-warehouse-form'}
            className='space-y-6'
        >
            {/* Basic Information */}
            <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Basic Information</h3>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label htmlFor='code' className='block text-sm font-medium'>
                            Warehouse Code
                        </label>
                        <Input
                            id='code'
                            {...register('code')}
                            placeholder='Enter warehouse code (WH-XXX)'
                        />
                        {errors.code && <FormError>{errors.code.message}</FormError>}
                    </div>
                    <div>
                        <label htmlFor='name' className='block text-sm font-medium'>
                            Warehouse Name
                        </label>
                        <Input id='name' {...register('name')} placeholder='Enter warehouse name' />
                    </div>
                </div>

                <div>
                    <label htmlFor='address' className='block text-sm font-medium'>
                        Address
                    </label>
                    <Input id='address' {...register('address')} placeholder='Enter full address' />
                </div>

                <div className='w-full'>
                    <AppMap
                        center={[10.762622, 106.660172]}
                        zoom={13}
                        currentMarker={{
                            lat: watch('latitude'),
                            lng: watch('longitude')
                        }}
                        onMarkerClick={marker => {
                            setValue('latitude', marker.lat)
                            setValue('longitude', marker.lng)
                        }}
                    />
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label htmlFor='totalCapacity' className='block text-sm font-medium'>
                            Total Capacity (m³)
                        </label>
                        <Input
                            id='totalCapacity'
                            type='number'
                            {...register('totalCapacity')}
                            placeholder='Enter total capacity'
                        />
                    </div>
                    <div>
                        <label htmlFor='type' className='block text-sm font-medium'>
                            Warehouse Type
                        </label>
                        <Select onValueChange={value => setValue('type', value as WarehouseType)}>
                            <SelectTrigger>
                                <SelectValue placeholder='Select warehouse type' />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(WAREHOUSE_TYPE).map(type => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.type && <FormError>{errors.type.message}</FormError>}
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label htmlFor='phone' className='block text-sm font-medium'>
                            Phone Number
                        </label>
                        <Input id='phone' {...register('phone')} placeholder='Enter phone number' />
                    </div>
                    <div>
                        <label htmlFor='email' className='block text-sm font-medium'>
                            Email
                        </label>
                        <Input
                            id='email'
                            type='email'
                            {...register('email')}
                            placeholder='Enter email address'
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor='contactPerson' className='block text-sm font-medium'>
                        Contact Person
                    </label>
                    <Input
                        id='contactPerson'
                        {...register('contactPerson')}
                        placeholder='Enter contact person name'
                    />
                </div>

                {watch('hasRefrigeration') && (
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label htmlFor='temperatureMin' className='block text-sm font-medium'>
                                Min Temperature (°C)
                            </label>
                            <Input
                                id='temperatureMin'
                                type='number'
                                {...register('temperatureMin', { valueAsNumber: true })}
                                placeholder='Enter min temperature'
                            />
                            {errors.temperatureMin && (
                                <FormError>{errors.temperatureMin.message}</FormError>
                            )}
                        </div>
                        <div>
                            <label htmlFor='temperatureMax' className='block text-sm font-medium'>
                                Max Temperature (°C)
                            </label>
                            <Input
                                id='temperatureMax'
                                type='number'
                                {...register('temperatureMax')}
                                placeholder='Enter max temperature'
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Location Information */}
            <div className='space-y-4'>
                <div>
                    <label htmlFor='address' className='block text-sm font-medium'>
                        Address
                    </label>
                    <Input id='address' {...register('address')} placeholder='Enter full address' />
                    {errors.address && <FormError>{errors.address.message}</FormError>}
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label htmlFor='city' className='block text-sm font-medium'>
                            City
                        </label>
                        <Input id='city' {...register('city')} placeholder='Enter city' />
                        {errors.city && <FormError>{errors.city.message}</FormError>}
                    </div>
                    <div>
                        <label htmlFor='state' className='block text-sm font-medium'>
                            State
                        </label>
                        <Input id='state' {...register('state')} placeholder='Enter state' />
                        {errors.state && <FormError>{errors.state.message}</FormError>}
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label htmlFor='country' className='block text-sm font-medium'>
                            Country
                        </label>
                        <Input id='country' {...register('country')} placeholder='Enter country' />
                        {errors.country && <FormError>{errors.country.message}</FormError>}
                    </div>
                    <div>
                        <label htmlFor='postalCode' className='block text-sm font-medium'>
                            Postal Code
                        </label>
                        <Input
                            id='postalCode'
                            {...register('postalCode')}
                            placeholder='Enter postal code'
                        />
                        {errors.postalCode && <FormError>{errors.postalCode.message}</FormError>}
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                    {/* ... existing latitude and longitude fields ... */}
                </div>
            </div>

            {/* Operating Hours */}
            <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Operating Hours</h3>

                <div className='space-y-2'>
                    <div className='flex items-center space-x-2'>
                        <Controller
                            name='isOpen24Hours'
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    id='isOpen24Hours'
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                        <label htmlFor='isOpen24Hours' className='text-sm font-medium'>
                            Open 24 Hours
                        </label>
                    </div>
                </div>

                {!watch('isOpen24Hours') && (
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium mb-1'>Opening Time</label>
                            <Controller
                                name='openingTime'
                                control={control}
                                render={({ field }) => (
                                    <TimePicker
                                        value={field.value}
                                        onChange={time => {
                                            field.onChange(time)
                                            // Validate closing time is after opening time
                                            const openingHour = parseInt(time?.split(':')[0] || '0')
                                            const closingHour = parseInt(
                                                watch('closingTime')?.split(':')[0] || '0'
                                            )
                                            if (closingHour <= openingHour) {
                                                setValue('closingTime', `${openingHour + 1}:00:00`)
                                            }
                                        }}
                                    />
                                )}
                            />
                            {errors.openingTime && (
                                <FormError>{errors.openingTime.message}</FormError>
                            )}
                        </div>
                        <div>
                            <label className='block text-sm font-medium mb-1'>Closing Time</label>
                            <Controller
                                name='closingTime'
                                control={control}
                                render={({ field }) => (
                                    <TimePicker
                                        value={field.value}
                                        onChange={field.onChange}
                                        minTime={watch('openingTime')} // Prevent selecting time before opening
                                    />
                                )}
                            />
                            {errors.closingTime && (
                                <FormError>{errors.closingTime.message}</FormError>
                            )}
                        </div>
                    </div>
                )}

                <div>
                    <label htmlFor='workingDays' className='block text-sm font-medium'>
                        Working Days
                    </label>
                    <Input
                        id='workingDays'
                        {...register('workingDays')}
                        placeholder='e.g., Monday to Friday'
                    />
                    {errors.workingDays && <FormError>{errors.workingDays.message}</FormError>}
                </div>
            </div>

            {/* Facility Features */}
            <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Facility Features</h3>
                <div className='space-y-2'>
                    <div className='flex items-center space-x-4'>
                        <div className='flex items-center space-x-2'>
                            <Controller
                                name='hasLoadingDock'
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        id='hasLoadingDock'
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <label htmlFor='hasLoadingDock' className='text-sm font-medium'>
                                Loading Dock
                            </label>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Controller
                                name='hasRefrigeration'
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        id='hasRefrigeration'
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <label htmlFor='hasRefrigeration' className='text-sm font-medium'>
                                Refrigeration
                            </label>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <Controller
                                name='hasSecuritySystem'
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        id='hasSecuritySystem'
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <label htmlFor='hasSecuritySystem' className='text-sm font-medium'>
                                Security System
                            </label>
                        </div>
                    </div>
                </div>

                {watch('hasRefrigeration') && (
                    <div className='grid grid-cols-2 gap-4'>
                        {/* ... existing temperature fields ... */}
                    </div>
                )}
            </div>
        </form>
    )
}

export default CreateWarehouseForm
