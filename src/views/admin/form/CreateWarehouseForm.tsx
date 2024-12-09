import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { WAREHOUSE_TYPE, HANOI_LOCATION } from '@/constant/enum'
import { warehouseSchema, WarehouseFormData } from '@/schemas/warehouse.schema'
import { FormError } from '@/components/ui/form-error'
import AppMap from '@/components/AppMap'
import FormSelect from '@/components/FormSelect'
import { Button } from '@/components/ui/button'

interface CreateWarehouseFormProps {
    id?: string
    onSubmit: (data: WarehouseFormData) => void
    length?: number
}

const CreateWarehouseForm: React.FC<CreateWarehouseFormProps> = ({ onSubmit, length }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<WarehouseFormData>({
        resolver: zodResolver(warehouseSchema),
        defaultValues: {
            name: `Warehouse ${length ? length + 1 : 1}`,
            address: 'Tan Binh District, Ho Chi Minh City',
            latitude: 10.762622,
            longitude: 106.660172,
            totalCapacity: 100,
            totalArea: 100,
            type: WAREHOUSE_TYPE.NORMAL,
            managerId: 1
        }
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-4'>
                <h3 className='text-lg font-medium'>Basic Information</h3>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <label htmlFor='name' className='block text-sm font-medium'>
                            Warehouse Name
                        </label>
                        <Input id='name' {...register('name')} placeholder='Enter warehouse name' />
                        {errors.name && <FormError>{errors.name.message}</FormError>}
                    </div>
                </div>

                <div>
                    <label htmlFor='address' className='block text-sm font-medium'>
                        Address
                    </label>
                    <Input id='address' {...register('address')} placeholder='Enter full address' />
                    {errors.address && <FormError>{errors.address.message}</FormError>}
                </div>

                <div className='w-full'>
                    <AppMap
                        center={[HANOI_LOCATION.LAT, HANOI_LOCATION.LNG]}
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
                            {...register('totalCapacity', { valueAsNumber: true })}
                            placeholder='Enter total capacity'
                        />
                        {errors.totalCapacity && (
                            <FormError>{errors.totalCapacity.message}</FormError>
                        )}
                    </div>
                    <div>
                        <label htmlFor='totalArea' className='block text-sm font-medium'>
                            Total Area (m²)
                        </label>
                        <Input
                            id='totalArea'
                            type='number'
                            {...register('totalArea', { valueAsNumber: true })}
                            placeholder='Enter total area'
                        />
                        {errors.totalArea && <FormError>{errors.totalArea.message}</FormError>}
                    </div>
                    <div>
                        <label htmlFor='type' className='block text-sm font-medium'>
                            Warehouse Type
                        </label>
                        <FormSelect<string>
                            selected={watch('type')}
                            onSelect={value => {
                                setValue('type', value)
                            }}
                            options={Object.values(WAREHOUSE_TYPE).map(type => ({
                                label: type,
                                value: type
                            }))}
                        />
                        {errors.type && <FormError>{errors.type.message}</FormError>}
                    </div>
                </div>
            </div>
            <div className='flex justify-end'>
                <Button variant='accentGhost' type='submit'>
                    Create
                </Button>
            </div>
        </form>
    )
}

export default CreateWarehouseForm
