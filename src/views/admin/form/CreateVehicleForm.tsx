import { VehicleFormValues, vehicleSchema } from '@/schemas/vehicleSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { FormError } from '@/components/ui/form-error'
import AppMap from '@/components/AppMap'

interface CreateVehicleFormProps {
    onSubmit: (data: VehicleFormValues) => Promise<void>
    id?: string
}

const CreateVehicleForm = ({ onSubmit, id }: CreateVehicleFormProps) => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors }
    } = useForm<VehicleFormValues>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            vehicleCode: 'DG1B3VQXZ',
            capacity: 0,
            costPerKm: 0,
            initialLat: 90,
            initialLng: 180
        }
    })
    return (
        <form id={id} onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Basic Information */}
            <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Basic Information</h3>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label htmlFor='vehicleCode' className='block text-sm font-medium'>
                            Vehicle Code
                        </label>
                        <Input
                            id='vehicleCode'
                            {...register('vehicleCode')}
                            placeholder='Enter vehicle code (9 characters)'
                        />
                        {errors.vehicleCode && <FormError>{errors.vehicleCode.message}</FormError>}
                    </div>
                    <div>
                        <label htmlFor='capacity' className='block text-sm font-medium'>
                            Capacity (m³)
                        </label>
                        <Input
                            id='capacity'
                            type='number'
                            {...register('capacity', { valueAsNumber: true })}
                            placeholder='Enter vehicle capacity'
                        />
                        {errors.capacity && <FormError>{errors.capacity.message}</FormError>}
                    </div>
                </div>

                <div>
                    <label htmlFor='costPerKm' className='block text-sm font-medium'>
                        Cost per Kilometer
                    </label>
                    <Input
                        id='costPerKm'
                        type='number'
                        {...register('costPerKm', { valueAsNumber: true })}
                        placeholder='Enter cost per kilometer'
                    />
                    {errors.costPerKm && <FormError>{errors.costPerKm.message}</FormError>}
                </div>

                <div className='w-full'>
                    <AppMap
                        center={[10.762622, 106.660172]}
                        zoom={13}
                        currentMarker={{
                            lat: watch('initialLat'),
                            lng: watch('initialLng')
                        }}
                        onMarkerClick={marker => {
                            setValue('initialLat', marker.lat)
                            setValue('initialLng', marker.lng)
                        }}
                    />
                </div>
            </div>
        </form>
    )
}

export default CreateVehicleForm
